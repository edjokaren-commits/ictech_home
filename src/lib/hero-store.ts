import fs from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/data/products";
import {
  type HeroSlide,
  type HeroSettings,
  DEFAULT_HERO_SETTINGS,
  FIXED_FIRST_HERO_SLIDE,
  buildProductSlide,
} from "@/types/hero";

export type { HeroSlide, HeroSettings };
export { DEFAULT_HERO_SETTINGS, FIXED_FIRST_HERO_SLIDE, buildProductSlide };

const DATA_DIR = path.join(process.cwd(), "data");
const HERO_SETTINGS_FILE = path.join(DATA_DIR, "hero-settings.json");

let writeQueue: Promise<void> = Promise.resolve();

async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmpPath, filePath);
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue;
}

export async function getHeroSettings(): Promise<HeroSettings> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(HERO_SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
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
    ? settings.selectedProductSlugs.filter((s) => typeof s === "string" && s.trim())
    : DEFAULT_HERO_SETTINGS.selectedProductSlugs;

  const sanitized: HeroSettings = { totalSlides, selectedProductSlugs };
  await atomicWriteJson(HERO_SETTINGS_FILE, sanitized);
  return sanitized;
}

export function buildHeroSlides(
  products: Product[],
  settings: HeroSettings
): HeroSlide[] {
  const neededProductCount = Math.max(2, Math.min(4, settings.totalSlides - 1));
  const productMap = new Map<string, Product>(products.map((p) => [p.slug, p]));

  // 1번 슬라이드: 항상 고정
  const slides: HeroSlide[] = [FIXED_FIRST_HERO_SLIDE];

  // 2번 슬라이드 이후: 관리자가 선정한 제품 순서대로
  const chosenSlugs = settings.selectedProductSlugs.slice(0, neededProductCount);

  for (const slug of chosenSlugs) {
    const prod = productMap.get(slug);
    if (prod) {
      slides.push(buildProductSlide(prod));
    }
  }

  // 만약 선택된 제품이 부족하면 기본 추천 제품으로 채움
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

  // 여전히 부족하면 목록 앞선 제품으로 채움
  for (const prod of products) {
    if (slides.length >= settings.totalSlides) break;
    if (!slides.some((s) => s.productHref === `/products/${prod.slug}`)) {
      slides.push(buildProductSlide(prod));
    }
  }

  return slides;
}
