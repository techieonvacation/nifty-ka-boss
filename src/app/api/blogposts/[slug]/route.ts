import { NextRequest, NextResponse } from "next/server";
import { Db } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { generateSlug } from "@/lib/utils";

async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("Iamrakeshbansal");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();

    // Try to find by slug first
    let post = await db.collection("posts").findOne({ slug });

    // If not found by slug, try by ID (for backward compatibility)
    if (!post && ObjectId.isValid(slug)) {
      post = await db.collection("posts").findOne({ _id: new ObjectId(slug) });

      // If found by ID, update to add slug for future requests
      if (post && !post.slug) {
        const newSlug = generateSlug(post.title);
        await db
          .collection("posts")
          .updateOne({ _id: post._id }, { $set: { slug: newSlug } });
        post.slug = newSlug;
      }
    }

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const image = formData.get("image") as File | null;
    const author = JSON.parse(formData.get("author") as string);
    const category = formData.get("category") as string;
    const readTime = parseInt(formData.get("readTime") as string) || 5;
    const excerpt = formData.get("excerpt") as string;

    const db = await getDatabase();
    const { slug } = await params;

    // Define query type
    type PostQuery =
      | { slug: string }
      | { _id: ObjectId }
      | { $or: [{ slug: string }, { _id: ObjectId }] };

    // Find by slug or ID
    let query: PostQuery = { slug };
    if (ObjectId.isValid(slug)) {
      query = { $or: [{ slug }, { _id: new ObjectId(slug) }] };
    }

    const existingPost = await db.collection("posts").findOne(query);

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    let imagePath = existingPost.image;
    if (image) {
      imagePath = await saveImage(image);
    }

    // Generate new slug if title changed
    let newSlug = existingPost.slug || slug;
    if (title !== existingPost.title) {
      newSlug = generateSlug(title);

      // Check if new slug already exists (avoid duplicates)
      const slugExists = await db.collection("posts").findOne({
        slug: newSlug,
        _id: { $ne: existingPost._id },
      });

      if (slugExists) {
        // Append timestamp to ensure uniqueness
        const timestamp = Date.now().toString().slice(-6);
        newSlug = `${newSlug}-${timestamp}`;
      }
    }

    const updateData = {
      title,
      slug: newSlug,
      content,
      tags,
      image: imagePath,
      author,
      category,
      readTime,
      excerpt,
      updatedAt: new Date(),
    };

    await db
      .collection("posts")
      .updateOne({ _id: existingPost._id }, { $set: updateData });

    return NextResponse.json(
      { success: true, post: { ...updateData, _id: existingPost._id } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();

    // Define query type
    type PostQuery =
      | { slug: string }
      | { _id: ObjectId }
      | { $or: [{ slug: string }, { _id: ObjectId }] };

    // Find by slug or ID
    let query: PostQuery = { slug };
    if (ObjectId.isValid(slug)) {
      query = { $or: [{ slug }, { _id: new ObjectId(slug) }] };
    }

    const result = await db.collection("posts").deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function saveImage(image: File): Promise<string> {
  try {
    const maxSize = 2 * 1024 * 1024; // 2MB limit
    if (image.size > maxSize) {
      throw new Error("Image size exceeds 2MB limit");
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");
    return `data:${image.type};base64,${base64Image}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error(`Failed to process image: ${(error as Error).message}`);
  }
}
