"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, IndianRupee, BarChart2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

export default function HeroSection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    // Add threshold to optimize when animation triggers
    amount: 0.1, // Using amount instead of threshold
    once: true, // Only animate once
  });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.3,
          staggerChildren: 0.2,
        },
      },
    }),
    []
  );

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Optimize particle generation
  const [particles, setParticles] = React.useState<
    Array<{
      id: number;
      width: number;
      height: number;
      left: number;
      top: number;
      yMove: number;
      xMove: number;
      scale: number;
      duration: number;
    }>
  >([]);

  React.useEffect(() => {
    setParticles(
      [...Array(20)].map((_, i) => ({
        id: i,
        width: Math.random() * 5 + 1,
        height: Math.random() * 5 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        yMove: Math.random() * 100 - 50,
        xMove: Math.random() * 100 - 50,
        scale: Math.random() + 0.5,
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  return (
    <section className="w-full min-h-screen flex lg:items-center relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-green-900">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.1)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
            </linearGradient>
            <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.05)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.05)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.05)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#grad1)"
            fillOpacity="1"
            d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,85.3C672,75,768,85,864,101.3C960,117,1056,139,1152,133.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="url(#grad2)"
            fillOpacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,181.3C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: particle.width + "px",
              height: particle.height + "px",
              left: particle.left + "%",
              top: particle.top + "%",
            }}
            animate={{
              y: [0, particle.yMove],
              x: [0, particle.xMove],
              scale: [1, particle.scale, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-start w-full h-full"
        >
          <motion.div variants={itemVariants} className="mt-6 lg:mt-20">
            <h1 className="text-2xl font-bold text-white sm:text-4xl xl:text-5xl leading-tight xl:leading-[1.2]">
              Let&apos;s
              <br className="hidden xl:block" /> Dream Big
              <br />
              <TypeAnimation
                sequence={["Together!", 1000, "With Dr. Rakesh Bansal", 1000]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-2xl font-bold sm:text-4xl xl:text-5xl leading-tight 
                xl:leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400"
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
              />
              &nbsp;
            </h1>
            <p className="mt-5 text-xs sm:text-sm md:text-base text-gray-300 font-light">
              Dr. Rakesh Bansal&apos;s aim is to revolutionize stock market
              research services by bringing technology assisted analysis
              accessible to retail investors. With your support, it is our
              endeavour to build India&apos;s largest Stock research ecosystem.
            </p>
            <motion.div
              className="mt-8 flex items-center space-x-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/#services-sec">
                <Button
                  variant="gradient"
                  size="md"
                  rightIcon={<ChevronRight className="size-5 ml-2" />}
                >
                  Start Your Journey
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 sm:mt-10 flex items-center space-x-8"
            >
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-purple-400 mr-2" />
                <span className="text-gray-300 text-xs md:text-sm">
                  Expert Analysis
                </span>
              </div>
              <div className="flex items-center">
                <IndianRupee className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-gray-300 text-xs md:text-sm">
                  Market Strategies
                </span>
              </div>
              <div className="flex items-center">
                <BarChart2 className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-gray-300 text-xs md:text-sm">
                  Market Insights
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden"
          >
            <div className="relative rounded-lg overflow-hidden h-full max-w-[500px] lg:max-h-[650px] lg:float-right">
              <Image
                className="w-full h-full lg:h-auto object-cover"
                src="/hero/banner-first-slide.webp"
                alt="Rakesh Bansal"
                width={500}
                height={500}
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute bottom-20 left-20 z-0 opacity-15"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Image
          src="/images/candle-stick.svg"
          alt="Candlestick Chart"
          width={800}
          height={800}
        />
      </motion.div>
    </section>
  );
}
