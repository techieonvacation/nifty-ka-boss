import "./globals.css";
import type { Metadata } from "next";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import { inter, dmSans, spaceGrotesk, urbanist } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Rakesh Bansal Ventures: Stock Market Research & Education",
  description:
    "We offers stock market research services, including intraday/BTST, options, futures, commodities, and HNI services. over 30 Year of experience in the market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="facebook-domain-verification"
          content="7sbzdg5h7ezaqc3s13lwv3xrx08tl1"
        />
      </head>
      <body
        className={`${inter.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${urbanist.variable} antialiased`}
      >
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}
