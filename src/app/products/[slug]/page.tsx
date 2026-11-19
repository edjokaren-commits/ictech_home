import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Thermometer,
  Clock,
  Layers,
  ExternalLink,
} from "lucide-react";
import { getAllProducts, getProductBySlug } from "@/lib/products-store";
import ProductVisual from "@/components/ProductVisual";
import DatasheetButton from "@/components/products/DatasheetButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "제품을 찾을 수 없습니다 | 아이씨테크" };
  }
  return {
    title: `${product.modelCode} ${product.name} | (주)아이씨테크`,
    description: product.summary,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const related = allProducts
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 2);

  return (
    <div className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          전체 제품 라인업으로 돌아가기
        </Link>

        {/* Hero Summary */}
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ProductVisual
              type={product.visualType}
              modelCode={product.modelCode}
              imageUrl={product.imageUrl}
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Thermometer className="h-3.5 w-3.5 text-blue-600" />
                  동작 온도
                </div>
                <div className="mt-1 font-mono text-sm font-bold text-slate-900">
                  {product.operatingTemp}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  공급 수명 주기
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {product.supplyYears}
                </div>
              </div>
            </div>

            {product.externalUrl && (
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
              >
                제조사({product.manufacturer || "IEI"}) 공식 스펙 원문 보기
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {product.categoryLabel}
              </span>
              {product.manufacturer && (
                <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {product.manufacturer}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-mono text-2xl font-bold text-slate-900 sm:text-3xl">
              {product.modelCode}
            </h1>
            <div className="mt-1 text-lg font-semibold text-slate-700">{product.name}</div>
            <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs leading-relaxed text-slate-700">
              {product.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {product.summary}
            </p>

            {/* Badges */}
            {product.badges.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Highlights */}
            {product.highlights.length > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <h2 className="text-sm font-bold text-slate-900">핵심 설계 특장점</h2>
                <ul className="mt-3 space-y-2">
                  {product.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?product=${encodeURIComponent(product.modelCode)}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                이 제품으로 견적 · 샘플 문의하기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <DatasheetButton product={product} />
            </div>
          </div>
        </div>

        {/* Full Specs Table */}
        {product.specs.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-slate-900">상세 하드웨어 사양</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-200">
                  {product.specs.map((spec) => (
                    <tr key={spec.label} className="bg-white">
                      <th className="w-1/3 bg-slate-50 px-5 py-3.5 font-semibold text-slate-700 sm:w-1/4">
                        {spec.label}
                      </th>
                      <td className="px-5 py-3.5 text-slate-800">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applications */}
        {product.applications.length > 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Layers className="h-4 w-4 text-blue-600" />
              주요 적용 설비 및 산업 분야
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.applications.map((app) => (
                <span
                  key={app}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-14 border-t border-slate-200 pt-10">
            <h2 className="text-lg font-bold text-slate-900">함께 검토하기 좋은 모델</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-blue-600">
                      {item.modelCode}
                    </div>
                    <div className="mt-0.5 text-base font-bold text-slate-900">{item.name}</div>
                    <div className="mt-1 line-clamp-1 text-xs text-slate-500">{item.tagline}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
