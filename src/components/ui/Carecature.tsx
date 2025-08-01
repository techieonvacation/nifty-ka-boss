"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Caricature() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`
          transition-all duration-700 ease-in-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <div
          className="
          w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
          bg-[#f2f2f4] backdrop-filter backdrop-blur-lg
          rounded-full flex items-center justify-center overflow-hidden
          transition-all duration-300 ease-in-out
          transform hover:scale-105
          shadow-lg hover:shadow-xl
          ring-2 ring-white ring-opacity-50 hover:ring-opacity-75
        "
        >
          <div className="relative top-5 w-full h-full z-50">
            <Image
              src="/images/carecature.gif"
              fill
              alt="carecature"
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
