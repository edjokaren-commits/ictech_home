"use client";

import { Download } from "lucide-react";
import type { Product } from "@/data/products";

export default function DatasheetButton({ product }: { product: Product }) {
  const href = product.datasheetUrl?.trim();
  if (!href) {
    return null;
  }

  const isLocalFile = href.startsWith("/");

  return (
    <a
      href={href}
      {...(isLocalFile
        ? { download: `${product.modelCode.replace(/\s+/g, "_")}_Datasheet` }
        : { target: "_blank", rel: "noopener noreferrer" })}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-blue-400 hover:bg-slate-50 hover:text-blue-700"
    >
      <Download className="h-4 w-4 text-blue-600" />
      데이터시트 다운로드
    </a>
  );
}
