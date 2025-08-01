import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `
User-agent: *
Disallow: 
Disallow: /cgi-bin/
Sitemap: https://www.iamrakeshbansal.com/sitemap.xml
  `;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
