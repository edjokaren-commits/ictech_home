import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, Cpu, Factory, ShieldCheck, ArrowRight, Wrench, Building2 } from "lucide-react";
import {
  CERTIFICATIONS,
  COMPANY_HISTORY,
  COMPANY_INFO,
  DELIVERY_REFERENCES,
  PROCESS_STEPS,
} from "@/data/company";
import CompanyMaps from "@/components/about/CompanyMaps";

export const metadata: Metadata = {
  title: "회사소개 · 연혁 · 오시는 길 | (주)아이씨테크",
  description:
    "1997년 설립, 대만 IEI 공식 파트너 (주)아이씨테크로 사명 변경, 주요 납품 실적, 구로구 코오롱빌란트2차 본사 오시는 길(네이버 지도)을 안내합니다.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="bg-tech-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            ABOUT ICTECH · SINCE 1997
          </span>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            고객중심의 신뢰경영,
            <span className="block text-sky-400">
              고객과 함께 성장하는 산업용 컴퓨팅 전문 기업 (주)아이씨테크
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            1997년 &apos;산업컴퓨터기술&apos; 설립 이래 대만 IEI 공식 파트너로서 SBC, 산업용 메인보드,
            패널 PC, 랙마운트 IPC 및 맞춤형 임베디드 솔루션을 공급하고 있습니다.
          </p>
        </div>
      </section>

      {/* CEO Message & Core Strengths */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600">
                  <Building2 className="h-4 w-4" />
                  CEO 인사말
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  &ldquo;고객의 성장은 곧 당사의 성장입니다.&rdquo;
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  (주)아이씨테크는 겉치레보다 기본과 원칙에 충실하며, 정직과 성실로 고객의 눈높이에
                  맞추는 기업입니다. 기성품 공급을 넘어 현장의 요구를 정확히 이해하고, 가장 안정적인
                  산업용 하드웨어와 신속한 기술지원으로 보답하겠습니다.
                </p>
                <div className="mt-4 text-sm font-bold text-slate-900">
                  (주)아이씨테크 대표이사 {COMPANY_INFO.ceo}
                </div>
              </div>
              <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-4">
                <img
                  src={COMPANY_INFO.verticalLogoPath}
                  alt="주식회사 아이씨테크 CI 로고"
                  className="h-32 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Cpu,
                title: "대만 IEI 공식 파트너 & 장기 공급",
                desc: "IMBA-R680, PCIE-RPL-Q670 등 검증된 IEI 산업용 메인보드와 CPU 카드를 5~7년 이상 안정적으로 공급합니다.",
              },
              {
                icon: Wrench,
                title: "유연한 OEM/ODM 커스터마이징",
                desc: "소량 다품종부터 대량 양산까지, I/O 포트 배치, 백플레인 조합, 외함 기구, BIOS/OS 이미지 세팅을 맞춤 지원합니다.",
              },
              {
                icon: ShieldCheck,
                title: "48시간 고온·부하 전수 에이징",
                desc: "모든 완제품 산업용 컴퓨터는 출고 전 부하 에이징 테스트와 I/O 포트 전수 검사를 통과한 뒤 납품됩니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History & Delivery References */}
      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* History */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                HISTORY
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">주요 연혁 (1997 ~ 현재)</h2>
              <div className="mt-6 space-y-5">
                {COMPANY_HISTORY.map((item) => (
                  <div
                    key={item.year}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                  >
                    <div className="font-mono text-sm font-bold text-blue-600">{item.year}</div>
                    <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700">
                      {item.events.map((ev) => (
                        <li key={ev} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery References */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                REFERENCES
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">주요 납품 및 적용 실적</h2>
              <p className="mt-2 text-sm text-slate-600">
                국내 대기업 자동화 라인부터 공공·국방·의료 분야까지 폭넓은 납품 레퍼런스를 보유하고 있습니다.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <ul className="space-y-2.5">
                  {DELIVERY_REFERENCES.map((ref) => (
                    <li key={ref} className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-14">
            <h2 className="text-xl font-bold text-slate-900">보유 파트너십 및 품질·인증 체계</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.code}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                >
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 font-mono text-xs font-bold text-blue-700">
                    <Award className="h-3.5 w-3.5" />
                    {cert.code}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{cert.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">아이씨테크 커스텀 제작 &amp; 납품 프로세스</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="rounded-2xl border border-slate-200 p-6">
                <div className="font-mono text-xl font-bold text-blue-600">{step.step}</div>
                <h3 className="mt-2 text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{step.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {step.deliverable}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maps Section (Google Map + Naver Map) */}
      <section id="location" className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <CompanyMaps />

          {/* Bottom Consultation CTA */}
          <div className="mt-10 flex flex-col justify-between gap-6 rounded-2xl bg-slate-900 p-8 text-white md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <Factory className="h-4 w-4" />
                본사 방문 및 샘플 테스트 문의
              </div>
              <h3 className="mt-2 text-xl font-bold">{COMPANY_INFO.address}</h3>
              <p className="mt-1.5 text-sm text-slate-300">
                방문 전 연락 주시면 엔지니어 상담 및 데모 장비 확인을 준비해 드립니다. (TEL{" "}
                {COMPANY_INFO.phone})
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              방문 · 견적 문의하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
