"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface TableOfContentsProps {
  items: { id: string; text: string }[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Ensure unique IDs by adding index if needed
  const uniqueItems = items.map((item, index) => ({
    ...item,
    uniqueId: `${item.id}-${index}`,
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    uniqueItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [uniqueItems]);

  const TocContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Table of Contents</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-100px)]">
        <nav className="p-4 space-y-1">
          {uniqueItems.map((item, index) => (
            <motion.a
              key={item.uniqueId}
              href={`#${item.id}`}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 py-2 px-3 rounded-md text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                activeId === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
              <span className="line-clamp-2 font-oswald font-medium">
                {item.text}
              </span>
            </motion.a>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t bg-muted/50 text-xs text-muted-foreground text-center">
        {uniqueItems.length} sections
      </div>
    </>
  );

  return (
    <>
      {/* Mobile TOC */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden fixed bottom-20 right-4 z-50 rounded-full shadow-lg"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Contents
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="p-0 w-[300px] sm:w-[400px] font-poppins"
          title="Table of Contents"
        >
          <TocContent />
        </SheetContent>
      </Sheet>

      {/* Desktop TOC */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="bg-card rounded-lg border shadow-sm">
            <TocContent />
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary font-rajdhani"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((uniqueItems.findIndex((item) => item.id === activeId) +
                      1) /
                      uniqueItems.length) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
