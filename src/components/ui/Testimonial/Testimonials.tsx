"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import VideoTestimonials from "./VideoTestimonials";
import { FaQuoteLeft } from "react-icons/fa";
import Slider from "react-slick";

interface Post {
  id: number;
  content: {
    rendered: string;
  };
}

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  rating: number;
  imageUrl: string;
}

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
      "flex flex-col md:flex-row items-center border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out",
      isActive
        ? "opacity-100 translate-x-0"
        : "opacity-0 translate-x-full absolute"
    )}
  >
    <div className="w-full md:w-[350px] h-[250px] relative ring-4 ring-primary my-1 md:my-0 mx-1 rounded-xl overflow-hidden">
      <Image
        src={imageUrl}
        alt={`${name}'s testimonial`}
        fill
        className="object-cover"
      />
    </div>
    <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between relative">
      <FaQuoteLeft className="w-10 h-10 text-primary" />
      <div>
        <p className="text-foreground font-light leading-relaxed mb-4 text-sm lg:text-base line-clamp-3 pl-8">
          {quote}
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

export default function Testimonial() {
  const sliderRef = useRef<Slider>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    beforeChange: (oldIndex: number, newIndex: number) =>
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
    <div className="relative overflow-hidden py-10 bg-background">
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 to-secondary/10">
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
              <stop offset="0%" stopColor="rgba(var(--primary), 0.05)" />
              <stop offset="50%" stopColor="rgba(var(--secondary), 0.05)" />
              <stop offset="100%" stopColor="rgba(var(--primary), 0.05)" />
            </linearGradient>
          </defs>
          <path fill="url(#pricing-grad)" d="M0 0 C 50 100, 80 100, 100 0 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 xl:px-10 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
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
                key={testimonial.id}
                {...testimonial}
                isActive={index === currentSlide}
              />
            ))}
          </Slider>

          <div className="absolute right-3 flex -bottom-16 border border-primary/20 overflow-hidden rounded-md">
            <button
              onClick={goToPrev}
              className="bg-primary cursor-pointer p-1 lg:p-2 flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-primary-foreground w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="bg-primary border-l border-primary/20 cursor-pointer p-1 lg:p-2 flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight className="text-primary-foreground w-6 h-6" />
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
                currentSlide === index ? "bg-primary scale-125" : "bg-gray-300"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
