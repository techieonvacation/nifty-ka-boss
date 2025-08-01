"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Clock, Star, Users } from "lucide-react";
import { Course } from "@/components/Courses/coursesData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseShowcaseProps {
  courses: Course[];
}

export default function CourseShowcase({ courses }: CourseShowcaseProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCourses, setVisibleCourses] = useState<Course[]>(courses);

  // Get unique tags for filtering
  const uniqueTags = [
    "all",
    ...new Set(
      courses.flatMap((course) => course.tags.map((tag) => tag.toLowerCase()))
    ),
  ];

  // Filter courses based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setVisibleCourses(courses);
    } else if (activeTab === "featured") {
      setVisibleCourses(courses.filter((course) => course.featured));
    } else {
      setVisibleCourses(
        courses.filter((course) =>
          course.tags.some((tag) => tag.toLowerCase() === activeTab)
        )
      );
    }
  }, [activeTab, courses]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-12">
        <Tabs
          defaultValue="all"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center overflow-x-auto pb-2">
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                All Courses
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                Featured
              </TabsTrigger>
              {uniqueTags
                .filter((tag) => !["all", "featured"].includes(tag))
                .map((tag) => (
                  <TabsTrigger
                    key={tag}
                    value={tag}
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </TabsTrigger>
                ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-gray-800"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              {course.featured && (
                <Badge className="absolute right-4 top-4 bg-amber-500 px-3 py-1 text-white">
                  <Award className="mr-1 h-3.5 w-3.5" />
                  Featured
                </Badge>
              )}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-xs opacity-80">
                  ({course.students}+ students)
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-2 flex flex-wrap gap-2">
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
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                {course.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-300">
                {course.description}
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-amber-500" />
                  <span>{course.students}+ enrolled</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{course.price.toLocaleString()}
                  </span>
                  {course.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <Link href={`/courses/${course.slug}`}>
                  <Button className="group bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Courses Button */}
      {activeTab !== "all" && (
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white"
            onClick={() => setActiveTab("all")}
          >
            View All Courses
          </Button>
        </div>
      )}
    </div>
  );
}
