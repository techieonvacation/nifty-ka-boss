import { NextResponse } from "next/server";
import { migrateBlogPosts } from "@/lib/blog/migration";

export async function POST() {
  try {
    const result = await migrateBlogPosts();

    return NextResponse.json(
      {
        success: true,
        message: `Migration complete. Updated ${result.updated} posts with ${result.errors} errors.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in migration endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
