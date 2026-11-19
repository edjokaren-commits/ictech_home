import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import ProductAdminClient from "@/components/admin/ProductAdminClient";
import { getAllProducts } from "@/lib/products-store";
import { getHeroSettings } from "@/lib/hero-store";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 모드 · 제품 등록 및 관리 | (주)아이씨테크",
  description:
    "관리자 전용 제품 등록, 수정, 삭제 및 이미지 업로드 관리 페이지입니다.",
};

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/admin/products");
  }

  const [products, heroSettings] = await Promise.all([
    getAllProducts(),
    getHeroSettings(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 py-12 text-white">
        <div className="bg-tech-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            ADMIN MODE · PROTECTED
          </span>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            제품 등록 · 설치 및 카탈로그 관리 플랫폼
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            관리자 인증이 완료된 세션입니다. 신규 제품 등록, 스펙 수정, 이미지 업로드, 메인 슬라이드 배너 설정 및 JSON 일괄 설치를 수행할 수 있습니다.
          </p>
        </div>
      </section>

      <AdminNav active="products" />
      <ProductAdminClient
        initialProducts={products}
        initialHeroSettings={heroSettings}
      />
    </div>
  );
}
