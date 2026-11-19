import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { BlogPost, BlogSection } from "@/data/blog";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  addOrUpdateBlogPost,
  getAllBlogPosts,
  resetDefaultBlogPosts,
  saveAllBlogPosts,
} from "@/lib/blog-store";

const VALID_CATEGORIES = new Set<BlogPost["category"]>([
  "선정 가이드",
  "메인보드 · I/O",
  "트러블슈팅",
]);

function normalizeSlug(raw: string): string {
  const ascii = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || `post-${Date.now()}`;
}

function normalizeSection(sec: Partial<BlogSection>, idx: number): BlogSection {
  const paragraphs = Array.isArray(sec.paragraphs)
    ? sec.paragraphs.map((p) => String(p).trim()).filter(Boolean)
    : [];

  const result: BlogSection = {
    id: (sec.id || `section-${idx + 1}`).trim() || `section-${idx + 1}`,
    heading: (sec.heading || `섹션 ${idx + 1}`).trim(),
    paragraphs,
  };

  if (
    sec.callout &&
    (sec.callout.title?.trim() || (sec.callout.items && sec.callout.items.length > 0))
  ) {
    result.callout = {
      title: (sec.callout.title || "핵심 요약").trim(),
      items: (sec.callout.items || []).map((i) => String(i).trim()).filter(Boolean),
    };
  }

  if (sec.codeBlock && sec.codeBlock.code?.trim()) {
    result.codeBlock = {
      caption: (sec.codeBlock.caption || "참고 코드 / 설정").trim(),
      code: sec.codeBlock.code,
    };
  }

  return result;
}

function normalizeBlogPost(input: Partial<BlogPost>): BlogPost {
  const category: BlogPost["category"] = VALID_CATEGORIES.has(
    input.category as BlogPost["category"]
  )
    ? (input.category as BlogPost["category"])
    : "선정 가이드";

  const title = (input.title || "").trim();
  const slug = normalizeSlug(input.slug || title);
  const today = new Date().toISOString().slice(0, 10);

  const rawSections = Array.isArray(input.sections) ? input.sections : [];
  const sections = rawSections
    .map((sec, idx) => normalizeSection(sec, idx))
    .filter((s) => s.heading || s.paragraphs.length > 0 || s.callout || s.codeBlock);

  return {
    slug,
    category,
    title,
    excerpt: (input.excerpt || "").trim(),
    publishedAt: (input.publishedAt || today).trim(),
    readTime: (input.readTime || "5분").trim(),
    author: (input.author || "아이씨테크 기술지원팀").trim(),
    authorRole: (input.authorRole || "아이씨테크 엔지니어링").trim(),
    tags: Array.isArray(input.tags)
      ? input.tags.map((t) => String(t).trim()).filter(Boolean)
      : [],
    relatedProductSlugs: Array.isArray(input.relatedProductSlugs)
      ? input.relatedProductSlugs.map((s) => String(s).trim()).filter(Boolean)
      : [],
    sections,
  };
}

export async function GET() {
  const posts = await getAllBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (Array.isArray(body.posts)) {
      const incoming = body.posts
        .filter((p: Partial<BlogPost>) => p.title?.trim())
        .map((p: Partial<BlogPost>) => normalizeBlogPost(p));

      const existing = await getAllBlogPosts();
      const map = new Map<string, BlogPost>();
      for (const item of existing) map.set(item.slug, item);
      for (const item of incoming) map.set(item.slug, item);

      const merged = Array.from(map.values());
      await saveAllBlogPosts(merged);
      revalidatePath("/");
      revalidatePath("/tech-blog");
      revalidatePath("/admin/blog");
      return NextResponse.json({ imported: incoming.length, posts: merged });
    }

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "게시글 제목은 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    const post = normalizeBlogPost(body);
    const posts = await addOrUpdateBlogPost(post);
    revalidatePath("/");
    revalidatePath("/tech-blog");
    revalidatePath(`/tech-blog/${post.slug}`);
    revalidatePath("/admin/blog");
    return NextResponse.json({ post, posts });
  } catch (err) {
    console.error("Blog POST error:", err);
    return NextResponse.json(
      { error: "블로그 게시글 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body.action === "reset") {
      const posts = await resetDefaultBlogPosts();
      revalidatePath("/");
      revalidatePath("/tech-blog");
      revalidatePath("/admin/blog");
      return NextResponse.json({ posts });
    }
    return NextResponse.json({ error: "지원하지 않는 요청입니다." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "초기화 중 오류" }, { status: 500 });
  }
}
