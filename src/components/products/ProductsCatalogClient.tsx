"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, SlidersHorizontal, Settings2, Download } from "lucide-react";
import {
  PRODUCT_FILTER_TAGS,
  type Product,
  type ProductCategory,
} from "@/data/products";
import ProductVisual from "@/components/ProductVisual";

const CATEGORY_TABS: { key: "all" | ProductCategory; label: string }[] = [
  { key: "all", label: "전체 제품" },
  { key: "ipc", label: "산업용 컴퓨터" },
  { key: "motherboard", label: "산업용 메인보드" },
  { key: "module", label: "케이스 및 기타" },
];

export default function ProductsCatalogClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<"all" | ProductCategory>(
    initialCategory === "ipc" || initialCategory === "motherboard" || initialCategory === "module"
      ? initialCategory
      : "all"
  );
  const [selectedTag, setSelectedTag] = useState<string>("전체");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (
      initialCategory === "ipc" ||
      initialCategory === "motherboard" ||
      initialCategory === "module"
    ) {
      setSelectedCategory(initialCategory);
    } else if (!initialCategory) {
      setSelectedCategory("all");
    }
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchTag =
        selectedTag === "전체" || product.filterTags.includes(selectedTag);
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        product.modelCode.toLowerCase().includes(q) ||
        product.name.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.badges.some((b) => b.toLowerCase().includes(q));
      return matchCategory && matchTag && matchQuery;
    });
  }, [initialProducts, selectedCategory, selectedTag, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Category Tabs + Search */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="IMBA-R680, PICMG, 팬리스 검색..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Spec Filter Chips */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          스펙 필터:
        </span>
        {PRODUCT_FILTER_TAGS.map((tag) => {
          const active = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="mt-6 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          전체 등록 모델 <strong className="text-slate-900">{filteredProducts.length}</strong>개
        </span>
        <span className="text-slate-400">총 {initialProducts.length}개 제품 운영 중</span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-base font-semibold text-slate-800">
            선택하신 조건에 해당하는 기성 모델이 없습니다.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            필요한 I/O 포트나 사양을 알려주시면 맞춤형 OEM/ODM 모델로 제안해 드립니다.
          </p>
          <Link
            href="/contact?type=custom"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            맞춤 사양 제작 문의하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-lg"
            >
              <div>
                <Link href={`/products/${product.slug}`}>
                  <ProductVisual
                    type={product.visualType}
                    modelCode={product.modelCode}
                    imageUrl={product.imageUrl}
                    compact
                  />
                </Link>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-600">
                    {product.categoryLabel}
                    {product.manufacturer ? ` · ${product.manufacturer}` : ""}
                  </span>
                  <span className="font-mono text-slate-500">{product.operatingTemp}</span>
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h2 className="mt-1.5 font-mono text-lg font-bold text-slate-900 hover:text-blue-600">
                    {product.modelCode}
                  </h2>
                  <div className="text-sm font-semibold text-slate-700">{product.name}</div>
                </Link>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {product.tagline}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.badges.slice(0, 4).map((badge) => (
                    <span
                      key={badge}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  상세 스펙
                </Link>
                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    {...(product.datasheetUrl.startsWith("/")
                      ? { download: `${product.modelCode.replace(/\s+/g, "_")}_Datasheet` }
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    title="데이터시트 다운로드"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-600" />
                    데이터시트
                  </a>
                )}
                <Link
                  href={`/contact?product=${encodeURIComponent(product.modelCode)}`}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  이 모델 견적 문의
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Admin Entry Bar */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4">
        <div className="text-xs text-slate-500 sm:text-sm">
          신규 제품 등록, 사양 수정 및 삭제는 관리자 모드에서 진행할 수 있습니다.
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-blue-400 hover:text-blue-700"
        >
          <Settings2 className="h-4 w-4 text-blue-600" />
          관리자 모드 (제품 등록·관리)
        </Link>
      </div>
    </div>
  );
}
