import HeroSection from "@/components/home/HeroSection";
import CoreServicesSection from "@/components/home/CoreServicesSection";
import WhyICTechSection from "@/components/home/WhyICTechSection";
import ApplicationsSection from "@/components/home/ApplicationsSection";
import TechBlogPreviewSection from "@/components/home/TechBlogPreviewSection";
import ProcessAndCTASection from "@/components/home/ProcessAndCTASection";
import { getAllProducts } from "@/lib/products-store";
import { getAllBlogPosts } from "@/lib/blog-store";
import { getHeroSettings, buildHeroSlides } from "@/lib/hero-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, blogPosts, heroSettings] = await Promise.all([
    getAllProducts(),
    getAllBlogPosts(),
    getHeroSettings(),
  ]);

  const heroSlides = buildHeroSlides(products, heroSettings);

  const preferredSlugs = ["imba-r680", "pcie-rpl-q670", "tank-xm811"];
  const preferred = preferredSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featured = preferred.length === 3 ? preferred : products.slice(0, 3);

  return (
    <>
      <HeroSection slides={heroSlides} />
      <CoreServicesSection featuredProducts={featured} />
      <WhyICTechSection />
      <ApplicationsSection />
      <TechBlogPreviewSection posts={blogPosts.slice(0, 3)} />
      <ProcessAndCTASection />
    </>
  );
}
