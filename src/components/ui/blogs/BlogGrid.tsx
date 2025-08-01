import BlogCard from "./BlogCard";
import { BlogPost } from "@/lib/blog/type";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return <div>No posts found.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
