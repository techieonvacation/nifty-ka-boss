"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const features = [
    "1-Hour Masterclass",
    "Proprietary Stock Scanner",
    "Telegram Premium Channel",
    "Optional Renewal ",
    "Priority Support",
    "Early Access Benefits",
  ];

  const plans = [
    {
      name: "Early Birds",
      discount: "20% Discount",
      originalPrice: "₹5900",
      discountedPrice: "₹4720",
      discountBadge: "-20%",
      badge: null,
      buttonColor: "bg-amber-500 hover:bg-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      link: "https://com.rpy.club/pdp/bansalkabrahmastra",
      features: [true, true, true, true, true, true],
      checkColor: "text-amber-500",
    },
    {
      name: "Kurukshetra Buyers",
      discount: " 66% Discount",
      originalPrice: "₹5900",
      discountedPrice: "₹2006",
      discountBadge: "-66%",
      badge: "BEST VALUE",
      badgeColor: "bg-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      link: "https://forms.gle/Mst4oYmuSaj34xA98",
      features: [true, true, true, true, true, true],
      checkColor: "text-green-500",
    },
    {
      name: "Chakravyuh Buyers",
      discount: "35% Discount",
      originalPrice: "₹5900",
      discountedPrice: "₹3835",
      discountBadge: "-35%",
      badge: null,
      buttonColor: "bg-green-500 hover:bg-green-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      link: "https://forms.gle/Mst4oYmuSaj34xA98",
      features: [true, true, true, true, true, true],
      checkColor: "text-blue-500",
    },
  ];

  const toggleFeature = (idx: number) => {
    if (expandedFeature === idx) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(idx);
    }
  };

  return (
    <section id="pricing" className="bg-secondary/5 py-6 sm:py-10">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="outline" className="rounded-full mb-2">
              Pricing & Offers
            </Badge>
            <h2 className="text-2xl font-bold tracking-tighter font-montserrat sm:text-3xl md:text-4xl lg:text-5xl">
              Exclusive Limited Time Offers
            </h2>
          </div>
        </div>

        {/* Desktop View */}
        <div className="mx-auto max-w-6xl py-8 pb-0 hidden sm:block">
          <div className="grid grid-cols-4 gap-0 rounded-xl border shadow-lg">
            {/* Features column */}
            <div className="bg-muted/30 p-6">
              <div className="h-20 flex items-end justify-start pb-4 mb-24">
                <h3 className="text-lg md:text-xl font-semibold font-montserrat">
                  Features
                </h3>
              </div>
              <ul className="space-y-6 pt-6 text-sm">
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="h-12 flex text-base items-center font-medium font-montserrat"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Plans */}
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 ${plan.bgColor} border-l border-l-muted/30`}
              >
                {plan.badge && (
                  <div
                    className={`absolute top-0 left-0 right-0 ${plan.badgeColor} text-white text-center py-1 text-xs font-medium`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="h-20 flex flex-col justify-end">
                  <h3 className="text-lg sm:text-xl font-bold font-montserrat">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-space-grotesk">
                    {plan.discount}
                  </p>
                </div>
                <div className="pt-4">
                  <div className="flex flex-col items-baseline gap-1 mb-2 flex-wrap">
                    <div className="flex items-center">
                      <span className="inline-block text-lg sm:text-xl font-bold font-inter line-through text-muted-foreground">
                        {plan.originalPrice}
                      </span>{" "}
                      <span className="inline-block text-2xl sm:text-3xl font-bold font-inter ml-2">
                        {plan.discountedPrice}
                      </span>
                    </div>
                  </div>
                  {plan.link ? (
                    <Link target="_blank" href={plan.link}>
                      <Button
                        size="sm"
                        className={`w-full ${plan.buttonColor} py-2 text-sm sm:text-base`}
                      >
                        {plan.name === "Early Birds" ? "Buy Now" : "Register Now"}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      className={`w-full ${plan.buttonColor} py-2 text-sm sm:text-base`}
                    >
                      {plan.name === "Early Birds" ? "Buy Now" : "Register Now"}
                    </Button>
                  )}
                </div>
                <ul className="space-y-6 pt-6 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="h-12 flex items-center justify-center font-medium"
                    >
                      {typeof feature === "boolean" ? (
                        feature ? (
                          <CheckCircle
                            className={`h-6 w-6 ${plan.checkColor}`}
                          />
                        ) : (
                          <X className="h-6 w-6 text-red-500" />
                        )
                      ) : (
                        <span>{feature}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="mx-auto max-w-6xl py-8 pb-0 sm:hidden">
          <div className="space-y-6">
            {plans.map((plan, planIndex) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border shadow-md overflow-hidden ${plan.bgColor}`}
              >
                {plan.badge && (
                  <div
                    className={`absolute top-0 left-0 right-0 ${plan.badgeColor} text-white text-center py-1 text-xs font-medium`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className={`p-4 ${plan.badge ? "pt-8" : "pt-4"}`}>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold font-montserrat">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-space-grotesk">
                      {plan.discount}
                    </p>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-1 mb-3 flex-wrap">
                      <div className="flex items-center">
                        <span className="inline-block text-lg font-bold font-inter line-through text-muted-foreground">
                          {plan.originalPrice}
                        </span>{" "}
                        <span className="inline-block text-2xl font-bold font-inter ml-2">
                          {plan.discountedPrice}
                        </span>
                      </div>
                      {/* <Badge
                        variant="outline"
                        className="rounded-full shadow-sm ml-2"
                      >
                        {plan.discountBadge}
                      </Badge> */}
                    </div>
                    {plan.link ? (
                      <Link target="_blank" href={plan.link}>
                        <Button
                          className={`w-full ${plan.buttonColor} py-2 text-base`}
                        >
                          Register Now
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className={`w-full ${plan.buttonColor} py-2 text-base`}
                      >
                        Buy Now
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t">
                  {features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="border-b last:border-b-0">
                      <button
                        onClick={() =>
                          toggleFeature(planIndex * 100 + featureIdx)
                        }
                        className="w-full px-4 py-3 flex items-center justify-between"
                      >
                        <span className="font-medium text-sm">{feature}</span>
                        <div className="flex items-center">
                          {typeof plan.features[featureIdx] === "boolean" ? (
                            plan.features[featureIdx] ? (
                              <CheckCircle
                                className={`h-5 w-5 ${plan.checkColor}`}
                              />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )
                          ) : (
                            <span>{plan.features[featureIdx]}</span>
                          )}
                          {expandedFeature === planIndex * 100 + featureIdx ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </div>
                      </button>
                      {expandedFeature === planIndex * 100 + featureIdx && (
                        <div className="px-4 py-2 bg-background/50 text-sm">
                          {plan.features[featureIdx] ? (
                            <p>This plan includes {feature.toLowerCase()}.</p>
                          ) : (
                            <p>
                              This plan does not include {feature.toLowerCase()}
                              .
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground flex flex-col md:flex-row gap-x-2 justify-center">
          <strong className="text-sm">Note:</strong>
          <p className="text-sm p-0 m-0">
            New to the stock market? First, buy Kurukshetra - Win the Battle for
            better understanding and results.
          </p>
        </div>
      </div>
    </section>
  );
}
