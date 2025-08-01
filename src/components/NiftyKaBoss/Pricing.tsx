"use client";

import { Check, AlertTriangle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";

export default function NiftyKaBossPricing() {
  return (
    <section className="py-20 px-4 bg-white min-h-screen">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-urbanist">
            Your Plan, Your Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed font-inter">
            Experience the power of Nifty Ka Boss with pricing plans tailored to
            your trading goals. Our Monthly and Yearly plans offer unbeatable
            value, giving you access to a system trusted by thousands. Choose
            the plan that fits your needs and start trading with confidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-xl">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Monthly Plan
                </h3>
                <Badge variant="outline">Starter</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 line-through text-lg font-medium">
                    ₹399/month
                  </span>
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    Limited Offer
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">₹149</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  Features Included:
                </h4>
                <div className="space-y-4">
                  {[
                    "Crystal-clear Buy, Sell, and Neutral Signals",
                    "Precise Stop-Loss and New Base Alerts",
                    "Historical Charts with Open, High, Low, and Close Data",
                    "System-Defined Support and Resistance Levels",
                    "Dr. Rakesh Bansal's Exclusive Indicators",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-orange-200 bg-orange-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-orange-800 font-medium mb-1">
                      Important Note
                    </p>
                    <p className="text-orange-700 text-sm">
                      Telegram channel access for real-time alerts not included
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                <p className="text-blue-900">
                  <strong>Perfect For:</strong> Traders seeking an affordable
                  way to access Nifty Ka Boss's powerful tools and kickstart
                  their journey.
                </p>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200">
                Choose Monthly Plan
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="border-2 border-yellow-300 hover:border-yellow-400 transition-all duration-300 rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-xl relative">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-center py-3 font-bold">
              <Crown className="w-5 h-5 inline mr-2" />
              RECOMMENDED PLAN
            </div>
            <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 pt-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Yearly Plan
                </h3>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Best Value
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 line-through text-lg font-medium">
                    ₹1499/year
                  </span>
                  <Badge variant="premium">Limited Offer</Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">₹999</span>
                  <span className="text-gray-600 text-lg">/year</span>
                </div>
                <div className="text-green-600 font-semibold">
                  Save ₹789 compared to monthly!
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  Everything in Monthly, Plus:
                </h4>
                <div className="space-y-4">
                  {[
                    "Crystal-clear Buy, Sell, and Neutral Signals",
                    "Precise Stop-Loss and New Base Alerts",
                    "Historical Charts with Open, High, Low, and Close Data",
                    "System-Defined Support and Resistance Levels",
                    "Dr. Rakesh Bansal's Exclusive Indicators",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-3 border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                    <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mt-1 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-yellow-900 font-semibold">
                        Exclusive Premium Feature:
                      </span>
                      <p className="text-yellow-800 mt-1">
                        Premium Telegram channel with real-time buy, sell,
                        neutral, and new base alerts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-orange-200 bg-orange-50 rounded-xl p-4">
                <p className="text-orange-900">
                  <strong>Perfect For:</strong> Serious traders who want maximum
                  value, real-time insights, and a competitive edge in the
                  market.
                </p>
              </div>

              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                Choose Yearly Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
