"use client";
import React from "react";
import Link from "next/link";
import { FC } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { BadgeCheck } from "lucide-react";
import { Badge } from "../ui/badge";

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

// Enhanced Stat Card Component with icon and animation
const StatCard: FC<StatCardProps> = ({ value, label, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group relative rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 hover:shadow-xl"
  >
    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 blur transition duration-1000 group-hover:opacity-30" />
    <div className="relative flex items-center gap-4">
      <div className="rounded-full bg-amber-500/20 p-3 text-amber-400">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-300">{label}</div>
      </div>
    </div>
  </motion.div>
);

// Main Hero Section Component
const CourseHero: FC = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-500 opacity-20 blur-[100px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-32 w-32 rounded-full bg-amber-500/30 blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container relative z-10 mx-auto px-4 py-10 sm:py-20 sm:pb-32 md:pb-40"
      >
        <div className="mx-auto max-w-5xl text-center">
          <Badge
            variant="outline"
            rounded="subtle"
            icon={<BadgeCheck />}
            className="shadow-sm rounded-full mb-2 text-white"
          >
            By Dr. Rakesh Bansal
          </Badge>

          <motion.h1
            variants={itemVariants}
            className="mb-4 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight text-transparent "
          >
            Master the Markets with{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-montserrat">
              Strategic Trading
            </span>{" "}
            Courses
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-8 max-w-3xl text-base text-gray-300 font-light sm:text-xl md:text-2xl [text-wrap:balance] font-inter"
          >
            Transform your trading journey with expert-led courses designed to
            build your skills, confidence, and profitability in any market
            condition.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              href="#courses"
              className="group relative inline-flex items-center overflow-hidden rounded-lg bg-accent px-8 py-3 text-lg font-medium text-white transition-all hover:bg-accent/90"
            >
              <span className="absolute -end-full transition-all group-hover:end-4">
                <FaArrowRight />
              </span>
              <span className="transition-all group-hover:me-4">
                Explore Courses
              </span>
            </Link>

            <Link
              href="#testimonials"
              className="inline-flex items-center rounded-lg border border-border bg-primary/10 px-8 py-3 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-lg"
            >
              Student Success Stories
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              value="15K+"
              label="Successful Students"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 2c-4 0-12 2-12 6v2h24v-2c0-4-8-6-12-6z" />
                </svg>
              }
              delay={0.2}
            />
            <StatCard
              value="92%"
              label="Success Rate"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                </svg>
              }
              delay={0.4}
            />
            <StatCard
              value="6+"
              label="Years Experience"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              }
              delay={0.6}
            />
            <StatCard
              value="4.9"
              label="Average Rating"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              }
              delay={0.8}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CourseHero;
