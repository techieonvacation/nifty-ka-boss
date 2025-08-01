"use client";

import { Shield, Lightbulb, TrendingUp, GraduationCap } from "lucide-react";
import Slider from "react-slick";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const reasons = [
  {
    icon: Shield,
    title: "Unwavering Integrity",
    description:
      "We uphold the highest standards of integrity in all our services. Our commitment to honesty and ethical practices ensures that you can trust us to provide reliable and accurate investment advice.",
    bgImage: "/images/dream-card1.png",
  },
  {
    icon: Lightbulb,
    title: "Absolute Transparency",
    description:
      "Transparency is at the core of our operations. We believe in clear and open communication, keeping you informed about every recommendation and decision. Our transparent processes build trust and confidence in our advisory services.",
    bgImage: "/images/dream-card2.png",
  },
  {
    icon: TrendingUp,
    title: "Strategic Discipline",
    description:
      "Successful investing requires discipline. We help you develop a disciplined investment strategy, focusing on long-term goals and minimizing impulsive decisions. Our disciplined approach maximizes your chances of achieving consistent returns.",
    bgImage: "/images/dream-card3.png",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description:
      "We are dedicated to your growth as an investor. Our educational resources and expert guidance help you understand the market better, enhancing your investment skills and knowledge. With us, you embark on a continuous learning journey towards financial success.",
    bgImage: "/images/dream-card2.png",
  },
];

export default function WhyJoinUs() {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <section className="text-black py-10 px-4 sm:px-6 lg:px-8 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/10 to-green-900/10">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="pricing-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.05)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.05)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)" />
            </linearGradient>
          </defs>
          <path fill="url(#pricing-grad)" d="M0 0 C 50 100, 80 100, 100 0 Z" />
        </svg>
      </div>
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="absolute"
            style={{ left: `${i * 25}%`, top: "20%" }}
            width="40"
            height="40"
            viewBox="0 0 40 40"
          >
            <path
              d="M20 2 L38 38 L2 38 Z"
              fill="none"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur={`${10 + i * 2}s`}
                repeatCount="indefinite"
              />
            </path>
          </svg>
        ))}
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[35%,60%] gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center md:text-left">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400 text-center">
                Why Join Us?
              </span>
            </h2>
            <p className="text-base lg:text-lg font-light text-center md:text-left">
              At Rakesh Bansal Ventures, we believe in a simple yet powerful
              approach to achieving success in the stock market. Here’s why you
              should join us:
            </p>
          </div>
          <div className="w-full relative">
            <Slider {...settings} ref={sliderRef}>
              {reasons.map((reason, index) => (
                <div key={index} className="px-2">
                  <div className="transform transition duration-500 hover:scale-105 h-[280px] lg:h-[320px] relative rounded-2xl overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${reason.bgImage})`,
                        backgroundPosition: "top",
                      }}
                    />
                    <div className="relative z-10 h-full flex flex-col rounded-2xl text-white p-4 mt-2">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-green-500 rounded-full mb-4 ">
                        <reason.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-base text-center px-0 font-semibold mb-3">
                        {reason.title}
                      </h3>
                      <p className="text-accent-foreground text-center text-xs font-light leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
            <div className="absolute -bottom-4 right-5 flex mt-4 border border-border  overflow-hidden">
              <div
                onClick={() => sliderRef.current?.slickPrev()}
                aria-label="Previous slide"
                className="bg-purple-600 cursor-pointer p-2"
              >
                <Image
                  src="/images/prev-arrow.webp"
                  alt="Previous"
                  width={22}
                  height={22}
                />
              </div>
              <div
                onClick={() => sliderRef.current?.slickNext()}
                aria-label="Next slide"
                className="bg-purple-600 border-l cursor-pointer p-2"
              >
                <Image
                  src="/images/next-arrow.webp"
                  alt="Next"
                  width={22}
                  height={22}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-center items-center">
              {reasons.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full mx-1 transition-all duration-300",
                    currentSlide === index
                      ? "bg-purple-600 scale-125"
                      : "bg-gray-400"
                  )}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
