import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/type";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function BlogListing({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="latest-posts">
      <h2 className="text-2xl font-bold mb-8 text-primary">Latest Articles</h2>
      {posts.map((post) => (
        <article
          key={post._id}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row mb-8"
        >
          <div className="relative h-56 md:h-auto md:w-1/3">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6 md:w-2/3">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-3">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                {post.author.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={post.author.avatar || "/images/avatar2.webp"}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground text-base">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{post.readTime} min read</span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href={`/blogs/${post.slug || post._id}`}
                className="text-primary font-medium hover:underline"
              >
                Read Full Article
              </Link>
            </div>
          </div>
        </article>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <nav className="flex items-center gap-1">
          <button className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
            &laquo;
          </button>
          <button className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center">
            1
          </button>
          <button className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50">
            3
          </button>
          <span className="w-10 h-10 flex items-center justify-center text-gray-500">
            ...
          </span>
          <button className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50">
            10
          </button>
          <button className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
            &raquo;
          </button>
        </nav>
      </div>
    </section>
  );
}
