import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsCatalogClient from "@/components/products/ProductsCatalogClient";
import { getAllProducts } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "제품 라인업 | (주)아이씨테크",
  description:
    "IMBA-R680, PCIE-RPL-Q670 등 IEI 산업용 메인보드, PICMG 1.3 CPU 카드, 팬리스 박스 PC, 랙마운트 IPC 및 패널 PC 카탈로그입니다.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white">
        <div className="bg-tech-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            PRODUCT CATALOG · {products.length} MODELS
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            산업용 컴퓨터 · 메인보드 · 케이스 및 기타 라인업
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            IEI 공식 파트너 아이씨테크가 공급하는 다양한 산업용 컴퓨터, 산업용 메인보드, 케이스 및 기타 제품을 스펙 필터로 빠르게 탐색해 보세요.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-slate-500 sm:px-6">
            제품 카탈로그를 불러오는 중입니다...
          </div>
        }
      >
        <ProductsCatalogClient initialProducts={products} />
      </Suspense>
    </div>
  );
}
