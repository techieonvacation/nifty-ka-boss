"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const books = [
  {
    title: "Profitable Short Term Trading Strategies",
    href: "https://www.amazon.in/Profitable-Short-Term-Trading-Strategies/dp/817094905X/ref=as_li_ss_tl?_encoding=UTF8&qid=1598112345&sr=8-3&linkCode=sl1&tag=mylink05d-21&linkId=615bc48b7c7f3fc566275dd0c8095fdf",
    cover: "/images/profitable-short-term.webp",
    rating: 4.8,
    reviews: 1250,
    price: "₹491",
  },
  {
    title: "Profitable Elliott Wave Trading Strategies",
    href: "https://www.amazon.in/Profitable-Elliott-Wave-Trading-Strategies/dp/938626837X/ref=as_li_ss_tl?dchild=1&keywords=rakesh+bansal&qid=1598112345&sr=8-1&linkCode=sl1&tag=mylink05d-21&linkId=18dd0da516336b7f178d635f32de5f78",
    cover: "/images/profitable-elliott.webp",
    rating: 4.9,
    reviews: 980,
    price: "₹491",
  },
  {
    title: "Profitable Trading with Dow Theory",
    href: "https://www.amazon.in/dp/B08GQV8L43/ref=as_li_ss_tl?_encoding=UTF8&qid=1598605294&sr=8-1&linkCode=sl1&tag=mylink05d-21&linkId=7d6c1920b81d0bd0e1c0613a8cdad63d",
    cover: "/images/profitable-trading-dow.webp",
    rating: 4.7,
    reviews: 1500,
    price: "₹448",
  },
];

export default function BookShowcase() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

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

  return (
    <section className="w-full min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-green-900">
      {/* Book-themed Background */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="book-pattern"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <path d="M0 0h100v100H0z" fill="none" />
              <path d="M30 20h40v60H30z" fill="rgba(139, 92, 246, 0.1)" />
              <path d="M20 30h60v40H20z" fill="rgba(16, 185, 129, 0.1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#book-pattern)" />
        </svg>
      </div>

      {/* Animated book pages */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white opacity-10"
            style={{
              width: Math.random() * 40 + 20 + "px",
              height: Math.random() * 60 + 30 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
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
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Learn from the&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Best-Selling&nbsp;
              </span>
              Author
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-300">
              Dive deep into the world of trading with Rakesh Bansal's acclaimed
              books.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl"
          >
            {books.map((book, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg p-4 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={150}
                  height={200}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-48 object-cover object-top rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-yellow-400">{book.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">
                    ({book.reviews} reviews)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-2xl">
                    {book.price}
                  </span>
                  <Link href={book.href} passHref>
                    <Button variant="gradient" size="sm">
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Book Elements */}
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
        <svg
          className="w-64 h-64 text-purple-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute top-20 right-20 z-0 opacity-15"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <svg
          className="w-48 h-48 text-green-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </motion.div>
    </section>
  );
}
