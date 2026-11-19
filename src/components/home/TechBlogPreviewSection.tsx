import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/data/blog";

export default function TechBlogPreviewSection({
  posts,
}: {
  posts?: BlogPost[];
}) {
  const latestPosts = (posts && posts.length > 0 ? posts : BLOG_POSTS).slice(0, 3);

  return (
    <section className="border-t border-slate-200 bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              TECH SUPPORT BLOG
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              현장 엔지니어가 직접 작성한 기술 인사이트
            </h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              제품 선정 기준부터 현장 트러블슈팅까지, 실무에 바로 적용할 수 있는 기술 문서를 확인하세요.
            </p>
          </div>
          <Link
            href="/tech-blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            기술 블로그 전체보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/tech-blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 transition hover:-translate-y-0.5 hover:border-sky-500/50 hover:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-1 font-semibold text-sky-300">
                    <BookOpen className="h-3 w-3" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold leading-snug text-white transition group-hover:text-sky-400">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                <span>{post.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.publishedAt}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
