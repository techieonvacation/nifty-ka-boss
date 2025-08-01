import { BlogPost, Comment } from "./type";

const baseUrl =
  process.env.NEXT_PUBLIC_PRODUCTION_URL || "http://localhost:3000";

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${baseUrl}/api/blogposts`, {
      cache: "no-store",
      next: {
        tags: ["blogposts"],
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log("data blog", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function createBlogPost(formData: FormData): Promise<BlogPost> {
  const response = await fetch(`${baseUrl}/api/blogposts`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to create blog post");
  }
  return response.json();
}

export async function updateBlogPost(
  slug: string,
  formData: FormData
): Promise<BlogPost> {
  const response = await fetch(`${baseUrl}/api/blogposts/${slug}`, {
    method: "PUT",
    body: formData,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to update blog post");
  }
  return response.json();
}

export async function deleteBlogPost(slug: string): Promise<Response> {
  return fetch(`${baseUrl}/api/blogposts/${slug}`, {
    method: "DELETE",
  });
}

export async function getBlogPostComments(
  blogPostId: string
): Promise<Comment[]> {
  try {
    const response = await fetch(
      `${baseUrl}/api/comments?blogPostId=${blogPostId}`,
      {
        next: {
          revalidate: 60,
          tags: ["comments"],
        },
      }
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function createComment(
  blogPostId: string,
  author: string,
  content: string
): Promise<Response> {
  return fetch(`${baseUrl}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blogPostId, author, content }),
  });
}

export async function updateComment(
  id: string,
  content: string
): Promise<Response> {
  return fetch(`${baseUrl}/api/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(id: string): Promise<Response> {
  return fetch(`${baseUrl}/api/comments/${id}`, {
    method: "DELETE",
  });
}
