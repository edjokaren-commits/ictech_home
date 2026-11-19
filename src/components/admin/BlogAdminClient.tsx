"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Search,
  BookOpen,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { BlogPost, BlogSection } from "@/data/blog";
import type { Product } from "@/data/products";

const CATEGORIES: BlogPost["category"][] = [
  "선정 가이드",
  "메인보드 · I/O",
  "트러블슈팅",
];

interface SectionFormItem {
  id: string;
  heading: string;
  paragraphsText: string;
  calloutTitle: string;
  calloutItemsText: string;
  codeCaption: string;
  codeContent: string;
}

interface BlogFormState {
  slug: string;
  category: BlogPost["category"];
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  author: string;
  authorRole: string;
  tagsText: string;
  relatedProductSlugs: string[];
  sections: SectionFormItem[];
}

function createEmptySection(index = 1): SectionFormItem {
  return {
    id: `section-${index}`,
    heading: "",
    paragraphsText: "",
    calloutTitle: "",
    calloutItemsText: "",
    codeCaption: "",
    codeContent: "",
  };
}

function createEmptyForm(): BlogFormState {
  return {
    slug: "",
    category: "선정 가이드",
    title: "",
    excerpt: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    readTime: "5분",
    author: "아이씨테크 기술지원팀",
    authorRole: "아이씨테크 엔지니어링",
    tagsText: "",
    relatedProductSlugs: [],
    sections: [createEmptySection(1)],
  };
}

function postToForm(post: BlogPost): BlogFormState {
  return {
    slug: post.slug,
    category: post.category,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    author: post.author,
    authorRole: post.authorRole,
    tagsText: post.tags.join(", "),
    relatedProductSlugs: post.relatedProductSlugs || [],
    sections:
      post.sections.length > 0
        ? post.sections.map((s) => ({
            id: s.id,
            heading: s.heading,
            paragraphsText: s.paragraphs.join("\n\n"),
            calloutTitle: s.callout?.title || "",
            calloutItemsText: s.callout?.items.join("\n") || "",
            codeCaption: s.codeBlock?.caption || "",
            codeContent: s.codeBlock?.code || "",
          }))
        : [createEmptySection(1)],
  };
}

export default function BlogAdminClient({
  initialPosts,
  products,
}: {
  initialPosts: BlogPost[];
  products: Product[];
}) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [form, setForm] = useState<BlogFormState>(() => createEmptyForm());
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("전체");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setErrorMessage(null);
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setStatusMessage(null);
    setErrorMessage(msg);
  };

  const filtered = posts.filter((post) => {
    const matchCat = categoryFilter === "전체" || post.category === categoryFilter;
    const q = search.trim().toLowerCase();
    const matchQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  const resetForm = () => {
    setEditingSlug(null);
    setForm(createEmptyForm());
    setErrorMessage(null);
  };

  const startEdit = (post: BlogPost) => {
    setEditingSlug(post.slug);
    setForm(postToForm(post));
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleRelatedProduct = (slug: string) => {
    setForm((prev) => ({
      ...prev,
      relatedProductSlugs: prev.relatedProductSlugs.includes(slug)
        ? prev.relatedProductSlugs.filter((item) => item !== slug)
        : [...prev.relatedProductSlugs, slug],
    }));
  };

  const updateSection = (
    idx: number,
    field: keyof SectionFormItem,
    value: string
  ) => {
    setForm((prev) => {
      const next = [...prev.sections];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, sections: next };
    });
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, createEmptySection(prev.sections.length + 1)],
    }));
  };

  const removeSection = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      sections:
        prev.sections.length > 1
          ? prev.sections.filter((_, i) => i !== idx)
          : prev.sections,
    }));
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    setForm((prev) => {
      const target = idx + dir;
      if (target < 0 || target >= prev.sections.length) return prev;
      const next = [...prev.sections];
      const temp = next[idx];
      next[idx] = next[target];
      next[target] = temp;
      return { ...prev, sections: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showError("게시글 제목을 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const sections: BlogSection[] = form.sections
        .map((s, idx) => {
          const paragraphs = s.paragraphsText
            .split(/\n{2,}|\n/)
            .map((p) => p.trim())
            .filter(Boolean);

          const section: BlogSection = {
            id: s.id.trim() || `section-${idx + 1}`,
            heading: s.heading.trim() || `섹션 ${idx + 1}`,
            paragraphs,
          };

          const calloutItems = s.calloutItemsText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          if (s.calloutTitle.trim() || calloutItems.length > 0) {
            section.callout = {
              title: s.calloutTitle.trim() || "핵심 체크포인트",
              items: calloutItems,
            };
          }

          if (s.codeContent.trim()) {
            section.codeBlock = {
              caption: s.codeCaption.trim() || "참고 코드 / 설정",
              code: s.codeContent,
            };
          }

          return section;
        })
        .filter((s) => s.heading || s.paragraphs.length > 0 || s.callout || s.codeBlock);

      const payload: Partial<BlogPost> = {
        slug: editingSlug || form.slug.trim() || undefined,
        category: form.category,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        publishedAt: form.publishedAt.trim() || new Date().toISOString().slice(0, 10),
        readTime: form.readTime.trim() || "5분",
        author: form.author.trim() || "아이씨테크 기술지원팀",
        authorRole: form.authorRole.trim() || "아이씨테크 엔지니어링",
        tags: form.tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        relatedProductSlugs: form.relatedProductSlugs,
        sections,
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "블로그 저장 중 오류가 발생했습니다.");
        return;
      }

      setPosts(data.posts);
      showToast(
        editingSlug
          ? `'${payload.title}' 게시글이 수정되었습니다.`
          : `'${payload.title}' 게시글이 기술 블로그에 등록되었습니다.`
      );
      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`'${title}' 게시글을 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      setPosts(data.posts);
      if (editingSlug === slug) resetForm();
      showToast(`'${title}' 게시글이 삭제되었습니다.`);
      router.refresh();
    } else {
      showError(data.error || "삭제 중 오류가 발생했습니다.");
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "기본 기술 블로그 문서로 복원하시겠습니까? 추가/수정된 글이 초기 상태로 돌아갑니다."
      )
    )
      return;
    const res = await fetch("/api/blogs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    const data = await res.json();
    if (res.ok) {
      setPosts(data.posts);
      resetForm();
      showToast("기본 기술 블로그 문서로 복원되었습니다.");
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {statusMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Top Actions Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          현재 등록된 기술 블로그 글: <strong className="text-slate-900">{posts.length}건</strong>{" "}
          (저장 즉시{" "}
          <Link href="/tech-blog" className="font-semibold text-blue-600 underline">
            /tech-blog 페이지
          </Link>
          에 반영됩니다)
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            <Plus className="h-4 w-4" />
            새 글 작성하기
          </button>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            기본 게시글 복원
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left: Blog Post Editor */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {editingSlug ? `게시글 수정 (${editingSlug})` : "신규 기술 블로그 글 작성"}
            </h2>
            {editingSlug && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                수정 취소
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">
                게시글 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="예: 팬리스 산업용 PC 발열 설계 및 선정 가이드"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">카테고리</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as BlogPost["category"] })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                URL 슬러그 (선택 · 영문/숫자/하이픈)
              </label>
              <input
                type="text"
                disabled={Boolean(editingSlug)}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="미입력 시 자동 생성 (예: fanless-ipc-guide)"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-xs text-slate-900 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">작성자</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">작성자 소속/직책</label>
              <input
                type="text"
                value={form.authorRole}
                onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">발행일</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">예상 읽기 시간</label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="예: 5분"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">요약 설명 (Excerpt)</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="목록 카드 및 상단 소개 영역에 표시될 요약 문구"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              태그 (쉼표 구분)
            </label>
            <input
              type="text"
              value={form.tagsText}
              onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
              placeholder="예: 팬리스 PC, 스마트팩토리, RS-485"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
            />
          </div>

          {/* Related Products */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              연관 추천 제품 연결 ({form.relatedProductSlugs.length}개 선택됨)
            </label>
            <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              {products.map((prod) => {
                const selected = form.relatedProductSlugs.includes(prod.slug);
                return (
                  <button
                    key={prod.slug}
                    type="button"
                    onClick={() => toggleRelatedProduct(prod.slug)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {prod.modelCode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Sections Builder */}
          <div className="space-y-4 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">본문 섹션 구성</h3>
                <p className="text-xs text-slate-500">
                  소제목, 문단 내용, 체크리스트 박스(선택), 코드/핀맵 블록(선택)을 섹션 단위로 편집합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                섹션 추가
              </button>
            </div>

            {form.sections.map((sec, idx) => (
              <div
                key={`${sec.id}-${idx}`}
                className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-700">
                    섹션 #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, -1)}
                      title="위로 이동"
                      className="rounded border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-800 disabled:opacity-40"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.sections.length - 1}
                      onClick={() => moveSection(idx, 1)}
                      title="아래로 이동"
                      className="rounded border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-800 disabled:opacity-40"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={form.sections.length <= 1}
                      onClick={() => removeSection(idx)}
                      title="섹션 삭제"
                      className="rounded border border-red-200 bg-white p-1 text-red-500 hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600">
                      소제목 (Heading)
                    </label>
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={(e) => updateSection(idx, "heading", e.target.value)}
                      placeholder="예: 1. 현장 적용 시 핵심 확인 사항"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      목차 ID (앵커)
                    </label>
                    <input
                      type="text"
                      value={sec.id}
                      onChange={(e) => updateSection(idx, "id", e.target.value)}
                      placeholder={`section-${idx + 1}`}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600">
                    본문 단락 (줄바꿈으로 문단 구분)
                  </label>
                  <textarea
                    rows={4}
                    value={sec.paragraphsText}
                    onChange={(e) => updateSection(idx, "paragraphsText", e.target.value)}
                    placeholder="본문 내용을 입력하세요. 줄을 바꾸면 새 문단으로 렌더링됩니다."
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      체크리스트 박스 제목 (선택)
                    </label>
                    <input
                      type="text"
                      value={sec.calloutTitle}
                      onChange={(e) => updateSection(idx, "calloutTitle", e.target.value)}
                      placeholder="예: 핵심 체크리스트"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      코드/핀맵 블록 캡션 (선택)
                    </label>
                    <input
                      type="text"
                      value={sec.codeCaption}
                      onChange={(e) => updateSection(idx, "codeCaption", e.target.value)}
                      placeholder="예: DB9 핀맵 또는 설정 명령"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      체크리스트 항목 (줄바꿈으로 구분, 선택)
                    </label>
                    <textarea
                      rows={3}
                      value={sec.calloutItemsText}
                      onChange={(e) => updateSection(idx, "calloutItemsText", e.target.value)}
                      placeholder={"항목 1\n항목 2"}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      코드 / 표 내용 (선택)
                    </label>
                    <textarea
                      rows={3}
                      value={sec.codeContent}
                      onChange={(e) => updateSection(idx, "codeContent", e.target.value)}
                      placeholder="코드나 명령어 예시를 입력 (비워두면 숨김)"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
          >
            <BookOpen className="h-4 w-4" />
            {saving
              ? "저장 중..."
              : editingSlug
                ? "기술 블로그 수정 내용 저장"
                : "새 기술 블로그 글 게시하기"}
          </button>
        </form>

        {/* Right: Existing Blog Posts List */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">
              등록된 기술 블로그 목록 ({filtered.length})
            </h2>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {["전체", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    categoryFilter === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="제목, 태그, 작성자 검색..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900"
              />
            </div>

            <div className="mt-4 max-h-[760px] space-y-3 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                  일치하는 기술 블로그 게시글이 없습니다.
                </div>
              ) : (
                filtered.map((post) => (
                  <div
                    key={post.slug}
                    className={`rounded-xl border p-4 transition ${
                      editingSlug === post.slug
                        ? "border-blue-500 bg-blue-50/40"
                        : "border-slate-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                            {post.category}
                          </span>
                          <span className="text-slate-400">{post.publishedAt}</span>
                          <span className="text-slate-400">· 섹션 {post.sections.length}개</span>
                        </div>
                        <h3 className="mt-1.5 text-sm font-bold leading-snug text-slate-900">
                          {post.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                      <span className="truncate text-slate-500">{post.author}</span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Link
                          href={`/tech-blog/${post.slug}`}
                          title="게시글 보기"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-600 hover:text-blue-600"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          조회
                        </Link>
                        <button
                          type="button"
                          onClick={() => startEdit(post)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.slug, post.title)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-red-600 hover:border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

