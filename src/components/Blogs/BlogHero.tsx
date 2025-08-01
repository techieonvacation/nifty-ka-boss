import Link from "next/link";

export default function BlogHero() {
  return (
    <div className="bg-primary/10 py-10">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="title text-3xl font-medium mb-4">
            Trading Insights & Market Analysis
          </h1>
          <p className="sub-title mb-8">
            Discover expert trading strategies, market analysis, and valuable
            insights to enhance your trading journey. Learn from a seasoned
            trading mentor.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#latest-posts"
              className="bg-primary hover:bg-primary-600 text-primary-foreground font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Latest Articles
            </Link>
            <Link
              href="#subscribe"
              className="bg-white hover:bg-gray-100 text-primary font-medium px-6 py-2 rounded-lg border border-primary transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
