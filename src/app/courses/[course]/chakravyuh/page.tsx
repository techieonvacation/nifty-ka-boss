import { Metadata } from "next";
import CourseChakravyuh from "@/components/Courses/ChakravyuhKaTod";
import React from "react";

export const metadata: Metadata = {
  title: "Chakravyuh Ka Tod – Master the Power of Renko Charts",
  description:
    "Master technical analysis & stock investing with the Kurukshetra Win the Battle course. 5+ hrs content, expert insights & strategies. Join 10,526+ students! Enroll now",
};

const CourseChakravyuhPage = () => {
  return (
    <div>
      <CourseChakravyuh />
    </div>
  );
};

export default CourseChakravyuhPage;
