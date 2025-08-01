import { Metadata } from "next";
import CustomerGrievances from "@/components/CustomerGrievances";
import FAQ from "@/components/ui/Faq";
import React from "react";

export const metadata: Metadata = {
  title: "Address Your Concerns - Customer Grievances",
  description:
    "Resolve your issues with Rakesh Bansal Ventures. Learn how to file a complaint and explore alternative dispute resolution options for a fair outcome.",
};

const page = () => {
  return (
    <div>
      <CustomerGrievances />
      <FAQ />
    </div>
  );
};

export default page;
