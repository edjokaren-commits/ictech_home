import type { Metadata } from "next";
import { Suspense } from "react";
import ContactFormClient from "@/components/contact/ContactFormClient";

export const metadata: Metadata = {
  title: "견적 및 기술 상담 문의 | 아이씨테크(ICTech)",
  description:
    "산업용 컴퓨터 견적, 산업용 메인보드 장기 공급 상담, 맞춤형 OEM/ODM 제작 및 엔지니어 기술지원을 신청하세요.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white">
        <div className="bg-tech-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            QUOTE &amp; ENGINEERING SUPPORT
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            견적 · 맞춤 제작 · 기술지원 문의
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            현장 조건과 필요한 I/O 사양을 남겨주시면 아이씨테크 전담 엔지니어가 최적의 모델과 견적을 제안해 드립니다.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-slate-500 sm:px-6">
            문의 양식을 불러오는 중입니다...
          </div>
        }
      >
        <ContactFormClient />
      </Suspense>
    </div>
  );
}

