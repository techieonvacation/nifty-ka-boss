import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/type";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function FeaturedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Articles</h2>
        <Link
          href="/blog/featured"
          className="text-primary hover:underline flex items-center"
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
            </div>

            <div className="p-6">
              <span className="text-sm text-primary font-medium">
                {post.category}
              </span>
              <h3 className="text-xl font-bold mt-2 mb-3 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                    <Image
                      src={post.author.avatar || "/placeholder.svg"}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {post.author.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </span>
              </div>

              <Link
                href={`/blogs/${post._id}`}
                className="mt-4 inline-block text-primary font-medium hover:underline"
              >
                Read Article
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
