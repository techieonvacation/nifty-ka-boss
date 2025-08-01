import { BadgeCheck } from "lucide-react";
import CourseShowcase from "@/components/Courses/CoursesShowcase";
import { courses } from "@/components/Courses/coursesData";
import CourseHero from "@/components/BansalKaBhrahmastra/CourseHero";
import { Badge } from "@/components/ui/badge";
import FAQ from "@/components/ui/Faq";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <CourseHero />
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="h-auto w-full fill-white dark:fill-gray-950"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="bg-background py-10">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge
              variant="outline"
              rounded="subtle"
              icon={<BadgeCheck />}
              className="shadow-sm rounded-full mb-2 text-foreground"
            >
              Premium Trading Education
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground font-montserrat sm:text-4xl lg:text-5xl">
              Our Featured Trading Courses
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Comprehensive courses designed to take you from beginner to
              professional trader
            </p>
          </div>

          <CourseShowcase courses={courses} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl font-montserrat">
              Ready to Transform Your Trading Journey?
            </h2>
            <p className="mb-4 text-lg text-white/90 font-inter max-w-2xl mx-auto">
              Join thousands of successful traders who have elevated their
              skills with our premium courses
            </p>
            <Link href="#courses">
              <Button variant="gradient" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
