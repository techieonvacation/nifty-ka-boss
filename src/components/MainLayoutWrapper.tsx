"use client";
// import { ThemeProvider } from "@/lib/theme-provider";
import Navbar from "@/components/ui/Navbar/Navbar";
import Footer from "@/components/ui/Footer/Footer";
import { Toaster } from "react-hot-toast";
import GoogleTagManagerScript from "./GoogleTagManagerScript";
import FacebookPixelCodeScript from "./FacebookPixelCodeScript";
import GoogleTagManagerPopup from "./GoogleTagManagerPopup";
import GoogleAnalytics from "./GoogleAnalytics";
import TaboolaPixel from "./TaboolaPixel";
import TaboolaPixel1 from "./TaboolaPixel1";
import SocialMediaSidebar from "./SocialMediaSidebar";
import { SessionProvider } from "next-auth/react";

interface MainLayoutWrapperProps {
  children: React.ReactNode;
}

export default function MainLayoutWrapper({
  children,
}: MainLayoutWrapperProps) {
  return (
    <>
      <GoogleTagManagerScript />
      <FacebookPixelCodeScript />
      <GoogleTagManagerPopup />
      <GoogleAnalytics />
      <TaboolaPixel />
      <TaboolaPixel1 />
      {/* <ThemeProvider defaultTheme="light" storageKey="iamrakeshbansal-theme"> */}
      <SessionProvider>
        <Navbar />
        <main className="pt-16 overflow-hidden">{children}</main>
      </SessionProvider>
      <Toaster position="top-center" reverseOrder={false} />
      {/* </ThemeProvider> */}
      <footer>
        <Footer />
      </footer>
      {/* <Carecature /> */}
      <SocialMediaSidebar />
    </>
  );
}
