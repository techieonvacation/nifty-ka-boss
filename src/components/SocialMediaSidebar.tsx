"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const socialMedias = [
  {
    name: "Facebook",
    icon: FaFacebook,
    url: "https://www.facebook.com/rakeshbansal.official",
    color: "#1877F2",
  },
  {
    name: "Twitter",
    icon: FaXTwitter,
    url: "https://x.com/iamrakeshbansal",
    color: "#1DA1F2",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/therakeshbansal/",
    color: "#E4405F",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    url: "https://www.linkedin.com/in/drrakeshbansal/",
    color: "#0A66C2",
  },
  {
    name: "Youtube ",
    icon: FaYoutube,
    url: "https://www.youtube.com/@RakeshBansal",
    color: "#FF0000",
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    url: "https://wa.me/919996161879",
    color: "#25D366",
  },
];

export default function SocialMediaSidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end">
      {socialMedias.map((social, index) => (
        <motion.div
          key={social.name}
          className="flex items-center justify-end mb-2 cursor-pointer overflow-hidden"
          initial={{ width: 40 }}
          animate={{
            width: hoveredIndex === index ? 140 : 40,
          }}
          transition={{ duration: 0.3 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          style={{ backgroundColor: social.color }}
        >
          <Link
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center w-full"
          >
            <motion.div
              className="flex items-center w-full"
              animate={{
                flexDirection: hoveredIndex === index ? "row" : "row-reverse",
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 shrink-0">
                <social.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-sm font-medium mx-2 whitespace-nowrap">
                {social.name}
              </span>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
