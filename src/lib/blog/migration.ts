import clientPromise from "@/lib/mongodb";
import { generateSlug } from "@/lib/utils";

export async function migrateBlogPosts() {
  console.log("Starting blog post migration to add slugs...");
  try {
    const client = await clientPromise;
    const db = client.db("Iamrakeshbansal");

    // First, drop the existing slug index if it exists
    try {
      await db.collection("posts").dropIndex("slug_1");
      console.log("Dropped existing slug index");
    } catch (error) {
      console.log(
        "No existing slug index to drop or error dropping index:",
        error
      );
    }

    // Create the new unique index
    await db.collection("posts").createIndex({ slug: 1 }, { unique: true });
    console.log("Created new unique slug index");

    // Find all posts without slugs
    const posts = await db
      .collection("posts")
      .find({ slug: { $exists: false } })
      .toArray();

    console.log(`Found ${posts.length} posts without slugs.`);

    let updated = 0;
    let errors = 0;

    for (const post of posts) {
      try {
        let slug = generateSlug(post.title);

        // Check if slug already exists
        const existingWithSlug = await db.collection("posts").findOne({
          slug,
          _id: { $ne: post._id },
        });

        if (existingWithSlug) {
          // Make sure the slug is unique by adding the post ID
          slug = `${slug}-${post._id.toString().slice(-6)}`;
        }

        // Update the post with the new slug
        await db
          .collection("posts")
          .updateOne({ _id: post._id }, { $set: { slug } });

        updated++;
        console.log(`Updated post: ${post.title} with slug: ${slug}`);
      } catch (error) {
        errors++;
        console.error(`Error updating post ${post._id}:`, error);
      }
    }

    console.log(
      `Migration complete. Updated ${updated} posts with ${errors} errors.`
    );
    return { updated, errors };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
