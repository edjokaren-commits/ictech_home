"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, PhoneCall } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

export default function FloatingContact() {
  const pathname = usePathname();

  if (pathname === "/contact" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <a
        href={`tel:${COMPANY_INFO.phone.replace(/-/g, "")}`}
        className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur transition hover:border-blue-300 hover:text-blue-600 sm:inline-flex"
      >
        <PhoneCall className="h-3.5 w-3.5 text-blue-600" />
        대표전화 {COMPANY_INFO.phone}
      </a>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-900/25 transition hover:bg-blue-700"
      >
        <MessageSquareText className="h-4 w-4" />
        빠른 견적 문의
      </Link>
    </div>
  );
}
