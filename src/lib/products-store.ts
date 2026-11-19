import { PRODUCTS, type Product } from "@/data/products";
import { getSupabaseAdmin } from "@/lib/supabase";

function normalizeCategoryLabel(item: Product): Product {
  return item.category === "module" && item.categoryLabel === "기타 장치"
    ? { ...item, categoryLabel: "케이스 및 기타" }
    : item;
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return PRODUCTS;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("data, updated_at")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      await saveAllProducts(PRODUCTS);
      return PRODUCTS;
    }

    return data.map((row) => normalizeCategoryLabel(row.data as Product));
  } catch (err) {
    console.error("getAllProducts error:", err);
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return PRODUCTS.find((p) => p.slug === slug);

  try {
    const { data, error } = await supabase
      .from("products")
      .select("data")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (data?.data) return normalizeCategoryLabel(data.data as Product);

    const all = await getAllProducts();
    return all.find((p) => p.slug === slug);
  } catch {
    return PRODUCTS.find((p) => p.slug === slug);
  }
}

export async function saveAllProducts(list: Product[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const slugs = list.map((p) => p.slug);
  if (slugs.length > 0) {
    const { data: existing } = await supabase.from("products").select("slug");
    const toDelete = (existing || [])
      .map((r) => r.slug as string)
      .filter((s) => !slugs.includes(s));
    if (toDelete.length > 0) {
      await supabase.from("products").delete().in("slug", toDelete);
    }

    const now = Date.now();
    const rows = list.map((item, idx) => ({
      slug: item.slug,
      data: item,
      updated_at: new Date(now - idx * 1000).toISOString(),
    }));
    const { error } = await supabase.from("products").upsert(rows, { onConflict: "slug" });
    if (error) throw error;
  } else {
    await supabase.from("products").delete().neq("slug", "");
  }
}

export async function addOrUpdateProduct(product: Product): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [product, ...PRODUCTS.filter((p) => p.slug !== product.slug)];

  await getAllProducts();

  const { error } = await supabase.from("products").upsert(
    {
      slug: product.slug,
      data: product,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );
  if (error) throw error;

  return getAllProducts();
}

export async function deleteProductBySlug(slug: string): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return PRODUCTS.filter((p) => p.slug !== slug);

  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) throw error;

  return getAllProducts();
}

export async function resetDefaultProducts(): Promise<Product[]> {
  await saveAllProducts(PRODUCTS);
  return PRODUCTS;
}