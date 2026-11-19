import Link from "next/link";
import { Mail, MapPin, Phone, Printer, Globe, ExternalLink } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Summary */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center rounded-xl bg-white px-3 py-2">
              <img
                src={COMPANY_INFO.logoPath}
                alt="주식회사 아이씨테크 ICTech 로고"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              1997년부터 축적된 산업용 컴퓨팅 노하우와 IEI 공식 파트너십을 바탕으로,
              산업용 메인보드·SBC·팬리스 PC·맞춤형 임베디드 솔루션을 공급합니다.
            </p>
          </div>

          {/* Products & Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white">제품 및 플랫폼</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/products?category=ipc" className="transition hover:text-sky-400">
                  산업용 컴퓨터 (팬리스 / 랙마운트 / 패널 PC)
                </Link>
              </li>
              <li>
                <Link href="/products?category=motherboard" className="transition hover:text-sky-400">
                  산업용 메인보드 (IMBA-R680 / Mini-ITX / SBC)
                </Link>
              </li>
              <li>
                <Link href="/products?category=module" className="transition hover:text-sky-400">
                  케이스 및 기타 (PICMG 1.3 · 백플레인 · I/O)
                </Link>
              </li>
              <li>
                <Link href="/contact?type=custom" className="transition hover:text-sky-400">
                  맞춤형 OEM/ODM 설계 제작
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">기업 및 기술지원</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="transition hover:text-sky-400">
                  회사소개 · 연혁 · 오시는 길(네이버 지도)
                </Link>
              </li>
              <li>
                <Link href="/tech-blog" className="transition hover:text-sky-400">
                  기술지원 블로그 (가이드·트러블슈팅)
                </Link>
              </li>
              <li>
                <Link href="/contact?type=support" className="transition hover:text-sky-400">
                  엔지니어 기술지원 접수
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-sky-400">
                  견적 · 맞춤 제작 상담
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white">본사 고객지원 센터</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div>
                  <div className="font-semibold text-white">대표전화 {COMPANY_INFO.phone}</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Printer className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>대표팩스 {COMPANY_INFO.fax}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>대표메일 {COMPANY_INFO.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>{COMPANY_INFO.homepage}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div>
                  <div>{COMPANY_INFO.address}</div>
                  <a
                    href={COMPANY_INFO.naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:underline"
                  >
                    네이버 지도 바로가기
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div>
            상호명: {COMPANY_INFO.name} | 대표이사: {COMPANY_INFO.ceo} | 주소: {COMPANY_INFO.address}
          </div>
          <div>© {new Date().getFullYear()} {COMPANY_INFO.englishName} All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
