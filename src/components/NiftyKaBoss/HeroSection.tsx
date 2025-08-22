import React from "react";
import { Play, TrendingUp, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Enhanced Hero section for Nifty Ka Boss
 * Features a 15-second looping video background, beautiful overlay, and mobile responsiveness.
 * Video file: /images/jhakas.mp4 (place your 15s video here if not already)
 */
const VIDEO_SRC = "/images/jhakas.mp4";

export default function NiftyKaBossHeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/jhakas.mp4"
      />

      {/* Enhanced Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-50"></div>
        <div className="absolute bottom-60 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        {/* Top Badge */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2 text-sm font-medium text-yellow-100">
            <Award className="w-4 h-4 text-yellow-400" />
            87% Accuracy Rate • 10 Years Backtested
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl mb-6 leading-tight font-urbanist">
          Trade Like A{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            Boss
          </span>
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 w-full max-w-3xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-green-400 mr-2" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                92%
              </span>
            </div>
            <p className="text-sm text-gray-300 font-medium">2025 Accuracy</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                10+
              </span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Years Tested</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                1000s
              </span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Happy Traders</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Start Trading Now
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        {/* Trust Indicator */}
        <div className="mt-8 sm:mt-12">
          <p className="text-sm text-gray-400 mb-4">
            Trusted by SEBI Registered Research Analyst
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Dr. Rakesh Bansal</span>
            <span>•</span>
            <span>INH100008984</span>
            <span>•</span>
            <span>25+ Years Experience</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
