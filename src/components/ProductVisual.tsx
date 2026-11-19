import type { Product } from "@/data/products";

interface ProductVisualProps {
  type: Product["visualType"];
  modelCode: string;
  imageUrl?: string;
  compact?: boolean;
}

export default function ProductVisual({
  type,
  modelCode,
  imageUrl,
  compact = false,
}: ProductVisualProps) {
  if (imageUrl) {
    return (
      <div
        className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white ${
          compact ? "p-4" : "p-6 sm:p-8"
        }`}
      >
        <span className="absolute left-3 top-3 z-10 rounded-md border border-slate-200 bg-white/95 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-slate-700 shadow-xs backdrop-blur-xs">
          {modelCode}
        </span>
        <img
          src={imageUrl}
          alt={modelCode}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white ${
        compact ? "p-5" : "p-6 sm:p-8"
      }`}
    >
      {/* Subtle light blueprint grid */}
      <div className="bg-tech-grid-light pointer-events-none absolute inset-0 opacity-70" />

      {/* Top-left model tag */}
      <span className="absolute left-3 top-3 z-10 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-slate-700">
        {modelCode}
      </span>

      {/* Schematic hardware SVG per product form factor */}
      {type === "box-pc" && (
        <svg viewBox="0 0 240 130" className="relative z-10 h-full w-full max-w-[240px] object-contain" fill="none">
          {[22, 30, 38, 46, 54, 62, 70, 78].map((y) => (
            <line key={y} x1="30" y1={y} x2="210" y2={y} stroke="#0284C7" strokeOpacity="0.25" strokeWidth="2" />
          ))}
          <rect x="26" y="18" width="188" height="84" rx="6" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
          <rect x="34" y="26" width="172" height="18" rx="2" fill="#E2E8F0" stroke="#94A3B8" />
          <rect x="40" y="60" width="22" height="14" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="68" y="60" width="22" height="14" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="98" y="62" width="14" height="10" rx="1.5" stroke="#475569" strokeWidth="1.4" />
          <rect x="118" y="62" width="14" height="10" rx="1.5" stroke="#475569" strokeWidth="1.4" />
          <rect x="142" y="60" width="24" height="14" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <circle cx="188" cy="67" r="6" stroke="#16A34A" strokeWidth="1.8" />
          <circle cx="188" cy="67" r="2" fill="#16A34A" />
          <rect x="16" y="88" width="14" height="10" rx="2" fill="#475569" />
          <rect x="210" y="88" width="14" height="10" rx="2" fill="#475569" />
        </svg>
      )}

      {type === "rackmount" && (
        <svg viewBox="0 0 240 130" className="relative z-10 h-full w-full max-w-[240px] object-contain" fill="none">
          <rect x="18" y="20" width="204" height="90" rx="4" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
          <rect x="10" y="24" width="8" height="82" rx="1" fill="#475569" />
          <rect x="222" y="24" width="8" height="82" rx="1" fill="#475569" />
          {[28, 66, 104, 142].map((x) => (
            <g key={x}>
              <rect x={x} y="32" width="32" height="66" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.4" />
              <line x1={x + 6} y1="44" x2={x + 26} y2="44" stroke="#0284C7" strokeOpacity="0.7" strokeWidth="2" />
              <line x1={x + 6} y1="54" x2={x + 26} y2="54" stroke="#0284C7" strokeOpacity="0.4" strokeWidth="2" />
              <circle cx={x + 25} cy="86" r="2.5" fill="#16A34A" />
            </g>
          ))}
          <rect x="182" y="32" width="30" height="66" rx="2" fill="#E2E8F0" stroke="#0284C7" strokeOpacity="0.5" />
          <circle cx="197" cy="48" r="5" stroke="#0284C7" strokeWidth="1.6" />
          <rect x="189" y="65" width="16" height="8" rx="1" stroke="#475569" />
          <rect x="189" y="79" width="16" height="8" rx="1" stroke="#475569" />
        </svg>
      )}

      {type === "panel-pc" && (
        <svg viewBox="0 0 240 130" className="relative z-10 h-full w-full max-w-[240px] object-contain" fill="none">
          <rect x="28" y="14" width="184" height="102" rx="6" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
          <rect x="38" y="24" width="164" height="82" rx="3" fill="#0F172A" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="48" y="34" width="66" height="28" rx="2" fill="#0284C7" fillOpacity="0.22" stroke="#38BDF8" strokeOpacity="0.6" />
          <path d="M54 54 L68 44 L82 50 L104 38" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <rect x="122" y="34" width="70" height="28" rx="2" fill="#1E293B" stroke="#475569" />
          <circle cx="140" cy="48" r="7" stroke="#22C55E" strokeWidth="2" />
          <line x1="154" y1="45" x2="184" y2="45" stroke="#94A3B8" strokeWidth="2" />
          <line x1="154" y1="52" x2="176" y2="52" stroke="#64748B" strokeWidth="2" />
          <rect x="48" y="70" width="144" height="26" rx="2" fill="#1E293B" stroke="#334155" />
          <text x="58" y="87" fill="#38BDF8" fontSize="9" fontFamily="monospace">IP65 HMI · SYSTEM ONLINE</text>
        </svg>
      )}

      {type === "din-rail" && (
        <svg viewBox="0 0 240 130" className="relative z-10 h-full w-full max-w-[240px] object-contain" fill="none">
          <rect x="20" y="54" width="200" height="22" fill="#E2E8F0" stroke="#94A3B8" />
          <rect x="84" y="14" width="72" height="102" rx="5" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.8" />
          <rect x="92" y="22" width="56" height="18" rx="2" fill="#E2E8F0" stroke="#94A3B8" />
          <circle cx="102" cy="31" r="2.5" fill="#16A34A" />
          <circle cx="112" cy="31" r="2.5" fill="#0284C7" />
          <circle cx="122" cy="31" r="2.5" fill="#0284C7" />
          <rect x="94" y="48" width="52" height="22" rx="2" fill="#E0F2FE" stroke="#0284C7" />
          <rect x="94" y="78" width="22" height="14" rx="1.5" stroke="#475569" strokeWidth="1.4" />
          <rect x="124" y="78" width="22" height="14" rx="1.5" stroke="#475569" strokeWidth="1.4" />
          <rect x="94" y="98" width="52" height="10" rx="1.5" fill="#DCFCE7" stroke="#16A34A" strokeOpacity="0.7" />
        </svg>
      )}

      {(type === "mini-itx" || type === "atx" || type === "sbc") && (
        <svg viewBox="0 0 240 130" className="relative z-10 h-full w-full max-w-[240px] object-contain" fill="none">
          <rect
            x={type === "atx" ? "36" : type === "sbc" ? "58" : "52"}
            y="14"
            width={type === "atx" ? "168" : type === "sbc" ? "124" : "136"}
            height="102"
            rx="4"
            fill="#ECFDF5"
            stroke="#059669"
            strokeWidth="1.8"
          />
          <rect x="102" y="38" width="38" height="38" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.8" />
          <rect x="110" y="46" width="22" height="22" rx="1.5" fill="#E2E8F0" stroke="#64748B" />
          <rect x="152" y="28" width="7" height="58" rx="1" fill="#0F172A" stroke="#0284C7" strokeWidth="1.2" />
          <rect x="164" y="28" width="7" height="58" rx="1" fill="#0F172A" stroke="#0284C7" strokeWidth="1.2" />
          <rect x="64" y="88" width="78" height="7" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
          {type === "atx" && (
            <rect x="64" y="100" width="78" height="7" rx="1" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          )}
          <rect x="52" y="22" width="18" height="48" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <rect x="152" y="92" width="32" height="16" rx="2" fill="#D1FAE5" stroke="#059669" />
        </svg>
      )}

      {type === "pcie-card" && (
        <svg viewBox="0 0 240 130" className="relative z-10 h-full w-full max-w-[240px] object-contain" fill="none">
          <rect x="34" y="18" width="10" height="96" rx="2" fill="#64748B" />
          <rect x="44" y="28" width="156" height="68" rx="3" fill="#ECFDF5" stroke="#059669" strokeWidth="1.8" />
          {[64, 92, 120, 148].map((x) => (
            <rect key={x} x={x} y="42" width="18" height="24" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
          ))}
          <rect x="44" y="38" width="12" height="44" rx="2" fill="#E2E8F0" stroke="#0284C7" />
          <rect x="92" y="96" width="44" height="10" rx="1" fill="#F59E0B" />
        </svg>
      )}

      <span className="absolute bottom-2.5 right-3 font-mono text-[10px] text-slate-400">
        ICTECH 4:3 SPEC
      </span>
    </div>
  );
}
