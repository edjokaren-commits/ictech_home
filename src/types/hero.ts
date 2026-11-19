import type { Product } from "@/data/products";

export interface HeroSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  theme: "light" | "dark";
  layout: "full-banner" | "split-product";
  badge: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  productHref?: string;
}

export interface HeroSettings {
  totalSlides: number; // 3, 4, or 5
  selectedProductSlugs: string[]; // Slugs for slides 2, 3, (4, 5)
}

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  totalSlides: 3,
  selectedProductSlugs: ["tank-xm811", "imba-r680"],
};

/**
 * 1번 슬라이드: 전체 제품 라인업 보기 (고정 슬라이드 - 수정 불가)
 */
export const FIXED_FIRST_HERO_SLIDE: HeroSlide = {
  id: "fixed-catalog-slide",
  imageSrc: "/images/ict_main_bg.png",
  imageAlt: "주식회사 아이씨테크 스마트 제조 및 산업용 컴퓨팅 플랫폼",
  theme: "dark",
  layout: "full-banner",
  badge: "SINCE 1997 · 대만 IEI 공식 파트너",
  title: "멈추지 않는 현장을 위한 산업용 컴퓨터 · 메인보드 파트너",
  subtitle:
    "산업용 컴퓨터, 산업용 메인보드, 케이스 및 기타(PICMG 1.3 · 백플레인)까지 전 제품 라인업을 한눈에 살펴보세요.",
  ctaLabel: "전체 제품 라인업 보기",
  productHref: "/products",
};

export function buildProductSlide(product: Product): HeroSlide {
  return {
    id: `product-slide-${product.slug}`,
    imageSrc: product.imageUrl || "/images/imba-r680.png",
    imageAlt: `${product.modelCode} ${product.name}`,
    theme: "light",
    layout: "split-product",
    badge: `${product.categoryLabel.toUpperCase()} · ${product.modelCode}`,
    title: `${product.modelCode} — ${product.name}`,
    subtitle:
      product.tagline ||
      product.summary ||
      "고신뢰성 산업 현장을 위한 아이씨테크 추천 제품입니다.",
    ctaLabel: `${product.modelCode} 상세 스펙 보기`,
    productHref: `/products/${product.slug}`,
  };
}

