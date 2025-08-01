"use client";
import { Building, Headphones, Users } from "lucide-react";
import React from "react";
import Button from "../ui/Button/SecButton";

export default function AboutRakeshBansal() {
  const handleBuyNowClick = () => {
    window.open(
      "https://com.rpy.club/pdp/bansalkaabrahmastra",
      "_blank",
      "noopener,noreferrer"
    );  
  };

  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">
          About <span className="mt-1 text-primary"> Dr. Rakesh Bansal</span>
        </h2>
      </div>

      <div className="bg-background rounded-2xl overflow-hidden border border-border relative shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-primary/20 to-accent/20 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-accent/20 to-primary/20 blur-3xl rounded-full -ml-32 -mb-32"></div>

        <div className="relative p-8 md:p-10 bg-primary">
          <div className="text-center">
            <p className="text-sm sm:text-base lg:text-xl text-white mb-4 font-montserrat">
              Dr. Rakesh Bansal, a post-graduate in International Business
              Management and holder of a doctorate in market analysis, has been
              a prominent figure in stock market analysis since 1998. With over
              two decades of extensive experience, he specializes in technical
              analysis, wealth management, and investment analysis
            </p>
            <p className="text-sm sm:text-base lg:text-xl  text-white mb-4 font-montserrat">
              As a SEBI registered research analyst (INH100008984), Dr. Bansal
              offers high-quality market insights and educational resources to
              traders and investors across the country, helping millions work
              towards their financial independence.
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3">
          <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4 font-montserrat">
              State-of-the-Art Trading Facilities
            </h3>
            <p className="text-foreground/80 font-inter">
              Kept the focus on technology and resources for traders.
            </p>
          </div>

          <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4 font-montserrat">
              Expert Guidance
            </h3>
            <p className="text-foreground/80 font-inter">
              Highlighted Dr. Rakesh Bansal's SEBI registration and his role in
              providing personalized insights.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4 font-montserrat">
              Comprehensive Trading Tools
            </h3>
            <p className="text-foreground/80 font-inter">
              Emphasized the availability of powerful tools for traders.
            </p>
          </div>
        </div>

        <div className="relative p-8 md:p-10 text-center flex justify-center">
          <Button
            title="Buy Now"
            onClick={handleBuyNowClick}
            className="text-sm lg:text-base whitespace-nowrap px-6 bg-secondary/80"
          />
        </div>
      </div>
    </div>
  );
};
