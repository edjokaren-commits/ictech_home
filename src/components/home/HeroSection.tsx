"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  MessageSquareText,
  Server,
} from "lucide-react";
import type { HeroSlide } from "@/types/hero";
import { FIXED_FIRST_HERO_SLIDE } from "@/types/hero";

export type { HeroSlide };

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  FIXED_FIRST_HERO_SLIDE,
  {
    id: "tank-xm811-default",
    imageSrc: "/images/tank-xm811.png",
    imageAlt: "IEI TANK-XM811 팬리스 고확장 임베디드 박스 PC",
    theme: "light",
    layout: "split-product",
    badge: "산업용 컴퓨터 · TANK-XM811",
    title: "TANK-XM811 — 팬리스 고확장 임베디드 박스 PC",
    subtitle:
      "일체형 알루미늄 압출 히트싱크와 2개의 PCIe/PCI 확장 백플레인을 결합한 플래그십 박스 PC입니다.",
    ctaLabel: "TANK-XM811 상세 스펙 보기",
    productHref: "/products/tank-xm811",
  },
  {
    id: "imba-r680-default",
    imageSrc: "/images/imba-r680.png",
    imageAlt: "IEI IMBA-R680 LGA1700 ATX 산업용 메인보드",
    theme: "light",
    layout: "split-product",
    badge: "산업용 메인보드 · IMBA-R680",
    title: "IMBA-R680 — LGA1700 ATX 산업용 메인보드 (R680E)",
    subtitle:
      "R680E 칩셋, ECC DDR5 메모리, Dual 2.5GbE 및 PCIe Gen4/PCI 확장 슬롯을 갖춘 차세대 ATX 산업용 메인보드.",
    ctaLabel: "IMBA-R680 상세 스펙 보기",
    productHref: "/products/imba-r680",
  },
];

const OVERLAY_NAV_LINKS = [
  {
    label: "회사소개",
    sub: "연혁 · 오시는 길",
    href: "/about",
    icon: Building2,
  },
  {
    label: "산업용 컴퓨터 (IPC)",
    sub: "팬리스 · 랙 · 패널 PC",
    href: "/products?category=ipc",
    icon: Server,
  },
  {
    label: "산업용 메인보드",
    sub: "IMBA-R680 · Mini-ITX · SBC",
    href: "/products?category=motherboard",
    icon: Cpu,
  },
  {
    label: "케이스 및 기타",
    sub: "PCIE-RPL-Q670 · 백플레인",
    href: "/products?category=module",
    icon: Layers,
  },
  {
    label: "기술지원 블로그",
    sub: "핀맵 · 트러블슈팅",
    href: "/tech-blog",
    icon: BookOpen,
  },
];

const AUTO_SLIDE_MS = 5000;

function resolveSlideHref(productHref?: string): string {
  if (typeof productHref === "string" && productHref.trim().length > 0) {
    return productHref.trim();
  }
  return "/products";
}

export default function HeroSection({
  slides,
}: {
  slides?: HeroSlide[];
}) {
  const currentSlides = slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  const totalSlides = currentSlides.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // If slide count changes dynamically, reset index if out of range
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [goNext, isPaused]);

  const activeSlide = currentSlides[currentIndex] || currentSlides[0];

  return (
    <section
      className="relative bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="아이씨테크 대표 배너 슬라이드"
    >
      {/* Carousel Viewport */}
      <div className="relative h-[460px] w-full overflow-hidden sm:h-[520px] lg:h-[560px]">
        {currentSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          const targetHref = resolveSlideHref(slide.productHref);
          const isLight = slide.theme === "light";

          return (
            <div
              key={`${slide.id}-${index}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
            >
              <Link
                href={targetHref}
                className="group relative block h-full w-full focus:outline-none"
              >
                {slide.layout === "full-banner" ? (
                  <>
                    <img
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      className={`h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.015] ${
                        isLight ? "bg-white" : "bg-slate-950"
                      }`}
                    />
                    <div
                      className={
                        isLight
                          ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent"
                          : "pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/15 to-slate-950/85"
                      }
                    />
                  </>
                ) : (
                  <div className="bg-tech-grid-light relative flex h-full w-full items-center bg-white">
                    <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-12 pb-16 pt-8 sm:px-16 lg:grid-cols-12">
                      <div className="lg:col-span-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold tracking-wider text-blue-700">
                          {slide.badge}
                        </span>
                        <h2 className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl lg:text-4xl">
                          {slide.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                          {slide.subtitle}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition group-hover:bg-blue-700">
                          {slide.ctaLabel}
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </span>
                      </div>
                      <div className="hidden aspect-[4/3] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex lg:col-span-6">
                        <img
                          src={slide.imageSrc}
                          alt={slide.imageAlt}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {slide.layout === "full-banner" && (
                  <div className="absolute inset-x-0 bottom-14 z-20 mx-auto max-w-7xl px-12 sm:px-16">
                    <div className="max-w-2xl rounded-2xl border border-white/15 bg-slate-950/75 p-5 text-white shadow-xl backdrop-blur-md sm:p-6">
                      <span className="inline-block font-mono text-[11px] font-semibold tracking-wider text-sky-300">
                        {slide.badge}
                      </span>
                      <h2 className="mt-1.5 text-xl font-bold leading-snug sm:text-2xl lg:text-3xl">
                        {slide.title}
                      </h2>
                      <p className="mt-2 hidden text-xs leading-relaxed text-slate-200 sm:block sm:text-sm">
                        {slide.subtitle}
                      </p>
                      <div className="mt-4">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition group-hover:bg-blue-500 sm:text-sm">
                          {slide.ctaLabel}
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            </div>
          );
        })}

        {/* Left / Right Manual Arrow Buttons */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="이전 슬라이드"
          className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/40 bg-slate-900/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-blue-600 sm:left-5 sm:h-11 sm:w-11"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="다음 슬라이드"
          className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/40 bg-slate-900/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-blue-600 sm:right-5 sm:h-11 sm:w-11"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/60 px-3.5 py-2 backdrop-blur-sm">
          {currentSlides.map((slide, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={`${slide.id}-dot-${idx}`}
                type="button"
                aria-label={`${idx + 1}번 슬라이드로 이동: ${slide.title}`}
                aria-current={active ? "true" : undefined}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  active ? "w-8 bg-sky-400" : "w-2.5 bg-white/45 hover:bg-white/80"
                }`}
              />
            );
          })}
          <span className="ml-1.5 font-mono text-[11px] font-semibold text-slate-300">
            0{currentIndex + 1} / 0{totalSlides}
          </span>
        </div>

        <span className="sr-only">{activeSlide.title}</span>
      </div>

      {/* Quick Overlay Navigation Bar */}
      <div className="border-t border-slate-800 bg-slate-950/95">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-6">
            {OVERLAY_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 transition hover:border-sky-400/60 hover:bg-sky-500/15"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 transition group-hover:bg-sky-500 group-hover:text-white">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-white group-hover:text-sky-200">
                    {item.label}
                  </div>
                  <div className="truncate text-[11px] text-slate-400">{item.sub}</div>
                </div>
              </Link>
            ))}

            <Link
              href="/contact"
              className="group flex items-center justify-between rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg transition hover:bg-blue-500"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquareText className="h-4 w-4 shrink-0" />
                <div>
                  <div className="text-sm font-bold">견적 · 사양 상담</div>
                  <div className="text-[11px] text-blue-100">02-2081-1200</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
