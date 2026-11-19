import { BLOG_POSTS, type BlogPost } from "@/data/blog";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return BLOG_POSTS;

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("data, updated_at")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      await saveAllBlogPosts(BLOG_POSTS);
      return BLOG_POSTS;
    }

    return data.map((row) => row.data as BlogPost);
  } catch (err) {
    console.error("getAllBlogPosts error:", err);
    return BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return BLOG_POSTS.find((p) => p.slug === slug);

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("data")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (data?.data) return data.data as BlogPost;

    const all = await getAllBlogPosts();
    return all.find((p) => p.slug === slug);
  } catch {
    return BLOG_POSTS.find((p) => p.slug === slug);
  }
}

export async function saveAllBlogPosts(list: BlogPost[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const slugs = list.map((p) => p.slug);
  if (slugs.length > 0) {
    const { data: existing } = await supabase.from("blogs").select("slug");
    const toDelete = (existing || [])
      .map((r) => r.slug as string)
      .filter((s) => !slugs.includes(s));
    if (toDelete.length > 0) {
      await supabase.from("blogs").delete().in("slug", toDelete);
    }

    const now = Date.now();
    const rows = list.map((item, idx) => ({
      slug: item.slug,
      data: item,
      updated_at: new Date(now - idx * 1000).toISOString(),
    }));
    const { error } = await supabase.from("blogs").upsert(rows, { onConflict: "slug" });
    if (error) throw error;
  } else {
    await supabase.from("blogs").delete().neq("slug", "");
  }
}

export async function addOrUpdateBlogPost(post: BlogPost): Promise<BlogPost[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [post, ...BLOG_POSTS.filter((p) => p.slug !== post.slug)];

  await getAllBlogPosts();

  const { error } = await supabase.from("blogs").upsert(
    {
      slug: post.slug,
      data: post,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );
  if (error) throw error;

  return getAllBlogPosts();
}

export async function deleteBlogPostBySlug(slug: string): Promise<BlogPost[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return BLOG_POSTS.filter((p) => p.slug !== slug);

  const { error } = await supabase.from("blogs").delete().eq("slug", slug);
  if (error) throw error;

  return getAllBlogPosts();
}

export async function resetDefaultBlogPosts(): Promise<BlogPost[]> {
  await saveAllBlogPosts(BLOG_POSTS);
  return BLOG_POSTS;
}