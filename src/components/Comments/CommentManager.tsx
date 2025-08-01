"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Pencil, Save, Trash, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Comment,
  fetchComments,
  updateComment,
  deleteComment,
  getAuthorDisplay,
} from "./api";

export default function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchComments();
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadComments();
  }, []);

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const handleSave = async (id: string) => {
    try {
      await updateComment(id, editContent);
      setEditingComment(null);
      loadComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
      loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 font-montserrat">
        Comment Manager
      </h2>

      {isLoading ? (
        <p className="text-center py-4">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center py-4">No comments found.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white shadow-sm border border-border rounded-lg p-4 mb-4"
          >
            <p>
              <strong className="font-oswald">Author:</strong>{" "}
              {getAuthorDisplay(comment.author)}
            </p>
            <p>
              <strong className="font-oswald">Blog Post ID:</strong>{" "}
              {comment.blogPostId}
            </p>
            {editingComment === comment._id ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSave(comment._id)}
                    leftIcon={<Save className="size-4" />}
                  >
                    Save
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setEditingComment(null)}
                    leftIcon={<X className="size-4" />}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p>
                  <strong className="font-oswald">Content:</strong>{" "}
                  {comment.content}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(comment)}
                    leftIcon={<Pencil className="size-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(comment._id)}
                    leftIcon={<Trash className="size-4" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
