"use client";

import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

import { useDropzone } from "react-dropzone";
import {
  X,
  Upload,
  Tag,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
} from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { BlogPost, Author } from "@/lib/blog/type";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPosts,
} from "@/lib/blog/api";

// Validation Schemas
const tagSchema = z
  .string()
  .min(1, "Tag must be at least 1 character")
  .max(20, "Tag must be at most 20 characters");

// Props Interface
interface CreateBlogPostProps {
  onPostCreatedAction?: (post: BlogPost) => Promise<void>;
  onPostUpdatedAction?: (post: BlogPost) => Promise<void>;
  onPostDeletedAction?: (postId: string) => Promise<void>;
}

// Editor Props Interface
interface EditorProps {
  editor: Editor | null;
}

// MenuBar Component
const MenuBar: React.FC<EditorProps> = ({ editor }) => {
  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      try {
        new URL(url); // Validate URL
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        toast.error("Invalid image URL");
      }
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter the URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    try {
      new URL(url); // Validate URL
      editor.chain().focus().setLink({ href: url }).run();
    } catch {
      toast.error("Invalid link URL");
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 mb-2 border-b border-border bg-muted rounded-t-xl shadow-sm">
      <div className="flex gap-1 mr-2 border-r pr-2 border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold"
          aria-label="Toggle bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic"
          aria-label="Toggle italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
          title="Underline"
          aria-label="Toggle underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("highlight") ? "bg-gray-200" : ""
          }`}
          title="Highlight"
          aria-label="Toggle highlight"
        >
          <Highlighter size={18} />
        </button>
      </div>

      <div className="flex gap-1 mr-2 border-r pr-2 border-gray-200">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 1"
          aria-label="Toggle heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 2"
          aria-label="Toggle heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 3"
          aria-label="Toggle heading 3"
        >
          <Heading3 size={18} />
        </button>
      </div>

      <div className="flex gap-1 mr-2 border-r pr-2 border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }`}
          title="Align Left"
          aria-label="Align left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }`}
          title="Align Center"
          aria-label="Align center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }`}
          title="Align Right"
          aria-label="Align right"
        >
          <AlignRight size={18} />
        </button>
      </div>

      <div className="flex gap-1 mr-2 border-r pr-2 border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Bullet List"
          aria-label="Toggle bullet list"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Ordered List"
          aria-label="Toggle ordered list"
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
          title="Quote"
          aria-label="Toggle blockquote"
        >
          <Quote size={18} />
        </button>
      </div>

      <div className="flex gap-1 mr-2 border-r pr-2 border-gray-200">
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
          title="Add Link"
          aria-label="Add or edit link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Image"
          aria-label="Add image"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      <div className="flex gap-1">
        <select
          value={editor.getAttributes("textStyle").fontFamily || ""}
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
          className="p-2 rounded border border-gray-200 hover:bg-gray-100"
          title="Font Family"
          aria-label="Select font family"
        >
          <option value="">Default</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Inter">Inter</option>
          <option value="monospace">Monospace</option>
        </select>

        <input
          type="color"
          value={editor.getAttributes("textStyle").color || "#000000"}
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="p-1 rounded border border-gray-200 w-10 h-10 cursor-pointer"
          title="Text Color"
          aria-label="Select text color"
        />
      </div>
    </div>
  );
};

// CreateBlogPost Component
const CreateBlogPost: React.FC<CreateBlogPostProps> = ({
  onPostCreatedAction = async () => {},
  onPostUpdatedAction = async () => {},
  onPostDeletedAction = async () => {},
}) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<Author>({
    name: "",
    avatar: "",
    role: "",
  });
  const [category, setCategory] = useState<string>("");
  const [readTime, setReadTime] = useState<number>(5);
  const [excerpt, setExcerpt] = useState<string>("");
  const [featured, setFeatured] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await getBlogPosts();
      // Ensure each post has the required properties and a unique _id
      const validPosts = fetchedPosts.map((post) => {
        // Ensure _id exists and is a string
        const postId =
          typeof post._id === "string"
            ? post._id
            : `temp-${Date.now()}-${Math.random()}`;

        return {
          _id: postId,
          title: post.title || "",
          content: post.content || "",
          tags: Array.isArray(post.tags) ? post.tags : [],
          author: post.author || { name: "", avatar: "", role: "" },
          category: post.category || "",
          readTime: post.readTime || 5,
          excerpt: post.excerpt || "",
          featured: post.featured || false,
          createdAt: post.createdAt || new Date().toISOString(),
          updatedAt: post.updatedAt || new Date().toISOString(),
          image: post.image || "",
        };
      });
      setPosts(validPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch blog posts");
    }
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3], HTMLAttributes: { class: "font-bold" } },
        bulletList: { HTMLAttributes: { class: "list-disc pl-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-6" } },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-300 pl-4 italic text-gray-600",
          },
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "max-w-full h-auto rounded-md my-2" },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-blue-600 hover:underline" },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "blockquote", "image"],
        defaultAlignment: "left",
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      Placeholder.configure({
        placeholder: "Write your blog post content here...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none p-4 min-h-[300px] border rounded-b-lg",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editingPost) {
      editor.commands.setContent(editingPost.content);
      setTitle(editingPost.title);
      setTags(editingPost.tags);
      setPreviewImage(editingPost.image || null);
      setAuthor({
        name: editingPost.author?.name || "",
        avatar: editingPost.author?.avatar || "",
        role: editingPost.author?.role || "",
      });
      setCategory(editingPost.category || "");
      setReadTime(editingPost.readTime || 5);
      setExcerpt(editingPost.excerpt || "");
      setFeatured(editingPost.featured || false);
    }
  }, [editingPost, editor]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    multiple: false,
    maxSize: 2 * 1024 * 1024, // 2MB limit
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", editor?.getHTML() || "");
        formData.append("tags", JSON.stringify(tags));
        formData.append("author", JSON.stringify(author));
        formData.append("category", category);
        formData.append("readTime", readTime.toString());
        formData.append("excerpt", excerpt);
        formData.append("featured", featured ? "true" : "false");
        if (image) {
          formData.append("image", image);
        }

        // Optimistically update UI
        const optimisticPost: BlogPost = {
          _id: `temp-${Date.now()}`,
          title,
          slug: "",
          content: editor?.getHTML() || "",
          tags,
          author,
          category,
          readTime,
          excerpt,
          featured,
          image: previewImage || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (editingPost) {
          // Optimistic update for editing
          setPosts(
            posts.map((post) =>
              post._id === editingPost._id
                ? { ...optimisticPost, _id: editingPost._id }
                : post
            )
          );
          const updatedPost = await updateBlogPost(editingPost._id, formData);
          await onPostUpdatedAction(updatedPost);
          toast.success("Blog post updated successfully!");
        } else {
          // Optimistic update for new post
          setPosts((prevPosts) => [optimisticPost, ...prevPosts]);
          const newPost = await createBlogPost(formData);
          await onPostCreatedAction(newPost);
          toast.success("Blog post created successfully!");
        }

        resetForm();
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        // Revert optimistic update on error
        fetchPosts().catch(console.error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      title,
      editor,
      tags,
      image,
      author,
      category,
      readTime,
      excerpt,
      editingPost,
      onPostCreatedAction,
      onPostUpdatedAction,
      fetchPosts,
      router,
      featured,
      posts,
      previewImage,
    ]
  );

  const resetForm = useCallback(() => {
    setTitle("");
    editor?.commands.setContent("");
    setImage(null);
    setPreviewImage(null);
    setTags([]);
    setCurrentTag("");
    setEditingPost(null);
    setAuthor({ name: "", avatar: "", role: "" });
    setCategory("");
    setReadTime(5);
    setExcerpt("");
    setFeatured(false);
  }, [editor]);

  const handleEdit = useCallback((post: BlogPost) => {
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(
    async (postId: string) => {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      try {
        // Optimistically remove the post from the UI immediately
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );

        // Then perform the actual deletion in the background
        await deleteBlogPost(postId);
        await onPostDeletedAction(postId);
        toast.success("Blog post deleted successfully!");

        // Only refresh the router to update any server components
        router.refresh();
      } catch (error) {
        // If there's an error, revert the optimistic update
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete post";
        toast.error(errorMessage);

        // Only fetch posts if there was an error to ensure UI is in sync
        fetchPosts().catch(console.error);
      }
    },
    [onPostDeletedAction, fetchPosts, router]
  );

  const addTag = useCallback(() => {
    const trimmedTag = currentTag.trim();
    if (!tagSchema.safeParse(trimmedTag).success) {
      toast.error("Tags must be 1-20 characters");
      return;
    }
    if (!tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  }, [currentTag, tags]);

  const removeTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags]
  );

  return (
    <div className="p-4 bg-card rounded-2xl border border-border">
      <h2 className="text-3xl font-bold font-rajdhani text-primary mb-6">
        Create a New Blog Post
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
            required
            maxLength={100}
            aria-label="Blog Post Title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Featured Image
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-500"
            }`}
            aria-label="Image upload area"
          >
            <input {...getInputProps()} />
            {previewImage ? (
              <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg border border-border">
                <img
                  src={previewImage}
                  alt="Featured image preview"
                  className="object-cover w-full h-56 transition-transform duration-300 hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewImage(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-gray-500">
                <Upload className="mx-auto h-12 w-12" />
                <p>Drag & drop an image here, or click to select one</p>
                <p className="text-sm">(Max 2MB, JPG/PNG/WEBP)</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-medium mb-1"
          >
            Author Name
          </label>
          <input
            id="authorName"
            type="text"
            value={author.name}
            onChange={(e) => setAuthor({ ...author, name: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
            required
            aria-label="Author Name"
          />
        </div>
        <div>
          <label
            htmlFor="authorAvatar"
            className="block text-sm font-medium mb-1"
          >
            Author Avatar URL (Optional)
          </label>
          <input
            id="authorAvatar"
            type="url"
            value={author.avatar}
            onChange={(e) => setAuthor({ ...author, avatar: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
            placeholder="https://example.com/avatar.jpg"
            aria-label="Author Avatar URL"
          />
        </div>
        <div>
          <label
            htmlFor="authorRole"
            className="block text-sm font-medium mb-1"
          >
            Author Role
          </label>
          <input
            id="authorRole"
            type="text"
            value={author.role}
            onChange={(e) => setAuthor({ ...author, role: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
            required
            aria-label="Author Role"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
            required
            aria-label="Category"
          />
        </div>
        <div>
          <label htmlFor="readTime" className="block text-sm font-medium mb-1">
            Read Time (minutes)
          </label>
          <input
            id="readTime"
            type="number"
            value={readTime}
            onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
            min="1"
            required
            aria-label="Read Time"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
            rows={3}
            required
            aria-label="Excerpt"
            maxLength={200}
          />
        </div>
        <div>
          <label htmlFor="featured" className="block text-sm font-medium mb-1">
            Featured
          </label>
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="mr-2"
          />
          <span>Mark as featured</span>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <div className="flex items-center gap-2">
            <input
              id="tags"
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              className="flex-grow px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
              placeholder="Add a tag and press Enter"
              maxLength={20}
              aria-label="Add tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-primary text-white py-2 px-4 rounded-lg shadow hover:bg-primary/90 transition-all font-semibold"
              aria-label="Add tag"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm shadow-sm font-medium"
              >
                <Tag size={14} className="mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-red-500 hover:text-red-700"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border border-border rounded-lg text-foreground bg-muted hover:bg-muted/80 transition-all"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition-all font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editingPost ? "Updating..." : "Creating..."}
              </span>
            ) : editingPost ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </form>

      {/* Posts List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Blog Posts</h2>
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => {
              // Ensure we have a valid key
              const postKey = post._id || `post-${index}-${Date.now()}`;

              return (
                <div
                  key={postKey}
                  className="border rounded-xl p-5 bg-card shadow hover:shadow-lg transition-shadow flex flex-col md:flex-row justify-between items-start gap-4"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="text-gray-600 mt-1">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(post.tags) &&
                        post.tags.map((tag, tagIndex) => (
                          <span
                            key={`${postKey}-tag-${tagIndex}`}
                            className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-4">
              No blog posts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;
