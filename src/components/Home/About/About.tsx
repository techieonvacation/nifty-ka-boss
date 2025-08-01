"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function EnhancedAboutSection() {
  return (
    <section className="relative py-10 overflow-hidden bg-gradient-to-b from-green-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="about-us-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.2)" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#about-us-pattern)"
          />
        </svg>
      </div>
      <div className="container relative mx-auto px-4 z-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center md:text-6xl leading-tight xl:leading-tight mb-8 lg:mb-12">
            About Dr.&nbsp;
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400">
              Rakesh Bansal
            </span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl z-50 w-full h-[400px] md:h-[500px]"
            >
              <Image
                src="/images/about-us-img.jpg"
                alt="Dr. Rakesh Bansal"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-purple-900/80 opacity-10" />
            </motion.div>
            <div className="space-y-6">
              <p className="text-base lg:text-lg text-center md:text-left text-gray-300 leading-relaxed font-light">
                Dr. Rakesh Bansal, a post-graduate in International Business
                Management and has doctorate through his expertise in markets
                and analysis, he has been in the market since 1998 and is a
                prominent figure in stock market analysis with millions of
                people following his advice to work towards their financial
                independence. With over two decades of extensive experience, he
                specializes in technical analysis, wealth management and
                investment analyst.
              </p>
              <p className="text-base lg:text-lg text-center md:text-left text-gray-300 leading-relaxed font-light">
                He is SEBI registered research analyst&nbsp;
                <span className="font-bold inline-block">(INH100008984)</span>,
                offering high-quality market insights and educational resources
                to traders and investors across the country.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pt-4"
              >
                <Link href="/about-us">
                  <Button
                    variant="gradient"
                    size="md"
                    className="w-full md:w-auto"
                    rightIcon={<ArrowUpRight className="size-5" />}
                  >
                    View More
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
