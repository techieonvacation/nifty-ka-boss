import { NextRequest, NextResponse } from "next/server";
import { Db } from "mongodb";
import clientPromise from "@/lib/mongodb";
import sharp from "sharp";
import { generateSlug } from "@/lib/utils";

// Cache database connection globally
let dbConnection: Db | null = null;

async function getDatabase(): Promise<Db> {
  if (!dbConnection) {
    const client = await clientPromise;
    dbConnection = client.db("Iamrakeshbansal");

    try {
      // Check if indexes already exist
      const indexInfo = await dbConnection
        .collection("posts")
        .indexInformation();

      // Only create indexes if they don't exist
      if (!indexInfo.slug_1) {
        await dbConnection
          .collection("posts")
          .createIndex({ slug: 1 }, { unique: true });
      }

      if (!indexInfo.createdAt_1) {
        await dbConnection
          .collection("posts")
          .createIndexes([
            { key: { createdAt: -1 } },
            { key: { tags: 1 } },
            { key: { author: 1 } },
            { key: { category: 1 } },
          ]);
      }
    } catch (error) {
      console.error("Error setting up indexes:", error);
      // Continue even if index creation fails
    }
  }
  return dbConnection;
}

export async function GET() {
  try {
    const db = await getDatabase();
    const posts = await db
      .collection("posts")
      .find(
        {},
        {
          projection: {
            _id: 1,
            title: 1,
            slug: 1,
            tags: 1,
            image: 1,
            createdAt: 1,
            author: 1,
            category: 1,
            readTime: 1,
            excerpt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return new NextResponse(JSON.stringify(posts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (!title || !content || !author || !category) {
      return NextResponse.json(
        { error: "Title, content, author, and category are required" },
        { status: 400 }
      );
    }

    let imagePath = "";
    if (image) {
      imagePath = await saveImage(image);
    }

    let slug = generateSlug(title);

    const db = await getDatabase();

    // Check if slug already exists
    const existingPost = await db.collection("posts").findOne({ slug });
    if (existingPost) {
      // Append timestamp to ensure uniqueness
      const timestamp = Date.now().toString().slice(-6);
      slug = `${slug}-${timestamp}`;
    }

    const result = await db.collection("posts").insertOne({
      title,
      slug,
      content,
      tags,
      image: imagePath,
      author,
      category,
      readTime,
      excerpt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newPost = {
      _id: result.insertedId,
      title,
      slug,
      content,
      tags,
      image: imagePath,
      author,
      category,
      readTime,
      excerpt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(
      { success: true, post: newPost },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
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

    // Convert File to Buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Process image with sharp
    const processedImageBuffer = await sharp(buffer)
      .resize({
        width: 1200, // Max width
        height: 800, // Max height
        fit: "inside", // Maintain aspect ratio
        withoutEnlargement: true, // Don't enlarge if image is smaller
      })
      .webp({
        quality: 80, // Adjust quality (0-100)
        effort: 6, // Compression effort (0-6)
      })
      .toBuffer();

    // Convert to base64
    const base64Image = processedImageBuffer.toString("base64");
    return `data:image/webp;base64,${base64Image}`;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error(`Failed to process image: ${(error as Error).message}`);
  }
}
