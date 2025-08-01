import RenkoReport from "@/components/ui/RenkoReport";
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
      <RenkoReport />
    </div>
  );
};

export default page;
