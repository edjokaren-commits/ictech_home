import Link from "next/link";
import { ArrowRight, Server, Cpu, Wrench } from "lucide-react";
import type { Product } from "@/data/products";
import ProductVisual from "@/components/ProductVisual";

const CORE_SERVICES = [
  {
    icon: Server,
    badge: "INDUSTRIAL PC",
    title: "산업용 컴퓨터 제작",
    description:
      "분진·열기·진동이 있는 현장에서도 흔들리지 않는 성능. 팬리스 임베디드 PC, 랙마운트 PC, 패널 PC 등 현장 조건에 맞춰 설계·제작합니다.",
    cta: "산업용 PC 보기",
    href: "/products?category=ipc",
  },
  {
    icon: Cpu,
    badge: "MOTHERBOARD & SBC",
    title: "산업용 메인보드 · CPU 카드",
    description:
      "IMBA-R680, PCIE-RPL-Q670 등 대만 IEI 검증 라인업 공급. ATX, Mini-ITX, 3.5\" SBC, PICMG 1.3 CPU 카드까지 장기 공급을 보장합니다.",
    cta: "메인보드 라인업",
    href: "/products?category=motherboard",
  },
  {
    icon: Wrench,
    badge: "ENGINEERING & SUPPORT",
    title: "기술지원 & 맞춤 솔루션",
    description:
      "하드웨어 납품이 끝이 아닙니다. BIOS 커스터마이징, OS 이미지 최적화, 현장 트러블슈팅까지 엔지니어의 시선으로 함께합니다.",
    cta: "맞춤 제작 상담",
    href: "/contact?type=custom",
  },
];

export default function CoreServicesSection({
  featuredProducts,
}: {
  featuredProducts: Product[];
}) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              CORE SERVICES &amp; PRODUCTS
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              현장 환경에 맞춘 3대 핵심 하드웨어 솔루션
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            전체 카탈로그 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3 Core Service Cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {CORE_SERVICES.map((service) => (
            <div
              key={service.title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-7 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400 transition group-hover:bg-blue-600 group-hover:text-white">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400">
                    {service.badge}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </div>
              <Link
                href={service.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700"
              >
                {service.cta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Featured Hardware Lineup Quick Preview */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">대표 주력 모델 빠른 탐색</h3>
            <span className="text-xs text-slate-500">클릭 시 상세 스펙 및 즉시 견적 연결</span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
              >
                <ProductVisual
                  type={product.visualType}
                  modelCode={product.modelCode}
                  imageUrl={product.imageUrl}
                  compact
                />
                <div className="mt-4 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-600">{product.categoryLabel}</span>
                    <span className="font-mono text-slate-400">{product.operatingTemp}</span>
                  </div>
                  <h4 className="mt-1.5 text-base font-bold text-slate-900 group-hover:text-blue-600">
                    {product.modelCode} · {product.name}
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {product.tagline}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                  {product.badges.slice(0, 3).map((b) => (
                    <span
                      key={b}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
