"use client";
import { BlogPost } from "@/lib/blog/type";
import Image from "next/image";
import Link from "next/link";
import { Clock, Share2, ArrowUp, ChevronRight, Home } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Comments } from "@/components/Comments/Comments";
import { ShareDialog } from "@/components/ShareDialog";
import { TableOfContents } from "@/components/TableOfContents";

interface BlogSlugProps {
  post: BlogPost;
}

export default function BlogSlug({ post }: BlogSlugProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [tocItems, setTocItems] = useState<{ id: string; text: string }[]>([]);
  const { ref: contentRef } = useInView({ threshold: 0.1 });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const headings = document.querySelectorAll("h2, h3");
    const items = Array.from(headings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
    }));
    setTocItems(items);
  }, [post.content]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background/80 dark:to-background">
      {/* Floating Action Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed right-4 sm:right-14 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/90 dark:bg-background/70 backdrop-blur-sm shadow-md hover:shadow-lg hover:bg-background transition-all"
          onClick={() => setShowShareDialog(true)}
          aria-label="Share post"
        >
          <Share2 className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/90 dark:bg-background/70 backdrop-blur-sm shadow-md hover:shadow-lg hover:bg-background transition-all"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="py-8">
          {/* Breadcrumb Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center mb-6 text-sm font-medium"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <Home className="w-4 h-4" />
                  <span className="sr-only font-inter">Home</span>
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-muted-foreground hover:text-primary transition-colors font-inter"
                >
                  Blog
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </li>
              <li className="text-primary font-medium font-inter truncate max-w-[200px] sm:max-w-xs">
                {post.title}
              </li>
            </ol>
          </motion.nav>

          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="relative w-full aspect-[16/9] max-h-[600px] rounded-2xl overflow-hidden shadow-sm mb-6">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 700px"
              />
              {post.category && (
                <span className="absolute font-inter top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                  {post.category}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight font-montserrat">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {post.author.avatar && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground font-montserrat">
                  {post.author.name}
                </p>
                <p className="text-sm text-muted-foreground font-inter">
                  {post.author.role}
                </p>
              </div>
              <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground font-oswald">
                <Clock className="w-4 h-4" />
                {formatDate(post.createdAt)} • {post.readTime} min read
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-accent/80 text-accent-foreground rounded-full px-3 py-1 text-xs font-medium font-oswald"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Mobile Share Button */}
          <div className="lg:hidden flex justify-end mb-6">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-background/90 dark:bg-background/70 backdrop-blur-sm"
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Table of Contents */}
            <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start order-2 lg:order-1">
              <TableOfContents items={tocItems} />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 order-1 lg:order-2" ref={contentRef}>
              <div
                className="prose prose-base sm:prose-lg max-w-none text-foreground font-montserrat prose-headings:font-montserrat prose-headings:font-semibold prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-md dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* Comments Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 sm:mt-16"
          >
            <Comments blogPostId={post._id} />
          </motion.section>
        </article>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        url={typeof window !== "undefined" ? window.location.href : ""}
        title={post.title}
      />

      {/* Scroll to Top Button (Mobile) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 lg:hidden bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
