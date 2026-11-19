import { Clock, Cpu, ShieldCheck, Headphones } from "lucide-react";
import { TRUST_METRICS } from "@/data/company";

const ICONS = [Clock, Cpu, ShieldCheck, Headphones];

export default function TrustMetricsBar() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_METRICS.map((metric, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={metric.id}
                className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">{metric.label}</div>
                    <div className="text-base font-bold text-slate-900">{metric.value}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

