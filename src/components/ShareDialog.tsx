"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Share2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  url,
  title,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-gray-800">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Share this article
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                platform: "Facebook",
                icon: Facebook,
                link: shareLinks.facebook,
                color: "#1877F2",
              },
              {
                platform: "Twitter",
                icon: Twitter,
                link: shareLinks.twitter,
                color: "#1DA1F2",
              },
              {
                platform: "LinkedIn",
                icon: Linkedin,
                link: shareLinks.linkedin,
                color: "#0A66C2",
              },
            ].map(({ platform, icon: Icon, link, color }) => (
              <motion.div
                key={platform}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 w-full h-auto py-4 bg-white/50 hover:bg-white/70 border-gray-200/50 rounded-xl transition-colors duration-200"
                  onClick={() => window.open(link, "_blank")}
                  aria-label={`Share on ${platform}`}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                  <span className="text-xs font-medium text-gray-600">
                    {platform}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Copy Link
            </label>
            <div className="flex gap-2">
              <Input
                value={url}
                readOnly
                className="font-mono text-sm bg-gray-50/50 border-gray-200/50 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
                aria-label="Share URL"
              />
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0 bg-white/50 hover:bg-white/70 border-gray-200/50 rounded-xl"
                  aria-label="Copy link to clipboard"
                >
                  <LinkIcon className="w-5 h-5 text-indigo-600" />
                </Button>
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-sm text-indigo-600 text-center font-medium"
              >
                Link copied to clipboard!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
