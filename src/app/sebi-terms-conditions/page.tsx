import FAQ from "@/components/ui/Faq";
import SEBIMITC from "@/components/ui/sebiMITC";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Rakesh Bansal Ventures SEBI MITC | Legal Notice",
  description:
    "Access and use Rakesh Bansal Ventures' services responsibly. Review our Terms & Conditions for website usage guidelines, intellectual property rights, and legal disclaimers.",
};

const page = () => {
  return (
    <div>
      <SEBIMITC />
      <FAQ />
    </div>
  );
};

export default page;
