import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteBlogPostBySlug, getBlogPostBySlug } from "@/lib/blog-store";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }
  const { slug } = await context.params;
  const posts = await deleteBlogPostBySlug(slug);
  revalidatePath("/");
  revalidatePath("/tech-blog");
  revalidatePath(`/tech-blog/${slug}`);
  revalidatePath("/admin/blog");
  return NextResponse.json({ posts });
}
