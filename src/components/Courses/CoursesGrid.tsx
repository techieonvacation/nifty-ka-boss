"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Clock, Star, Users } from "lucide-react";

import type { Course } from "./coursesData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseGridProps {
  courses: Course[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {courses.map((course) => (
        <motion.div
          variants={item}
          key={course.id}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/50 dark:shadow-gray-900/30",
            hoveredId === course.id ? "scale-[1.02]" : ""
          )}
          onMouseEnter={() => setHoveredId(course.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative h-[240px] overflow-hidden sm:h-[260px] lg:h-[280px]">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                hoveredId === course.id ? "scale-110" : ""
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {course.featured && (
              <Badge className="absolute right-4 top-4 bg-amber-500 px-3 py-1 text-white">
                <Award className="mr-1 h-3.5 w-3.5" />
                Featured
              </Badge>
            )}
          </div>
          <div className="p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {course.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">
              {course.title}
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 lg:text-base">
              {course.description}
            </p>
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students.toLocaleString()}+ students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-amber-500">
                  {course.rating}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
                  ₹{course.price.toLocaleString()}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                    ₹{course.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Link href={`/courses/${course.slug}`} className="block">
                <Button className="group w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 sm:w-auto">
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
