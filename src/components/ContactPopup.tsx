"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Phone,
  Send,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
export default function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const socialIcons = [
    { Icon: MessageCircle, color: "#25D366", label: "WhatsApp" },
    { Icon: Youtube, color: "#FF0000", label: "YouTube" },
    { Icon: Facebook, color: "#1877F2", label: "Facebook" },
    { Icon: Linkedin, color: "#0A66C2", label: "LinkedIn" },
    { Icon: Send, color: "#0088CC", label: "Telegram" },
    { Icon: Instagram, color: "#E4405F", label: "Instagram" },
    { Icon: FaXTwitter, color: "#1DA1F2", label: "Twitter" },
    { Icon: Phone, color: "#4CAF50", label: "Phone" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleInteraction = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      ref={popupRef}
      onMouseEnter={handleInteraction}
      onMouseLeave={handleInteraction}
      onClick={handleInteraction}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full mb-4 space-y-2"
          >
            {socialIcons.map(({ Icon, color, label }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="block w-12 h-12 rounded-full p-2 bg-white text-purple-600 shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: color }}
                aria-label={label}
              >
                <Icon className="w-full h-full text-white" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button aria-label="Contact us" className="py-3 px-5 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 ease-in-out flex items-center space-x-2 rounded-full shadow-lg hover:shadow-xl">
          <span className="hidden sm:block">Contact Us</span>
          <MessageCircle className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
