"use client";
import { Check, Building, Users, Headphones } from "lucide-react";
import Button from "../ui/Button/SecButton";
import Image from "next/image";
export default function WhyMatters() {
  const handleBuyNowClick = () => {
    window.open(
      "https://com.rpy.club/pdp/bansalkabrahmastra",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const matters = [
    "Built by a SEBI-Registered Analyst with 25+ years of experience",
    "Practical, easy-to-follow video tutorial (No jargon!)",
    "Uses real-time algo-backed scanner for high-probability trades",
    "Compatible with TradingView & Chartink",
    "Includes 1-Month Premium Telegram Channel Access",
    "Get 'Stocks on Radar' daily (on market days)",
    "One-month handholding support from Dr. Bansal's team",
    // "Post-support access at just ₹500/month",
  ];

  const learns = [
    "How to read charts and identify trading opportunities",
    "How to use TradingView & Chartink to screen stocks",
    "How to implement Dr. Bansal’s personal scanner (based on real-time tested algos)",
    "How to find stocks before the move happens",
  ];

  return (
    <section className="py-10 bg-[#FFF3B3]">
      <div className="container">
        {/* Why Hearing Health Matters */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 flex flex-col sm:flex-row justify-center items-center gap-1">
              Why Bansal Ka{" "}
              <Image
                src="/images/bhrahmastra.png"
                alt="Modern hearing aid device"
                width={200}
                height={180}
                className="object-contain md:hidden"
                priority
              />
              <Image
                src="/images/bhrahmastra.png"
                alt="Modern hearing aid device"
                width={250}
                height={180}
                className="object-contain hidden md:block"
                priority
              />
              <span className="text-primary font-montserrat">Matters</span>
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-inter font-light">
              Trading is a journey that requires knowledge and strategy.
            </p>
          </div>

          <div className="bg-background rounded-3xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-primary text-white p-10 flex items-center">
                <div>
                  <ul className="space-y-4">
                    {matters.map((matter, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="bg-background rounded-full p-1 mr-3 mt-1">
                          <Check className="h-3 w-3 sm:w-4 sm:h-4 text-foreground" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base font-inter">
                          {matter}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button
                      title="Buy Now"
                      className="border text-sm lg:text-base px-6"
                    />
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-6 font-montserrat">
                  What You'll Learn?
                </h3>
                <ul className="space-y-4">
                  {learns.map((learn, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="bg-primary rounded-full p-1 mr-3 mt-1">
                        <Check className="h-3 w-3 sm:w-4 sm:h-4 text-primary-foreground" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-inter">
                        {learn}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* About Dr. Rakesh Bansal */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">
              About{" "}
              <span className="mt-1 text-primary"> Dr. Rakesh Bansal</span>
            </h2>
          </div>

          <div className="bg-background rounded-2xl overflow-hidden border border-border relative shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-primary/20 to-accent/20 blur-3xl rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-accent/20 to-primary/20 blur-3xl rounded-full -ml-32 -mb-32"></div>

            <div className="relative p-8 md:p-10 bg-primary">
              <div className="text-center">
                <p className="text-sm sm:text-base lg:text-xl text-white mb-4 font-montserrat">
                  Dr. Rakesh Bansal, a post-graduate in International Business
                  Management and holder of a doctorate in market analysis, has
                  been a prominent figure in stock market analysis since 1998.
                  With over two decades of extensive experience, he specializes
                  in technical analysis, wealth management, and investment
                  analysis
                </p>
                <p className="text-sm sm:text-base lg:text-xl  text-white mb-4 font-montserrat">
                  As a SEBI registered research analyst (INH100008984), Dr.
                  Bansal offers high-quality market insights and educational
                  resources to traders and investors across the country, helping
                  millions work towards their financial independence.
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
                  Highlighted Dr. Rakesh Bansal's SEBI registration and his role
                  in providing personalized insights.
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
      </div>
    </section>
  );
}
