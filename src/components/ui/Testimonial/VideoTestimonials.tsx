"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaCircleArrowRight } from "react-icons/fa6";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial1.mp4",
    name: "John Doe",
    company: "Tech Innovators",
    review:
      "This product revolutionized our workflow. Highly recommended for any tech team!",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial2.mp4",
    name: "Jane Smith",
    company: "Creative Solutions",
    review:
      "The customer support is outstanding. They went above and beyond to help us.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial3.mp4",
    name: "Mike Johnson",
    company: "Global Enterprises",
    review:
      "We've seen a 50% increase in productivity since implementing this solution.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial4.mp4",
    name: "Emily Brown",
    company: "Startup Accelerator",
    review: "Perfect for startups! Easy to use and scales well as we grow.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial5.mp4",
    name: "Emily Brown",
    company: "Startup Accelerator",
    review: "Perfect for startups! Easy to use and scales well as we grow.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial6.mp4",
    name: "Emily Brown",
    company: "Startup Accelerator",
    review: "Perfect for startups! Easy to use and scales well as we grow.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial7.mp4",
    name: "Emily Brown",
    company: "Startup Accelerator",
    review: "Perfect for startups! Easy to use and scales well as we grow.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial8.mp4",
    name: "Emily Brown",
    company: "Startup Accelerator",
    review: "Perfect for startups! Easy to use and scales well as we grow.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial9.mp4",
    name: "Emily Brown",
    company: "Startup Accelerator",
    review: "Perfect for startups! Easy to use and scales well as we grow.",
  },
  {
    videoUrl: "https://learnrkb.in/iamrakeshbansal/testimonial10.mp4",
    name: "Emily Brown",
    company: "Startup Accelerator",
    review: "Perfect for startups! Easy to use and scales well as we grow.",
  },
];

export default function VideoTestimonials() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (playingIndex !== null && playingIndex !== index) {
        const prevVideo = videoRefs.current[playingIndex];
        if (prevVideo) {
          prevVideo.pause();
        }
      }

      if (video.paused) {
        video.play().catch((error) => {
          console.error("Error playing video:", error);
        });
        setPlayingIndex(index);
      } else {
        video.pause();
        setPlayingIndex(null);
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && playingIndex !== null) {
        const video = videoRefs.current[playingIndex];
        if (video) {
          video.pause();
        }
        setPlayingIndex(null);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playingIndex]);

  return (
    <div className="relative mb-10  sm:px-6">
      <Swiper
        onSwiper={setSwiperInstance}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={20}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 250,
          modifier: 1,
          slideShadows: false,
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
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
        className="swiper-container"
        onSlideChange={handleSlideChange}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 1.5,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 5,
          },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={testimonial.videoUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-end p-3">
                <AnimatePresence>
                  <motion.button
                    onClick={() => togglePlayPause(index)}
                    className="absolute w-full h-full flex items-center justify-center"
                    initial={false}
                    animate={{ opacity: playingIndex === index ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="bg-black bg-opacity-80 w-16 h-16 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-8 h-8"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={handlePrev}
        className={`absolute top-1/2 -left-5 sm:-left-8 lg:-left-12 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
          isBeginning ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
        }`}
        aria-label="Previous slide"
        disabled={isBeginning}
      >
        <IoArrowBackCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600" />
      </button>
      <button
        onClick={handleNext}
        className={`absolute top-1/2 -right-5 sm:-right-8 lg:-right-12 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
          isEnd ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
        }`}
        aria-label="Next slide"
        disabled={isEnd}
      >
        <FaCircleArrowRight className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600" />
      </button>
    </div>
  );
}
