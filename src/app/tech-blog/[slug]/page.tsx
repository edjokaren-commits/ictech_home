import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, CheckCircle2, UserCheck } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/blog-store";
import { getAllProducts } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "게시글을 찾을 수 없습니다 | 아이씨테크" };
  }
  return {
    title: `${post.title} | 아이씨테크 기술 블로그`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, products] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllProducts(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedProducts = products.filter((p) =>
    post.relatedProductSlugs.includes(p.slug)
  );

  return (
    <div className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          href="/tech-blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          기술 블로그 목록으로
        </Link>

        {/* Article Header */}
        <header className="mt-6 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              약 {post.readTime} 소요
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-2xl font-bold leading-snug text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
            {post.excerpt}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-700">
            <UserCheck className="h-4 w-4 text-blue-600" />
            <span className="font-semibold">{post.author}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">{post.authorRole}</span>
          </div>
        </header>

        {/* Body + TOC */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* Sticky TOC Sidebar */}
          <aside className="lg:col-span-4 lg:order-2">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  목차 (TABLE OF CONTENTS)
                </div>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {post.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block font-medium text-slate-700 transition hover:text-blue-600"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <div className="text-xs font-semibold text-sky-400">DIRECT SUPPORT</div>
                <h3 className="mt-1.5 text-base font-bold">
                  현장 환경 적용에 어려움이 있으신가요?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  아이씨테크 기술지원팀이 호환성 검토 및 커스텀 BIOS/OS 세팅을 직접 안내해 드립니다.
                </p>
                <Link
                  href="/contact?type=support"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                >
                  엔지니어 기술 상담 신청
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="space-y-10 lg:col-span-8 lg:order-1">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-base leading-relaxed text-slate-700">
                      {p}
                    </p>
                  ))}
                </div>

                {section.callout && (
                  <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                    <h3 className="text-sm font-bold text-blue-900">
                      {section.callout.title}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {section.callout.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-slate-800"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.codeBlock && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 font-mono text-xs text-slate-300">
                      {section.codeBlock.caption}
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-sky-300 sm:text-sm">
                      <code>{section.codeBlock.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}

            {/* Related Recommended Products */}
            {relatedProducts.length > 0 && (
              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-bold text-slate-900">
                  본 기술 문서와 연관된 추천 제품
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.slug}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {product.modelCode}
                        </span>
                        <h4 className="mt-1 text-base font-bold text-slate-900">
                          {product.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-600">{product.tagline}</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          스펙 보기
                        </Link>
                        <Link
                          href={`/contact?product=${encodeURIComponent(product.modelCode)}`}
                          className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          견적 문의
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
