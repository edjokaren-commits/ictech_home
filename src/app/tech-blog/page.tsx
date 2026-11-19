import type { Metadata } from "next";
import TechBlogClient from "@/components/blog/TechBlogClient";
import { getAllBlogPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "기술지원 블로그 | 아이씨테크(ICTech)",
  description:
    "산업용 컴퓨터 선정 가이드, RS-232/422/485 핀맵, Windows IoT UWF 전원 보호 등 아이씨테크 엔지니어의 실무 기술 자료입니다.",
};

export default async function TechBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white">
        <div className="bg-tech-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            TECHNICAL SUPPORT BLOG
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            현장 엔지니어가 전하는 기술지원 블로그
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            장비 도입 전 스펙 선정 기준부터 현장 트러블슈팅, OS/BIOS 최적화 가이드까지
            실무에 바로 도움이 되는 기술 문서를 제공합니다.
          </p>
        </div>
      </section>

      <TechBlogClient initialPosts={posts} />
    </div>
  );
}
