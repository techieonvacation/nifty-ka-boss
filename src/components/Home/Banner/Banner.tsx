"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FirstSlide from "./FirstSlide";
import ThirdSlide from "./ThirdSlide";
import SeventhSlide from "./SeventhSlide";

const slides = [
  { id: 1, component: FirstSlide },
  { id: 2, component: ThirdSlide },
  { id: 4, component: SeventhSlide },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }
    }, 500000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isDragging]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  const handleDragStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    touchStartX.current = event.touches[0].clientX;
  };

  const handleDragEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);
    const touchEndX = event.changedTouches[0].clientX;
    const dragDistance = touchEndX - touchStartX.current;

    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  };

  const handlePan = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      prevSlide();
    } else if (info.offset.x < -100) {
      nextSlide();
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center max-h-max lg:max-h-[600px] xl:min-h-[600px] xl:max-h-[600px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            handlePan(e, info);
          }}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          {React.createElement(slides[currentSlide].component)}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute z-30 left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200 ease-in-out focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute z-30 right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200 ease-in-out focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ease-in-out focus:outline-none
              ${
                currentSlide === index
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
