import Contact from "@/components/ui/Contact";
import FAQ from "@/components/ui/Faq";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect with Rakesh Bansal Ventures | Contact Us Today",
  description:
    "Get in touch with Rakesh Bansal, a leading stock market expert and trainer. Contact us for expert advice, trading courses, and market insights. Start your journey to smart investing today!",
};

const page = () => {
  return (
    <main>
      <Contact />
      <FAQ />
    </main>
  );
};

export default page;
