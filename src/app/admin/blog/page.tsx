import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import BlogAdminClient from "@/components/admin/BlogAdminClient";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllBlogPosts } from "@/lib/blog-store";
import { getAllProducts } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 모드 · 기술 블로그 관리 | (주)아이씨테크",
  description:
    "관리자 전용 기술 블로그 게시글 조회, 추가, 수정 및 삭제 관리 페이지입니다.",
};

export default async function AdminBlogPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/admin/blog");
  }

  const [posts, products] = await Promise.all([
    getAllBlogPosts(),
    getAllProducts(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 py-12 text-white">
        <div className="bg-tech-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            ADMIN MODE · BLOG MANAGEMENT
          </span>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            기술 블로그(BLOG) 작성 · 수정 및 콘텐츠 관리
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            기술지원 블로그 게시글의 본문, 체크리스트, 코드/핀맵, 연관 제품 링크를 직접 추가하거나 수정·삭제할 수 있습니다.
          </p>
        </div>
      </section>

      <AdminNav active="blog" />
      <BlogAdminClient initialPosts={posts} products={products} />
    </div>
  );
}

