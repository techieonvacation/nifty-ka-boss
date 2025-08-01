import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";
import { BlogPost } from "@/lib/blog/type";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div
      key={post._id}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 w-full">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
        />
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs shadow-md font-semibold px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          {post.author.avatar && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
              <Image
                src={post.author.avatar || "/images/manojkumar-dp.jpg"}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {post.author.name}
            </p>
            <p className="text-xs text-gray-500">{post.author.role}</p>
          </div>
        </div>
        <Link href={`/blogs/${post.slug || post._id}`}>
          <h3 className="text-xl font-bold mb-2 line-clamp-2 text-primary">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{post.readTime} min read</span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href={`/blogs/${post.slug || post._id}`}
            className="text-primary font-medium hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
