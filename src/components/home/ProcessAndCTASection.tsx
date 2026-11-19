import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PROCESS_STEPS } from "@/data/company";

export default function ProcessAndCTASection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* 4-Step Process */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            CUSTOM ENGINEERING PROCESS
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            상담부터 양산 납품까지 체계적인 도입 프로세스
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-6"
            >
              <span className="font-mono text-2xl font-bold text-blue-600">{item.step}</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {item.deliverable}
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA Banner */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                1:1 엔지니어 무료 사양 컨설팅
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                어떤 사양이 필요한지 막막하신가요?
                <span className="block text-sky-400">현장 조건만 알려주세요.</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                적용 설비, 필요한 포트 수량, 예상 수량만 남겨주시면 아이씨테크 엔지니어가
                최적의 사양과 견적을 제안해 드립니다.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-500"
              >
                1분 만에 무료 사양 상담 신청하기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                제품 스펙 먼저 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

