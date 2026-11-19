import { CheckCircle2, AlertTriangle } from "lucide-react";
import { WHY_ICTECH_COMPARISON } from "@/data/company";

export default function WhyICTechSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            WHY INDUSTRIAL GRADE
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            왜 일반 PC가 아니라 아이씨테크의 산업용 솔루션인가요?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            초기 도입 비용보다 중요한 것은 설비 가동 중단(Downtime) 없는 안정성과
            장기간 동일한 부품 수급입니다.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-12 border-b border-slate-200 bg-slate-900 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300 md:grid">
            <div className="col-span-3">비교 항목</div>
            <div className="col-span-4 text-slate-400">일반 사무용 / 조립 PC</div>
            <div className="col-span-5 text-sky-400">아이씨테크 산업용 솔루션</div>
          </div>

          <div className="divide-y divide-slate-200">
            {WHY_ICTECH_COMPARISON.map((row) => (
              <div
                key={row.criterion}
                className="grid gap-3 px-5 py-5 md:grid-cols-12 md:items-center md:gap-4 md:px-6"
              >
                <div className="text-sm font-bold text-slate-900 md:col-span-3">
                  {row.criterion}
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-500 md:col-span-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>{row.standardPc}</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-blue-50/70 p-3 text-sm font-medium text-slate-900 md:col-span-5 md:bg-transparent md:p-0">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{row.ictech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

