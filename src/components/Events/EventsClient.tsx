"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { Calendar, MapPin, Users, Play } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Masonry from "react-masonry-css";
import Link from "next/link";
import Slider from "react-slick";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  image: string;
}

// Add this new interface
interface GalleryImageProps {
  src: string;
  alt: string;
}

// Add this interface at the top of the file with other interfaces
interface Banner {
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  attendees,
  image,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-lg shadow-lg overflow-hidden border border-purple-200"
  >
    <div className="relative h-60">
      <Image src={image} alt={title} fill className="object-cover object-top" />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2 text-purple-800">{title}</h3>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar className="w-4 h-4 mr-2 text-green-600" />
        <span>{date}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mr-2 text-green-600" />
        <span>{location}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Users className="w-4 h-4 mr-2 text-green-600" />
        <span>{attendees} attendees</span>
      </div>
    </div>
  </motion.div>
);

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
        >
          <Play className="w-16 h-16 text-green-400" />
        </button>
      )}
    </div>
  );
};

const VideoSlider: React.FC<{ videos: string[] }> = ({ videos }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    customPaging: function () {
      return (
        <div className="w-3 h-3 mx-1 mt-4 rounded-full bg-purple-300 hover:bg-purple-500 transition-colors duration-300" />
      );
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {videos.map((video, index) => (
        <div key={index} className="px-2">
          <VideoPlayer src={video} />
        </div>
      ))}
    </Slider>
  );
};

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const BansalGallery: React.FC<{
  ahmedabadEvents: GalleryImageProps[];
  delhiEvents: GalleryImageProps[];
}> = ({ ahmedabadEvents, delhiEvents }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    customPaging: function () {
      return (
        <div className="w-3 h-3 mx-1 rounded-full bg-purple-300 hover:bg-purple-500 transition-colors duration-300" />
      );
    },
  };

  return (
    <Slider {...settings}>
      <div>
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-8 text-green-700"
        >
          Delhi Events
        </motion.h3>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {delhiEvents.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  priority
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-green-900 bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-bold">{image.alt}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </div>
      <div>
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-8 text-green-700"
        >
          Ahmedabad Events
        </motion.h3>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {ahmedabadEvents.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  priority
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-purple-900 bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-bold">{image.alt}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </div>
    </Slider>
  );
};

const CustomArrow = ({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 p-2 rounded-full transition-all duration-300 ${
      direction === "prev" ? "left-4" : "right-4"
    }`}
  >
    {direction === "prev" ? (
      <FaChevronLeft size={20} />
    ) : (
      <FaChevronRight size={20} />
    )}
  </button>
);

const HeroSection: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
  };

  return (
    <div className="relative h-[60vh] lg:h-[95vh] min-h-[300px] max-h-[800px] overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className="relative h-[60vh] lg:h-[95vh] min-h-[300px] max-h-[800px]"
          >
            <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdBP02jUowk_c0cgx2cEpt-8fup2hhfnIYiAx3L6Qkk2D0cNA/viewform">
              <Image
                src={banner.image}
                alt={`Event banner ${index + 1}`}
                fill
                className="object-fill object-center"
              />
            </Link>

            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute bottom-28 inset-0 flex flex-col justify-end items-center text-white px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
              >
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdBP02jUowk_c0cgx2cEpt-8fup2hhfnIYiAx3L6Qkk2D0cNA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <button
                    type="submit"
                    className="flex justify-center text-green-700 hover:text-white gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md
                     lg:font-semibold
                     isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-600 before:hover:w-full before:-left-full
                      before:hover:left-0 before:rounded-full before:bg-purple-500  before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700
                       relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                  >
                    Click here to register
                    <svg
                      className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50
                       text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                      viewBox="0 0 16 19"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                        className="fill-green-800 group-hover:fill-purple-800"
                      ></path>
                    </svg>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export {
  EventCard,
  VideoPlayer,
  VideoSlider,
  AnimatedSection,
  BansalGallery,
  CustomArrow,
  HeroSection,
};
