"use client";

import {
  Check,
  AlertTriangle,
  Crown,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NiftyKaBossPricing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePlanSelection = () => {
    if (status === "loading") return; // Don't do anything while loading
    
    if (session?.user) {
      // User is authenticated, redirect to external link
      window.open("https://rakeshbansal.rpy.club/jcp/3vKH8YQCjS", "_blank");
    } else {
      // User is not authenticated, redirect to login page
      router.push("/auth/login");
    }
  };

  return (
    <section className="relative py-10 min-h-screen overflow-hidden">
      {/* Beautiful Background with Graphics */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large decorative circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-100/10 to-blue-100/10 rounded-full blur-3xl animate-slow-spin"></div>

        {/* Floating icons */}
        <div className="absolute top-20 left-20 animate-float">
          <TrendingUp className="w-8 h-8 text-blue-300/40" />
        </div>
        <div className="absolute top-40 right-32 animate-float-delayed">
          <Star className="w-6 h-6 text-yellow-300/40" />
        </div>
        <div className="absolute bottom-32 left-16 animate-float">
          <Sparkles className="w-7 h-7 text-purple-300/40" />
        </div>
        <div className="absolute bottom-40 right-20 animate-float-delayed">
          <Crown className="w-8 h-8 text-orange-300/40" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30px 30px, rgba(156, 146, 172, 0.05) 2px, transparent 2px)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>
      </div>
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 rounded-full px-4 py-2 text-sm font-medium text-blue-600 mb-6">
            <Crown className="w-4 h-4 text-yellow-500" />
            Choose Your Trading Success Plan
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 font-urbanist">
            Your Plan, Your Success
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-inter">
            Experience the power of Nifty Ka Boss with pricing plans tailored to
            your trading goals. Our Monthly and Yearly plans offer unbeatable
            value, giving you access to a system trusted by thousands. Choose
            the plan that fits your needs and start trading with confidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Monthly Plan */}
          <Card className="group border-2 border-gray-200 hover:border-blue-400 transition-all duration-500 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:-translate-y-2 relative">
            {/* Card Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardHeader className="relative border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-blue-50/30 p-8">
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
            <CardContent className="relative p-8 space-y-8">
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

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
                onClick={handlePlanSelection}
              >
                Choose Monthly Plan
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="group border-2 border-yellow-300 hover:border-yellow-500 transition-all duration-500 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 relative">
            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-orange-100/20 to-red-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black text-center py-3 font-bold z-10">
              <Crown className="w-5 h-5 inline mr-2 animate-bounce" />
              RECOMMENDED PLAN
              <Sparkles className="w-4 h-4 inline ml-2 animate-pulse" />
            </div>
            <CardHeader className="relative border-b border-gray-100 bg-gradient-to-br from-yellow-50/80 to-orange-50/60 p-8 pt-16">
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
            <CardContent className="relative p-8 space-y-8">
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

              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                onClick={handlePlanSelection}
              >
                Choose Yearly Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
