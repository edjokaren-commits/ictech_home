import fs from "node:fs/promises";
import path from "node:path";
import { BLOG_POSTS, type BlogPost } from "@/data/blog";

const DATA_DIR = path.join(process.cwd(), "data");
const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");

let writeQueue: Promise<void> = Promise.resolve();

async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmpPath, filePath);
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue;
}

async function ensureBlogsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BLOGS_FILE);
  } catch {
    await atomicWriteJson(BLOGS_FILE, BLOG_POSTS);
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    await ensureBlogsFile();
    const raw = await fs.readFile(BLOGS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as BlogPost[];
    }
    return BLOG_POSTS;
  } catch {
    return BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const list = await getAllBlogPosts();
  return list.find((p) => p.slug === slug);
}

export async function saveAllBlogPosts(list: BlogPost[]): Promise<void> {
  await atomicWriteJson(BLOGS_FILE, list);
}

export async function addOrUpdateBlogPost(post: BlogPost): Promise<BlogPost[]> {
  const list = await getAllBlogPosts();
  const idx = list.findIndex((p) => p.slug === post.slug);
  let next: BlogPost[];
  if (idx >= 0) {
    next = [...list];
    next[idx] = post;
  } else {
    next = [post, ...list];
  }
  await saveAllBlogPosts(next);
  return next;
}

export async function deleteBlogPostBySlug(slug: string): Promise<BlogPost[]> {
  const list = await getAllBlogPosts();
  const next = list.filter((p) => p.slug !== slug);
  await saveAllBlogPosts(next);
  return next;
}

export async function resetDefaultBlogPosts(): Promise<BlogPost[]> {
  await saveAllBlogPosts(BLOG_POSTS);
  return BLOG_POSTS;
}
