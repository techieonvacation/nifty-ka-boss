"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";

interface SocialPlatform {
  name: string;
  icon: string;
  followers: number;
  action: string;
  href: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: "YouTube",
    icon: "/images/yt.webp",
    followers: 420000,
    action: "SUBSCRIBE",
    href: "https://www.youtube.com/@RakeshBansal",
  },
  {
    name: "Instagram",
    icon: "/images/insta.webp",
    followers: 660000,
    action: "FOLLOW",
    href: "https://www.instagram.com/therakeshbansal/",
  },
  {
    name: "Facebook",
    icon: "/images/fb.webp",
    followers: 98000,
    action: "FOLLOW",
    href: "https://www.facebook.com/rakeshbansal.official",
  },
  {
    name: "WhatsApp",
    icon: "/images/whatsapp.webp",
    followers: 4100,
    action: "JOIN NOW",
    href: "https://whatsapp.com/channel/0029Vaglc39K0IBhitUB5N2K",
  },
  {
    name: "Twitter",
    icon: "/images/twitter.webp",
    followers: 316000,
    action: "FOLLOW",
    href: "https://x.com/iamrakeshbansal",
  },
  {
    name: "Telegram",
    icon: "/images/telegram.webp",
    followers: 30000,
    action: "FOLLOW",
    href: "https://t.me/RakeshAlgo",
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export default function SocialMediaSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative py-8 overflow-hidden bg-gradient-to-r from-purple-900 to-green-900">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/social-media.webp"
          alt="Social Media Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <h2 className="text-3xl font-semibold text-white text-center mb-8">
          Connect with Dr. Rakesh Bansal
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {socialPlatforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-[calc(50%-1rem)] sm:w-auto flex flex-col items-center justify-between bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm transition-all duration-300 hover:bg-opacity-20 hover:scale-105"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                <Image
                  src={platform.icon}
                  alt={`${platform.name} icon`}
                  fill
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-white text-lg sm:text-xl font-semibold mt-2">
                {isMounted ? (
                  <CountUp
                    end={platform.followers}
                    duration={2}
                    separator=","
                    formattingFn={formatNumber}
                  />
                ) : (
                  formatNumber(platform.followers)
                )}
              </p>
              <Link
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full bg-transparent text-white border-white hover:bg-white hover:text-purple-900 transition-colors duration-300"
                >
                  {platform.action}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
