import FAQ from "@/components/ui/Faq";
import TermsAndConditions from "@/components/ui/TermsAndConditions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Rakesh Bansal Ventures Terms & Conditions | Legal Notice",
  description:
    "Access and use Rakesh Bansal Ventures' services responsibly. Review our Terms & Conditions for website usage guidelines, intellectual property rights, and legal disclaimers.",
};

const page = () => {
  return (
    <div>
      <TermsAndConditions />
      <FAQ />
    </div>
  );
};

export default page;
