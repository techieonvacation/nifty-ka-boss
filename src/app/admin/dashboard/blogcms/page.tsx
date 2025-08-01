import CreateBlogPost from "@/components/Blogs/CreateBlog";
export default async function BlogCMSPage() {
  return (
    <div className="container space-y-12 px-4">
      <CreateBlogPost />
    </div>
  );
}
