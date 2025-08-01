"use client";

import React, { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaCircleArrowRight } from "react-icons/fa6";
import {
  EffectCoverflow,
  Navigation,
  Autoplay,
  Pagination,
} from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    imageUrl: "/images/profitable-short-term.webp",
    alt: "Project 1",
    link: "https://www.amazon.in/Profitable-Short-Term-Trading-Strategies/dp/817094905X/ref=as_li_ss_tl?_encoding=UTF8&qid=1598112345&sr=8-3&linkCode=sl1&tag=mylink05d-21&linkId=615bc48b7c7f3fc566275dd0c8095fdf",
  },
  {
    imageUrl: "/images/profitable-elliott.webp",
    alt: "Project 3",
    link: "https://www.amazon.in/Profitable-Elliott-Wave-Trading-Strategies/dp/938626837X/ref=as_li_ss_tl?dchild=1&keywords=rakesh+bansal&qid=1598112345&sr=8-1&linkCode=sl1&tag=mylink05d-21&linkId=18dd0da516336b7f178d635f32de5f78",
  },
  {
    imageUrl: "/images/profitable-trading-dow.webp",
    alt: "Project 4",
    link: "https://www.amazon.in/dp/B08GQV8L43/ref=as_li_ss_tl?_encoding=UTF8&qid=1598605294&sr=8-1&linkCode=sl1&tag=mylink05d-21&linkId=7d6c1920b81d0bd0e1c0613a8cdad63d",
  },
  {
    imageUrl: "/images/profitable-short-term.webp",
    alt: "Project 1",
    link: "https://www.amazon.in/Profitable-Short-Term-Trading-Strategies/dp/817094905X/ref=as_li_ss_tl?_encoding=UTF8&qid=1598112345&sr=8-3&linkCode=sl1&tag=mylink05d-21&linkId=615bc48b7c7f3fc566275dd0c8095fdf",
  },
  {
    imageUrl: "/images/profitable-elliott.webp",
    alt: "Project 3",
    link: "https://www.amazon.in/Profitable-Elliott-Wave-Trading-Strategies/dp/938626837X/ref=as_li_ss_tl?dchild=1&keywords=rakesh+bansal&qid=1598112345&sr=8-1&linkCode=sl1&tag=mylink05d-21&linkId=18dd0da516336b7f178d635f32de5f78",
  },
  {
    imageUrl: "/images/profitable-trading-dow.webp",
    alt: "Project 4",
    link: "https://www.amazon.in/dp/B08GQV8L43/ref=as_li_ss_tl?_encoding=UTF8&qid=1598605294&sr=8-1&linkCode=sl1&tag=mylink05d-21&linkId=7d6c1920b81d0bd0e1c0613a8cdad63d",
  },
];

export default function BookPublished() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  }, [swiperInstance]);

  const handleNext = useCallback(() => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  }, [swiperInstance]);

  const handleSlideChange = useCallback(() => {
    if (swiperInstance) {
      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);
    }
  }, [swiperInstance]);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-purple-900 to-green-900"></div>
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="blog-dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.3)" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#blog-dots)" />
        </svg>
      </div>
      <div className="container pt-10 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
            Published Books
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-center text-secondary-foreground font-light">
          Unlock your trading potential with our flexible pricing options.
          Choose the plan that best fits your needs and start your journey to
          financial success.
        </p>
        <div className="">
          <div className="relative w-full max-w-5xl mx-auto py-10">
            <Swiper
              onSwiper={setSwiperInstance}
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={2.5}
              spaceBetween={0}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 250,
                modifier: 1,
                slideShadows: false,
              }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              loop={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{
                el: ".swiper-pagination",
                clickable: true,
              }}
              modules={[EffectCoverflow, Navigation, Autoplay, Pagination]}
              className="swiper-container"
              onSlideChange={handleSlideChange}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                500: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 2.5,
                },
              }}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <div
                    className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Image
                      src={slide.imageUrl}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-fit transition-transform duration-300 hover:scale-105"
                    />
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        >
                          <Link
                            href={slide.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-green-500 text-white font-semibold rounded-lg shadow-lg"
                            >
                              Buy Now
                            </motion.a>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              onClick={handlePrev}
              className={`absolute top-1/2 -left-9 sm:-left-10 lg:-left-20 transform -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full transition-all duration-300 ${
                isBeginning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-80"
              }`}
              aria-label="Previous slide"
              disabled={isBeginning}
            >
              <IoArrowBackCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
            </button>
            <button
              onClick={handleNext}
              className={`absolute top-1/2 -right-9 sm:-right-10 lg:-right-20 transform -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full transition-all duration-300 ${
                isEnd ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
              }`}
              aria-label="Next slide"
              disabled={isEnd}
            >
              <FaCircleArrowRight className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
