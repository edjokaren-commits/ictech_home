"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, Search, ArrowRight, Settings2 } from "lucide-react";
import { BLOG_CATEGORIES, type BlogPost } from "@/data/blog";

export default function TechBlogClient({
  initialPosts,
}: {
  initialPosts: BlogPost[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [query, setQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchCat =
        selectedCategory === "전체" || post.category === selectedCategory;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [initialPosts, selectedCategory, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Filter & Search Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="키워드 검색 (예: 팬리스, RS-485, UWF)"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-base font-semibold text-slate-800">
            검색 조건에 맞는 기술 문서가 없습니다.
          </p>
          <Link
            href="/contact?type=support"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            엔지니어에게 직접 질문하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/tech-blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition hover:border-blue-300 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                    <BookOpen className="h-3.5 w-3.5" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    읽기 {post.readTime}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-600">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>
                  {post.author} · {post.authorRole}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.publishedAt}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom Admin Entry Bar */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4">
        <div className="text-xs text-slate-500 sm:text-sm">
          기술 블로그 게시글 추가, 내용 수정 및 삭제는 관리자 모드에서 진행할 수 있습니다.
        </div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-blue-400 hover:text-blue-700"
        >
          <Settings2 className="h-4 w-4 text-blue-600" />
          관리자 모드 (블로그 관리)
        </Link>
      </div>
    </div>
  );
}
