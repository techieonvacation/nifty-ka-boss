import { notFound } from "next/navigation";
import { BlogPost } from "@/lib/blog/type";
import BlogSlug from "@/components/Blogs/BlogSlug";

const baseUrl =
  process.env.NEXT_PUBLIC_PRODUCTION_URL || "http://localhost:3000";

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${baseUrl}/api/blogposts/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await Promise.resolve(params);
  const post = await getBlogPost(slug);
  if (!post) return notFound();

  return <BlogSlug post={post} />;
}
