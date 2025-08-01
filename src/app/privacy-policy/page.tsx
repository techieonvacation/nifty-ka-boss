import FAQ from "@/components/ui/Faq";
import PrivacyPolicy from "@/components/ui/PrivacyPolicy";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rakesh Bansal Ventures Privacy Policy | How We Protect Information",
  description:
    "Learn how Rakesh Bansal Ventures protects your privacy. This policy details data collection practices, information usage, and user control over their data.",
};

const page = () => {
  return (
    <div>
      <PrivacyPolicy />
      <FAQ />
    </div>
  );
};

export default page;
