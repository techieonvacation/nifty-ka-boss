"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { Download, Smartphone, Wifi, Cloud, Zap } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
};
const imageSlide = [
  "/images/download-app.webp",
  "/images/group-mbl-shape.webp",
  "/images/product-mbl-shape.webp",
  "/images/course-mbl-shape.webp",
];

export default function AppDownloadSlide() {
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [appDownloads, setAppDownloads] = useState(0);
  const [customerReviews, setCustomerReviews] = useState(0);
  const [workExperience, setWorkExperience] = useState(0);
  const [tradingCommunity, setTradingCommunity] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5, // Adjust the threshold as needed
  });

  useEffect(() => {
    let timeoutId: number;
    if (inView) {
      const animateCount = (
        target: number,
        duration: number,
        updateState: (value: number) => void
      ) => {
        const startValue = 0;
        const startTime = performance.now();

        const step = () => {
          const currentTime = performance.now();
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const currentValue = Math.floor(
            startValue + progress * (target - startValue)
          );

          updateState(currentValue);

          if (progress < 1) {
            timeoutId = requestAnimationFrame(step);
          }
        };

        timeoutId = requestAnimationFrame(step);
      };

      animateCount(30000, 3000, setAppDownloads); // Example: animate to 10,000 in 2 seconds
      animateCount(500, 3000, setCustomerReviews);
      animateCount(25, 3000, setWorkExperience);
      animateCount(40000, 3000, setTradingCommunity);
    }

    return () => clearTimeout(timeoutId);
  }, [inView]);

  const formatNumber = (number: number): string => {
    if (number >= 1000) {
      return number / 1000 + "K+";
    }
    return number.toString() + "+";
  };

  useEffect(() => {
    controls.start("visible");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Particle[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0 || particle.x > canvas.width)
          particle.velocity.x *= -1;
        if (particle.y < 0 || particle.y > canvas.height)
          particle.velocity.y *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 480, // For screens smaller than 480px
        settings: {
          slidesToShow: 1, // Show 1 slide
          slidesToScroll: 1,
        },
      },
    ],
  };
  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <section className="container px-4 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10" />

      {/* Complex SVG Background */}
      <svg className="absolute inset-0 z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="px-4 py-6 sm:py-10 lg:py-0 lg:h-[650px] flex flex-col lg:flex-row items-center justify-between relative z-10">
        <motion.div
          className="w-full lg:w-1/2 mb-8 lg:mb-0"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4">
            Elevate Your Trading
            <br />
            <span className="text-green-400">Anytime, Anywhere!</span>
          </h2>
          <p className="text-sm lg:text-base text-gray-300 mb-8">
            Stay ahead with real-time updates on the go! Our app delivers
            customized notifications for trades, along with access to exclusive
            webinars, courses, and a supportive community for expert guidance.
            All in one place! Download the app now and experience seamless
            trading updates, learning, and community interaction at your
            fingertips!
          </p>
          <motion.div variants={itemVariants} className="mt-12">
            <p className="text-sm font-medium text-purple-400 mb-4">
              Available on
            </p>
            <div className="flex items-center mt-5 space-x-5 sm:mt-0">
              {[
                "https://cdn.rareblocks.xyz/collection/celebration/images/hero/4/app-store-button.png",
                "https://cdn.rareblocks.xyz/collection/celebration/images/hero/4/play-store-button.png",
              ].map((src, index) => (
                <motion.a
                  key={index}
                  href="#"
                  title=""
                  className="block transition-all duration-200 hover:opacity-80 focus:opacity-80"
                  role="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    className="w-auto rounded h-14 sm:h-16"
                    src={src}
                    alt={
                      index === 0
                        ? "Download on App Store"
                        : "Get it on Google Play"
                    }
                    width={135}
                    height={40}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
          <div className="flex flex-wrap  gap-3 justify-between mt-8 max-w-xl">
            <div ref={ref} className="text-center">
              <h3 className="text-2xl font-semibold text-white">
                {formatNumber(appDownloads)}
              </h3>
              <p className="text-white text-sm mt-2">App Downloaded</p>
            </div>
            <div ref={ref} className="text-center">
              <h3 className="text-2xl font-semibold text-white">
                {formatNumber(customerReviews)}
              </h3>
              <p className="text-white text-sm mt-2">Customer Reviews</p>
            </div>
            <div ref={ref} className="text-center">
              <h3 className="text-2xl font-semibold text-white">
                {formatNumber(workExperience)}
              </h3>
              <p className="text-white text-sm mt-2">Work Experience</p>
            </div>
            <div ref={ref} className="text-center">
              <h3 className="text-2xl font-semibold text-white">
                {formatNumber(tradingCommunity)}
              </h3>
              <p className="text-white text-sm mt-2">Trading Community</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="w-full lg:w-1/2 relative flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full md:w-2/3 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-green-400 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            <Slider {...sliderSettings}>
              {imageSlide.map((src, index) => (
                <div
                  key={index}
                  className="relative transform rotate-6 hover:rotate-0 transition-transform duration-500 ease-in-out"
                >
                  <Image
                    src={src}
                    alt={`App Screen ${index + 1}`}
                    width={500}
                    height={500}
                    className="w-full  max-w-md mx-auto rounded-3xl shadow-2xl"
                  />
                </div>
              ))}
            </Slider>
            <div className="mt-4 flex justify-center items-center">
              {imageSlide.map((_, index) => (
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
        </motion.div>
      </div>

      {/* Floating icons */}
      {[Download, Smartphone, Wifi, Cloud, Zap].map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-purple-300 opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 40 + 20}px`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Icon />
        </motion.div>
      ))}
    </section>
  );
}
