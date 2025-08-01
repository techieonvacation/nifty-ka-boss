import Link from "next/link";

export default function Categories({ categories }: { categories: string[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Categories</h3>

      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category}
            href="#"
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>{category}</span>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {/* This would ideally be a count of posts in this category */}
              {Math.floor(Math.random() * 10) + 1}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
