"use client";
import React from "react";
import Image from "next/image";
import {
  Building,
  Users,
  Waves,
  StarIcon,
  ShieldCheckIcon,
  BadgeCheck,
  Stars,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function BhrahmastraSec() {
  const router = useRouter();
  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100vh-4rem)] lg:py-10 bg-background">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute h-full w-full bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col h-full">
        {/* Mobile Header Section */}
        <div className="lg:hidden text-center mb-8 pt-4">
          <Badge
            variant="outline"
            rounded="subtle"
            icon={<BadgeCheck />}
            className="shadow-sm rounded-full mb-2"
          >
            By Dr. Rakesh Bansal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3 font-montserrat flex flex-col items-center  justify-center">
            <span className="block font-montserrat">Bansal Ka</span>
            <Image
              src="/images/bhrahmastra.png"
              alt="Modern hearing aid device"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </h1>
          <p className="text-xl font-medium text-primary font-inter mb-2">
            The Ultimate Stock Scanner & Charting Blueprint
          </p>
          <p className="text-sm text-foreground/80 max-w-md mx-auto font-inter font-light">
            Bansal Ka Brahmastra is not just another scanner – it’s your entry
            into the mind of a market expert, backed by{" "}
            <strong>25+ years</strong> of experience. Designed by Dr. Rakesh
            Bansal, this powerful course + tool combo teaches you how to read
            charts, scan stocks like a pro, and get ready-to-act stock ideas
            daily
          </p>
        </div>

        <div className="grid gap-8 md:gap-12 lg:grid-cols-12 items-center">
          {/* Left column - Content */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden lg:block">
              <Badge
                variant="outline"
                rounded="subtle"
                icon={<BadgeCheck />}
                className="shadow-sm rounded-full mb-2"
              >
                By Dr. Rakesh Bansal
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 font-montserrat flex items-center gap-2">
                <span className="inline-block font-montserrat">Bansal Ka</span>{" "}
                <Image
                  src="/images/bhrahmastra.png"
                  alt="Modern hearing aid device"
                  width={250}
                  height={250}
                  className="object-contain"
                  priority
                />
              </h1>
              <p className="text-xl font-medium text-primary font-inter">
                The Ultimate Stock Scanner & Charting Blueprint
              </p>
              <p className="mt-3 text-sm lg:text-base text-foreground/80 font-inter font-light max-w-3xl mx-auto">
                Bansal Ka Brahmastra is not just another scanner – it’s your
                entry into the mind of a market expert, backed by{" "}
                <strong>25+ years</strong> of experience. Designed by Dr. Rakesh
                Bansal, this powerful course + tool combo teaches you how to
                read charts, scan stocks like a pro, and get ready-to-act stock
                ideas daily
              </p>
            </div>

            {/* Stats Section (Showing on both mobile and desktop) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 mt-6 mb-8">
              <div className="flex flex-col items-center text-center p-4 bg-white/80 rounded-xl shadow-lg backdrop-blur border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
                <Building className="w-8 h-8 mb-2 text-accent" />
                <p className="text-2xl font-bold text-slate-900">25+</p>
                <p className="text-sm text-slate-600">Years Of Experience</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/80 rounded-xl shadow-lg backdrop-blur border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
                <Users className="w-8 h-8 mb-2 text-accent" />
                <p className="text-2xl font-bold text-slate-900">40K+</p>
                <p className="text-sm text-slate-600">Trading Community</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/80 rounded-xl shadow-lg backdrop-blur border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
                <Stars className="w-8 h-8 mb-2 text-accent" />
                <p className="text-2xl font-bold text-slate-900">500+</p>
                <p className="text-sm text-slate-600"> Customer Reviews</p>
              </div>
              <div className="flex flex-col items-center text-center  p-4 bg-white/80 rounded-xl shadow-lg backdrop-blur border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
                <Download className="w-8 h-8 mb-2 text-accent" />
                <p className="text-2xl font-bold text-slate-900">50K+</p>
                <p className="text-sm text-slate-600">App Download</p>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur p-4 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Waves className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold font-inter text-primary">
                    Never Before Revealed
                  </h3>
                  <p className="text-xs text-foreground/80">
                    Dr. Bansal’s exact scanner & stock-picking technique
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur p-4 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold font-inter text-primary">
                    Proven & Trusted Tool
                  </h3>
                  <p className="text-xs text-foreground/80">
                    Uses his personal, battle-tested indicator & scanner
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur p-4 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold font-inter text-primary">
                    Chart Mastery
                  </h3>
                  <p className="text-xs text-foreground/80">
                    Learn to read charts for smarter, faster trades
                  </p>
                </div>
              </div>
            </div>

            {/* Main image - visible on mobile, but replaced by 3D showcase on desktop */}
            <div className="relative lg:hidden overflow-hidden rounded-3xl shadow-2xl mb-8">
              <div className="aspect-square relative">
                <Image
                  src="/hero/brahmastra-hero.webp"
                  alt="Modern hearing aid device"
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
                {/* Floating badge */}
                <div className="absolute left-0 w-fit mx-auto bottom-2 font-inter right-0 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-orange-600 shadow-lg">
                  Your Trading Mentor
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="md:hidden flex items-center justify-center lg:justify-start gap-3 mt-4">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => {
                  router.push("/courses/bansal-ka-brahmastra");
                }}
              >
                View More
              </Button>
            </div>
          </div>

          {/* Right column - Desktop 3D showcase and Form */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            {/* 3D showcase - Desktop only */}
            <div className="hidden lg:block relative">
              <div className="absolute -right-16 -top-10 w-72 h-72 bg-orange-300/40 rounded-full blur-3xl z-0"></div>
              <div className="relative z-10 mb-12 transform-gpu rotate-6 hover:rotate-0 transition-all duration-700">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border-8 border-white aspect-[4/3]">
                  <Image
                    src="/hero/brahmastra-hero.webp"
                    alt="Modern hearing aid device"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-orange-500/10"></div>
                </div>
                {/* Floating badges */}
                <div className="absolute -right-6 top-6 bg-white shadow-xl px-4 py-2 rounded-lg transform rotate-12">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-gray-700">
                      5.0 (2.3k reviews)
                    </span>
                  </div>
                </div>
                <div className="absolute left-[30%] -bottom-20 px-6 py-3 shadow-lg transform -rotate-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={() => {
                      router.push("/courses/bansal-ka-brahmastra");
                    }}
                  >
                    View More
                  </Button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Add a subtle wave pattern at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#f97316"
            fillOpacity="0.05"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
          <path
            fill="#f97316"
            fillOpacity="0.1"
            d="M0,96L80,90.7C160,85,320,75,480,80C640,85,800,107,960,112C1120,117,1280,107,1360,101.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
