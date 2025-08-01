import { NextResponse } from "next/server";

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- created with Free Online Sitemap Generator www.xml-sitemaps.com -->


<url>
  <loc>https://www.iamrakeshbansal.com/</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>1.00</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/subscriptions/intraday-btst-plan</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/subscriptions/option-intraday</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/subscriptions/mentorship-plan</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/subscriptions/futures-plan</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/subscriptions/commodity-plan</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/subscriptions/hni-service</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/courses/kurukshetra</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/about-us</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/events</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/blogs</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/disclaimer</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/privacy-policy</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/terms-conditions</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/customer-grievances</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/contact-us</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/blogs/the-commodity-market-a-complete-guide-by-rakesh-bansal-advisory</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/blogs/rakesh-bansal-advisory-services</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://www.iamrakeshbansal.com/courses/disclaimer</loc>
  <lastmod>2024-11-13T07:56:31+00:00</lastmod>
  <priority>0.64</priority>
</url>


</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
