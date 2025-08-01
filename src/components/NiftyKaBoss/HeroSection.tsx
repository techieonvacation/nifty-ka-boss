import React from "react";

/**
 * Hero section for Nifty Ka Boss
 * Features a 15-second looping video background, beautiful overlay, and mobile responsiveness.
 * Video file: /images/jhakas.mp4 (place your 15s video here if not already)
 */
const VIDEO_SRC = "https://www.pexels.com/video/dummy-on-a-concrete-tower-in-the-middle-of-a-lake-15214962/";

export default function NiftyKaBossHeroSection() {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden md:h-[80vh]">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://www.pexels.com/video/dummy-on-a-concrete-tower-in-the-middle-of-a-lake-15214962/"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" aria-hidden="true" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 md:px-8 w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 leading-tight">
          Trade Like A Boss
        </h1>
        <p className="text-base md:text-xl text-gray-100 max-w-2xl mx-auto mb-6 md:mb-8 font-medium drop-shadow">
          Unleash the power of AI-driven trading signals and join thousands of successful traders who trust <span className="font-bold text-yellow-400">Nifty Ka Boss</span> for their market success.
        </p>
        {/* Optional: Add a CTA button here if needed */}
      </div>
    </section>
  );
}