import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteProductBySlug, getProductBySlug } from "@/lib/products-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }
  const { slug } = await context.params;
  const products = await deleteProductBySlug(slug);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
  return NextResponse.json({ products });
}

