"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import {
  Award,
  TrendingUp,
  Users,
  Zap,
  ChevronUp,
  ChevronDown,
  BarChart2,
  DollarSign,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const achievements = [
  {
    icon: Award,
    title: "Top 10 Trading Mentor",
    description: "Recognized by Wall Street Journal",
  },
  {
    icon: TrendingUp,
    title: "500% Portfolio Growth",
    description: "Achieved for top clients in 2023",
  },
  {
    icon: Users,
    title: "10,000+ Students",
    description: "Trained and mentored globally",
  },
  {
    icon: Zap,
    title: "AI Trading Algorithm",
    description: "Developed proprietary system",
  },
];

const portfolioImages = [
  {
    src: "/hero/banner-img3.webp",
    alt: "Rakesh Bansal speaking at a trading seminar",
  },
  {
    src: "/hero/banner-img3.webp",
    alt: "Book signing event for 'Master the Market'",
  },
  {
    src: "/hero/banner-img3.webp",
    alt: "Receiving 'Best Trading Mentor' award",
  },
  { src: "/hero/banner-img3.webp", alt: "TV interview on market trends" },
];

function animateCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  const particles: {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocity: { x: number; y: number };
  }[] = [];

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
    });
  }

  function animate() {
    requestAnimationFrame(animate);
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
  }

  animate();
}

export default function PortfolioAchievementSlide() {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      animateCanvas(ctx, canvas);
    }

    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    });
  }, [controls]);

  return (
    <div className="w-full lg:h-[650px] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Complex Background Elements */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-64"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke="rgba(124, 58, 237, 0.2)"
            d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        </svg>
      </div>

      <div className="container px-4 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Portfolio Images Section */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={controls}>
            <h3 className="text-3xl font-bold text-white mb-6 text-center lg:text-left">
              Portfolio
            </h3>
            <div className="mb-8 grid grid-cols-1 items-center justify-center h-64 relative">
              <Slider {...sliderSettings}>
                {portfolioImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-64 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm">{image.alt}</p>
                    </div>
                  </div>
                ))}
              </Slider>
              {/* Decorative elements for portfolio */}
              <motion.div
                className="absolute -top-4 -left-4 w-12 h-12 border-2 border-purple-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-16 h-16 border-2 border-green-500 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={controls}>
            <h3 className="text-3xl font-bold text-white mb-6 text-center lg:text-left">
              Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 bg-gray-800 bg-opacity-50 rounded-lg p-4 backdrop-filter backdrop-blur-lg relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <achievement.icon className="w-8 h-8 text-purple-400 flex-shrink-0 relative z-10" />
                  <div className="relative z-10">
                    <h4 className="text-lg font-semibold text-white">
                      {achievement.title}
                    </h4>
                    <p className="text-gray-400">{achievement.description}</p>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating financial icons */}
      {[ChevronUp, ChevronDown, BarChart2, DollarSign].map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-purple-400 opacity-20"
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
    </div>
  );
}
