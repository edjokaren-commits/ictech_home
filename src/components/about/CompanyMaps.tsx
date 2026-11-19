"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Printer,
  Train,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

export default function CompanyMaps() {
  const [copied, setCopied] = useState(false);

  const naverSearchUrl = `https://map.naver.com/p/search/${encodeURIComponent(
    "서울 구로구 디지털로30길 31 코오롱빌란트2차"
  )}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY_INFO.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          LOCATION &amp; NAVER MAP
        </span>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          오시는 길 (네이버 지도)
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {COMPANY_INFO.address} · 2호선 구로디지털단지역 3번 출구 도보 약 8분
        </p>
      </div>

      {/* Interactive Naver Map Link Card (no static legacy-map.gif) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Top Naver Header Bar */}
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-emerald-50/80 px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-extrabold text-white">
              N
            </span>
            <span className="text-sm font-bold text-slate-900">
              NAVER 지도 · (주)아이씨테크 본사
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={COMPANY_INFO.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
            >
              <Navigation className="h-3.5 w-3.5" />
              네이버 지도 바로가기
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={naverSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              네이버 지도 길찾기
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Clean Interactive Vector Map Canvas + Location Overlay Card */}
        <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden bg-slate-50 p-6 sm:min-h-[380px] sm:p-8">
          {/* Vector street schematic background */}
          <svg
            viewBox="0 0 900 380"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <rect width="900" height="380" fill="#F8FAFC" />
            {/* Major roads */}
            <path d="M0 95 L900 135" stroke="#E2E8F0" strokeWidth="26" />
            <path d="M0 95 L900 135" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="6 6" />
            <path d="M220 0 L220 380" stroke="#E2E8F0" strokeWidth="20" />
            <path d="M560 0 L560 380" stroke="#E2E8F0" strokeWidth="22" />
            <path d="M220 250 L720 250" stroke="#E2E8F0" strokeWidth="18" />
            <path d="M740 0 L790 380" stroke="#E2E8F0" strokeWidth="24" />
            {/* Subway line 2 */}
            <path d="M520 20 Q650 85 880 120" stroke="#10B981" strokeWidth="4" strokeOpacity="0.65" />
            <circle cx="670" cy="78" r="8" fill="#10B981" />
            <rect x="615" y="45" width="136" height="22" rx="6" fill="#065F46" />
            <text x="683" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
              2호선 구로디지털단지역
            </text>
            {/* Walking route */}
            <path
              d="M670 86 L670 160 L450 160 L450 190"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="5 5"
            />
            {/* Building block */}
            <rect x="385" y="165" width="130" height="68" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
            <text x="450" y="203" textAnchor="middle" fill="#1E3A8A" fontSize="12" fontWeight="bold">
              코오롱빌란트 2차
            </text>
          </svg>

          {/* Top status badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              구로디지털단지역 3번 출구 · 코오롱빌란트2차 1210호
            </span>
          </div>

          {/* Floating Address & Naver Link Card */}
          <div className="relative z-10 mt-20 max-w-xl rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur-xs sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <MapPin className="h-3.5 w-3.5" />
                  (주)아이씨테크 본사 위치
                </div>
                <h3 className="mt-1.5 text-base font-bold text-slate-900 sm:text-lg">
                  {COMPANY_INFO.address}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {COMPANY_INFO.naverMapUrl}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    복사 완료
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    주소 복사
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">
              <a
                href={COMPANY_INFO.naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 sm:flex-none"
              >
                네이버 지도에서 바로 보기
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={naverSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
              >
                대중교통 · 자동차 길찾기
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Access Details */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="text-xs">
            <div className="font-bold text-slate-900">본사 주소</div>
            <div className="mt-1 leading-relaxed text-slate-600">{COMPANY_INFO.address}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Train className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="text-xs">
            <div className="font-bold text-slate-900">지하철 이용 안내</div>
            <div className="mt-1 leading-relaxed text-slate-600">
              2호선 구로디지털단지역 3번 출구 (이마트 구로점 지나 디지털로30길 방향)
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="text-xs">
            <div className="font-bold text-slate-900">대표전화 · 팩스</div>
            <div className="mt-1 text-slate-600">TEL: {COMPANY_INFO.phone}</div>
            <div className="flex items-center gap-1 text-slate-600">
              <Printer className="h-3 w-3" /> FAX: {COMPANY_INFO.fax}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="text-xs">
            <div className="font-bold text-slate-900">대표 이메일 · 홈페이지</div>
            <div className="mt-1 text-slate-600">{COMPANY_INFO.email}</div>
            <div className="text-slate-500">{COMPANY_INFO.homepage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
