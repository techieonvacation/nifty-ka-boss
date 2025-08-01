"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { FaQuoteLeft } from "react-icons/fa";
import VideoTestimonials from "./VideoTestimonials";
import { MdPlayArrow } from "react-icons/md";
import Slider from "react-slick";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  rating: number;
  imageUrl: string;
}
interface Post {
  id: number;
  content: {
    rendered: string;
  };
}

// Extract TestimonialData From Wordpress CMS
const extractTestimonialData = (post: Post): Testimonial => {
  const content = post.content.rendered;
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const imageUrl =
    doc.querySelector("img")?.src || "/placeholder.svg?height=300&width=300";
  const name = doc.querySelector("h1")?.textContent || "";

  let title = "";
  let rating = 5;

  doc.querySelectorAll("p strong").forEach((element) => {
    if (element.textContent?.trim() === "Title:") {
      title = element.nextSibling?.textContent?.trim() || "";
    }
    if (element.textContent?.trim() === "Rating:") {
      const stars = element.nextSibling?.textContent?.match(/⭐/g);
      rating = stars ? stars.length : 5;
    }
  });

  const quote = doc.querySelector("blockquote p")?.textContent || "";

  return { id: post.id, name, title, rating, quote, imageUrl };
};

interface TestimonialCardProps extends Testimonial {
  isActive: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  title,
  rating,
  imageUrl,
  isActive,
}) => (
  <div
    className={cn(
      "flex flex-col md:flex-row items-center border border-border  rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out",
      isActive
        ? "opacity-100 translate-x-0"
        : "opacity-0 translate-x-full absolute"
    )}
  >
    <div className="w-full md:w-[350px] h-[250px] relative ring-4 ring-purple-500 my-1 md:my-0 mx-1 rounded-xl overflow-hidden ">
      <Image
        src={imageUrl}
        alt={`${name}'s testimonial`}
        fill
        className="object-cover"
      />
    </div>
    <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between relative">
      <FaQuoteLeft className="w-10 h-10 text-indigo-600 " />
      <div>
        <p className="text-foreground font-light leading-relaxed mb-4 text-sm lg:text-base line-clamp-3 pl-8">
          "{quote}"
        </p>
        <div className="flex items-center mb-2 pl-8">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              )}
            />
          ))}
        </div>
      </div>
      <div className="pl-8">
        <h3 className="text-foreground font-semibold">{name}</h3>
        <p className="text-foreground text-sm">{title}</p>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch(
      "https://public-api.wordpress.com/wp/v2/sites/237367158/posts?categories=14224206"
    )
      .then((response) => response.json())
      .then((data) => {
        const extractedTestimonials = data.map(extractTestimonialData);
        setTestimonials(extractedTestimonials);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    beforeChange: (_oldIndex: number, newIndex: number) =>
      setCurrentSlide(newIndex),
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className="relative overflow-hidden py-10 bg-white">
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/10 to-green-900/10">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="pricing-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.05)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.05)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)" />
            </linearGradient>
          </defs>
          <path fill="url(#pricing-grad)" d="M0 0 C 50 100, 80 100, 100 0 Z" />
        </svg>
      </div>
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="absolute"
            style={{ left: `${i * 25}%`, top: "20%" }}
            width="40"
            height="40"
            viewBox="0 0 40 40"
          >
            <path
              d="M20 2 L38 38 L2 38 Z"
              fill="none"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur={`${10 + i * 2}s`}
                repeatCount="indefinite"
              />
            </path>
          </svg>
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 xl:px-10 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-green-600 mb-4">
            What Our Clients Say
          </h2>
        </div>
        <div className="mb-6 lg:mb-8">
          <VideoTestimonials />
        </div>

        <div className="relative md:h-[250px] mb-4 md:mb-8 lg:mb-10">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                isActive={index === currentSlide}
              />
            ))}
          </Slider>

          <div className=" absolute right-3 flex -bottom-16 border border-purple-200 overflow-hidden">
            <button
              onClick={goToPrev}
              className="bg-purple-600 cursor-pointer p-1 flex items-center justify-center"
              aria-label="Previous slide"
            >
              <MdPlayArrow className="text-white size-8 rotate-180" />
            </button>
            <button
              onClick={goToNext}
              className="bg-purple-600 border-l  cursor-pointer p-1 flex items-center justify-center"
              aria-label="Next slide"
            >
              <MdPlayArrow className="text-white size-8" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => sliderRef.current?.slickGoTo(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentSlide === index
                  ? "bg-purple-600 scale-125"
                  : "bg-gray-300"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
