import type { Product } from "@/data/products";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  type HeroSlide,
  type HeroSettings,
  DEFAULT_HERO_SETTINGS,
  FIXED_FIRST_HERO_SLIDE,
  buildProductSlide,
} from "@/types/hero";

export type { HeroSlide, HeroSettings };
export { DEFAULT_HERO_SETTINGS, FIXED_FIRST_HERO_SLIDE, buildProductSlide };

const HERO_KEY = "hero_settings";

export async function getHeroSettings(): Promise<HeroSettings> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return DEFAULT_HERO_SETTINGS;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("data")
      .eq("key", HERO_KEY)
      .maybeSingle();

    if (error) throw error;
    if (!data?.data) return DEFAULT_HERO_SETTINGS;

    const parsed = data.data as Partial<HeroSettings>;
    const total = Number(parsed.totalSlides);
    const totalSlides = total >= 3 && total <= 5 ? total : 3;
    const selectedProductSlugs = Array.isArray(parsed.selectedProductSlugs)
      ? parsed.selectedProductSlugs.filter((s: unknown) => typeof s === "string" && s.trim())
      : DEFAULT_HERO_SETTINGS.selectedProductSlugs;

    return { totalSlides, selectedProductSlugs };
  } catch {
    return DEFAULT_HERO_SETTINGS;
  }
}

export async function saveHeroSettings(settings: HeroSettings): Promise<HeroSettings> {
  const total = Number(settings.totalSlides);
  const totalSlides = total >= 3 && total <= 5 ? total : 3;
  const selectedProductSlugs = Array.isArray(settings.selectedProductSlugs)
    ? settings.selectedProductSlugs.filter((s: unknown) => typeof s === "string" && s.trim())
    : DEFAULT_HERO_SETTINGS.selectedProductSlugs;

  const sanitized: HeroSettings = { totalSlides, selectedProductSlugs };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: HERO_KEY, data: sanitized }, { onConflict: "key" });
    if (error) throw error;
  }

  return sanitized;
}

export function buildHeroSlides(
  products: Product[],
  settings: HeroSettings
): HeroSlide[] {
  const neededProductCount = Math.max(2, Math.min(4, settings.totalSlides - 1));
  const productMap = new Map<string, Product>(products.map((p) => [p.slug, p]));

  const slides: HeroSlide[] = [FIXED_FIRST_HERO_SLIDE];
  const chosenSlugs = settings.selectedProductSlugs.slice(0, neededProductCount);

  for (const slug of chosenSlugs) {
    const prod = productMap.get(slug);
    if (prod) {
      slides.push(buildProductSlide(prod));
    }
  }

  const fallbackSlugs = ["tank-xm811", "imba-r680", "pcie-rpl-q670", "kino-rpl-q670"];
  for (const slug of fallbackSlugs) {
    if (slides.length >= settings.totalSlides) break;
    if (!slides.some((s) => s.productHref === `/products/${slug}`)) {
      const prod = productMap.get(slug);
      if (prod) {
        slides.push(buildProductSlide(prod));
      }
    }
  }

  for (const prod of products) {
    if (slides.length >= settings.totalSlides) break;
    if (!slides.some((s) => s.productHref === `/products/${prod.slug}`)) {
      slides.push(buildProductSlide(prod));
    }
  }

  return slides;
}