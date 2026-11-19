import Link from "next/link";
import { Factory, Eye, MonitorSmartphone, Stethoscope, ArrowUpRight } from "lucide-react";
import { APPLICATION_INDUSTRIES } from "@/data/company";

const APP_ICONS = [Factory, Eye, MonitorSmartphone, Stethoscope];

export default function ApplicationsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              APPLICATION INDUSTRIES
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              다양한 산업 현장과 장비에 검증된 적용 사례
            </h2>
          </div>
          <Link
            href="/contact?type=custom"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            우리 현장에 맞는 모델 추천받기 →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {APPLICATION_INDUSTRIES.map((industry, idx) => {
            const Icon = APP_ICONS[idx % APP_ICONS.length];
            return (
              <div
                key={industry.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition hover:border-blue-300 hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{industry.title}</h3>
                        <p className="text-xs font-medium text-blue-600">{industry.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {industry.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {industry.keySpecs.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs">
                  <span className="text-slate-500">
                    추천 모델:{" "}
                    <strong className="font-mono text-slate-800">
                      {industry.recommendedModels.join(", ")}
                    </strong>
                  </span>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                  >
                    스펙 확인
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

