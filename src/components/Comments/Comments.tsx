"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  _id: string;
  blogPostId: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}

interface CommentsProps {
  blogPostId: string;
}

export function Comments({ blogPostId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?blogPostId=${blogPostId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [blogPostId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!newComment.trim()) {
      setError("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogPostId,
          author: {
            name: userName.trim(),
          },
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment("");
        setUserName("");
        fetchComments();
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-5xl space-y-8 py-12">
      {/* Comment Editor Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-2xl font-semibold text-foreground font-oswald">
          <MessageCircle className="h-6 w-6" />
          Comments ({comments.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditorOpen(!isEditorOpen)}
          className="flex items-center gap-2 text-primary"
          aria-label={isEditorOpen ? "Hide Editor" : "Write a Comment"}
        >
          {isEditorOpen ? (
            <div className="flex items-center gap-2 font-oswald">
              <ChevronUp className="h-5 w-5" />
              Hide Editor
            </div>
          ) : (
            <div className="flex items-center gap-2 font-oswald">
              <ChevronDown className="h-5 w-5" />
              Write a Comment
            </div>
          )}
        </Button>
      </div>

      {/* Comment Form */}
      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="border border-border/50 bg-card/50 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground font-inter"
                      >
                        Your Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-1 w-full rounded-md border-border bg-background/50 transition-colors focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="comment"
                        className="text-sm font-medium text-foreground font-inter"
                      >
                        Your Comment
                      </label>
                      <Textarea
                        id="comment"
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mt-1 min-h-[100px] outline-none focus:outline-none w-full rounded-md border-border bg-background/50 transition-colors focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="animate-spin">⚪</span>
                        Posting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-oswald">
                        <Send className="h-4 w-4" />
                        Post Comment
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground font-space-grotesk">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <Card
              key={comment._id}
              className="border border-border/50 bg-card/50 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      <span className="font-semibold text-foreground font-inter capitalize">
                        {comment.author.name}
                      </span>
                      <span className="text-sm text-muted-foreground font-poppins">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="mt-2 text-foreground/80 leading-relaxed font-inter">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
