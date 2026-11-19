import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  addOrUpdateProduct,
  getAllProducts,
  resetDefaultProducts,
  saveAllProducts,
} from "@/lib/products-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { Product, ProductCategory } from "@/data/products";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ipc: "산업용 컴퓨터",
  motherboard: "산업용 메인보드",
  module: "케이스 및 기타",
};

function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProduct(input: Partial<Product>): Product {
  const category: ProductCategory =
    input.category === "motherboard" || input.category === "module" ? input.category : "ipc";
  const modelCode = (input.modelCode ?? "").trim() || "NEW-MODEL";
  const slug = sanitizeSlug(input.slug || modelCode) || `product-${Date.now()}`;

  return {
    slug,
    modelCode,
    name: (input.name ?? "").trim() || modelCode,
    category,
    categoryLabel: input.categoryLabel || CATEGORY_LABELS[category],
    visualType:
      input.visualType ||
      (category === "motherboard" ? "atx" : category === "module" ? "pcie-card" : "box-pc"),
    tagline: (input.tagline ?? "").trim() || `${modelCode} 산업용 솔루션`,
    summary: (input.summary ?? "").trim() || (input.tagline ?? "").trim() || `${modelCode} 제품입니다.`,
    badges: Array.isArray(input.badges) ? input.badges.filter(Boolean) : [],
    filterTags: Array.isArray(input.filterTags) ? input.filterTags.filter(Boolean) : ["장기공급"],
    highlights: Array.isArray(input.highlights) ? input.highlights.filter(Boolean) : [],
    applications: Array.isArray(input.applications) ? input.applications.filter(Boolean) : [],
    specs: Array.isArray(input.specs) ? input.specs.filter((s) => s.label && s.value) : [],
    supplyYears: (input.supplyYears ?? "").trim() || "7년 장기 공급 보장",
    operatingTemp: (input.operatingTemp ?? "").trim() || "0°C ~ 60°C",
    manufacturer: (input.manufacturer ?? "").trim() || "IEI / ICTech",
    externalUrl: (input.externalUrl ?? "").trim() || undefined,
    imageUrl: (input.imageUrl ?? "").trim() || undefined,
    datasheetUrl: (input.datasheetUrl ?? "").trim() || undefined,
  };
}

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }
  try {
    const body = await request.json();

    // Bulk JSON import support
    if (Array.isArray(body?.products)) {
      const existing = await getAllProducts();
      const map = new Map(existing.map((p) => [p.slug, p]));
      for (const item of body.products) {
        const normalized = normalizeProduct(item);
        map.set(normalized.slug, normalized);
      }
      const next = Array.from(map.values());
      await saveAllProducts(next);
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/admin/products");
      return NextResponse.json({ products: next, imported: body.products.length });
    }

    const product = normalizeProduct(body);
    const next = await addOrUpdateProduct(product);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/admin/products");
    return NextResponse.json({ product, products: next }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "제품 등록 처리 중 오류가 발생했습니다.", detail: String(error) },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (body?.action === "reset") {
      const products = await resetDefaultProducts();
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/admin/products");
      return NextResponse.json({ products });
    }
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

