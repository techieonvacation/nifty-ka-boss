import axios from "axios";

export interface Comment {
  _id: string;
  blogPostId: string;
  author: string | { name: string };
  content: string;
  createdAt: string;
}

// Fetch all comments or filter by blogPostId if provided
export const fetchComments = async (blogPostId?: string) => {
  try {
    const url = blogPostId
      ? `/api/comments?blogPostId=${blogPostId}`
      : "/api/comments";

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (id: string, content: string) => {
  try {
    const response = await axios.put(`/api/comments/${id}`, { content });
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (id: string) => {
  try {
    const response = await axios.delete(`/api/comments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Get author display name
export const getAuthorDisplay = (author: string | { name: string }) => {
  if (typeof author === "string") {
    return author;
  }
  return author.name || "Unknown";
};
