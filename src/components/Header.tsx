"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowRight, Phone, Settings2, LogOut } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

const NAV_ITEMS = [
  { label: "회사소개", href: "/about" },
  { label: "산업용 컴퓨터", href: "/products?category=ipc" },
  { label: "산업용 메인보드", href: "/products?category=motherboard" },
  { label: "케이스 및 기타", href: "/products?category=module" },
  { label: "기술 블로그", href: "/tech-blog" },
];

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setMobileOpen(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top engineering info bar */}
      <div className="hidden border-b border-slate-100 bg-slate-900 text-xs text-slate-300 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <span>
            {COMPANY_INFO.name} | {COMPANY_INFO.tagline}
          </span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Phone className="h-3 w-3 text-sky-400" />
              대표전화 {COMPANY_INFO.phone} · FAX {COMPANY_INFO.fax}
            </span>
            {isAdmin && (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-1 rounded bg-sky-500/20 px-2 py-0.5 font-semibold text-sky-300 transition hover:bg-sky-500/30 hover:text-white"
                >
                  <Settings2 className="h-3 w-3" />
                  제품 관리
                </Link>
                <Link
                  href="/admin/blog"
                  className="inline-flex items-center gap-1 rounded bg-sky-500/20 px-2 py-0.5 font-semibold text-sky-300 transition hover:bg-sky-500/30 hover:text-white"
                >
                  블로그 관리
                </Link>
                <Link
                  href="/admin/inquiries"
                  className="inline-flex items-center gap-1 rounded bg-sky-500/20 px-2 py-0.5 font-semibold text-sky-300 transition hover:bg-sky-500/30 hover:text-white"
                >
                  문의 내역
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-slate-300 transition hover:text-white"
                >
                  <LogOut className="h-3 w-3" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo (/images/ICT_CI_NV_W2.png) */}
        <Link
          href="/"
          className="group flex items-center"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src={COMPANY_INFO.logoPath}
            alt="주식회사 아이씨테크 ICTech 로고"
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const baseHref = item.href.split("?")[0];
            const isActive =
              baseHref === "/"
                ? pathname === "/"
                : pathname.startsWith(baseHref) && !item.href.includes("?");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {isAdmin && (
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <Settings2 className="h-3.5 w-3.5" />
              제품 등록·관리
            </Link>
          )}
          <Link
            href="/products"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            전체 제품
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            견적 · 기술 문의
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              전체 제품 라인업
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin/products"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700"
                >
                  관리자 · 제품 등록·관리
                </Link>
                <Link
                  href="/admin/blog"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700"
                >
                  관리자 · 기술 블로그(BLOG) 관리
                </Link>
                <Link
                  href="/admin/inquiries"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700"
                >
                  관리자 · 문의 내역 및 메일 설정
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  관리자 로그아웃
                </button>
              </>
            )}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              견적 · 기술 문의하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
