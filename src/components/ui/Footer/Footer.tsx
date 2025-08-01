"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

export default function Footer() {
  const socialIcons = [
    {
      Icon: FaLinkedinIn,
      href: "https://www.linkedin.com/in/drrakeshbansal/",
      label: "LinkedIn",
    },
    {
      Icon: FaInstagram,
      href: "https://www.instagram.com/therakeshbansal/",
      label: "Instagram",
    },
    {
      Icon: FaYoutube,
      href: "https://www.youtube.com/@RakeshBansal",
      label: "YouTube",
    },
    {
      Icon: FaFacebookF,
      href: "https://www.facebook.com/rakeshbansal.official",
      label: "Facebook",
    },
    {
      Icon: FaWhatsapp,
      href: "https://www.whatsapp.com/channel/0029Vaglc39K0IBhitUB5N2K",
      label: "WhatsApp",
    },
    {
      Icon: FaXTwitter,
      href: "https://x.com/iamrakeshbansal",
      label: "Twitter",
    },
  ];

  const usefulLinks = [
    { text: "Home", href: "/" },
    // { text: "Blog", href: "/blogs" },
    { text: "Services", href: "/#services-sec" },
    { text: "About Us", href: "/about-us" },
    { text: "Contact Us", href: "/contact-us" },
  ];

  const quickLinks = [
    { text: "Disclaimer", href: "/disclaimer" },
    {
      text: "Feedback Form",
      href: "https://docs.google.com/forms/d/e/1FAIpQLScbFTo1a56fkSEYXrKZevHEtuClx9WS9l5Xd3gXjdfoI-GwCg/viewform",
    },
    { text: "Privacy Policy", href: "/privacy-policy" },
    { text: "Customer Grievances", href: "/customer-grievances" },
    { text: "Terms and Conditions", href: "/terms-conditions" },
  ];

  const contactInfo = [
    {
      Icon: MdPhone,
      text: "Joining: +91 95608-84223",
      href: "tel:+919560884223",
    },
    {
      Icon: MdPhone,
      text: "Enquiries :+91 88514-75191",
      href: "tel:+918851475191",
    },
    {
      Icon: MdEmail,
      text: "wecare@iamrakeshbansal.com",
      href: "mailto:wecare@iamrakeshbansal.com",
    },
    { Icon: MdLocationOn, text: "New Delhi, India", href: "#" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-green-800 to-black text-white overflow-hidden">
      <svg
        className="absolute top-0 w-full h-12 sm:h-24 -mt-1 -rotate-180"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        fill="white"
      >
        <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 36.7C840 27 960 13 1080 16.3C1200 20 1320 40 1380 50L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" />
      </svg>
      <div className="container mx-auto px-4 pt-20 sm:pt-32 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[25%,30%,20%,15%] gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center sm:items-start"
          >
            <Image
              src="/images/footer-logo.png"
              alt="Logo"
              width={180}
              height={60}
              className="mb-6 w-full h-auto max-w-[180px]"
            />
            <p className="text-sm mb-6 text-center sm:text-left">
              Empowering your financial journey with innovative solutions and
              unparalleled service.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              {socialIcons.map(({ Icon, href, label }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  target="_blank" // Open link in new tab
                  rel="noopener noreferrer" // Security measure
                  aria-label={label}
                  className="bg-white text-purple-900 p-2 rounded-full hover:bg-green-400 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center sm:text-left"
            >
              <h3 className="text-xl font-semibold mb-3">Navigation</h3>
              <ul className="space-y-2">
                {usefulLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link
                      href={link.href}
                      className="hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center sm:text-left"
            >
              <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link
                      href={link.href}
                      className="hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center sm:text-left"
          >
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map(({ Icon, text, href }, index) => (
                <motion.li
                  key={index}
                  className="flex items-center justify-center sm:justify-start space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <Link
                    href={href}
                    className="hover:text-purple-400 transition-colors text-sm"
                  >
                    {text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center sm:text-left"
          >
            <h3 className="text-xl font-semibold mb-6">Download Our App</h3>
            <div className="flex lg:flex-col justify-center sm:justify-start items-center sm:items-start gap-4">
              {[
                {
                  src: "https://cdn.rareblocks.xyz/collection/celebration/images/hero/4/app-store-button.png",
                  href: "https://apps.apple.com/us/app/rakesh-bansal-ventures/id6474428694?mt=8",
                  alt: "Download on App Store",
                },
                {
                  src: "https://cdn.rareblocks.xyz/collection/celebration/images/hero/4/play-store-button.png",
                  href: "https://play.google.com/store/apps/details?id=com.rpy.rakeshplhrwc",
                  alt: "Get it on Google Play",
                },
              ].map((icon, index) => (
                <motion.a
                  key={index}
                  href={icon.href}
                  target="_blank" // Open link in new tab
                  rel="noopener noreferrer" // Security measure
                  className="block transition-all duration-200"
                  role="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    className="w-auto rounded h-12"
                    src={icon.src}
                    alt={icon.alt}
                    width={135}
                    height={40}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="mt-12 pt-8 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <p className="text-sm mb-4 sm:mb-0 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Rakesh Bansal Ventures All
              rights reserved.
            </p>
            {/* <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="text-sm hover:text-green-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div> */}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
