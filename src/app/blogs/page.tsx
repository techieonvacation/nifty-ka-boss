import BlogHero from "@/components/Blogs/BlogHero";
import FeaturedPosts from "@/components/Blogs/FeaturedPosts";
import BlogListing from "@/components/Blogs/BlogListing";
import BlogGrid from "@/components/ui/blogs/BlogGrid";
import { Suspense } from "react";
import Categories from "@/components/ui/blogs/categories";
import { getBlogPosts } from "@/lib/blog/api";

export default async function BlogsPage() {
  // Fetch blog posts from API
  const blogPosts = await getBlogPosts();

  // Get all unique categories
  const categories = [...new Set(blogPosts.map((post) => post.category))];

  // Get featured posts
  const featuredPosts = blogPosts.filter((post) => post.featured);

  // Get all posts for the main listing
  const allPosts = blogPosts;

  return (
    <main className="min-h-screen bg-background">
      <BlogHero />
      <section className="container py-10">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <span className="loader" />
            </div>
          }
        >
          <BlogGrid posts={allPosts} />
        </Suspense>
      </section>
      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts Section */}
        <FeaturedPosts posts={featuredPosts} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <BlogListing posts={allPosts} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Categories categories={categories} />
          </div>
        </div>
      </div>
    </main>
  );
}
