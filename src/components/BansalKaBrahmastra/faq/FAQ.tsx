"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  question: string;
  answer: JSX.Element;
}

const faqs: FAQ[] = [
  {
    question: "What exactly is included in Bansal Ka Brahmastra?",
    answer: (
      <div>
        You'll get access to:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            A 1-hour video tutorial by Dr. Bansal on reading charts and scanning
            stocks using TradingView and Chartink.
          </li>
          <li>
            Access to a proprietary stock scanner built on Dr. Bansal’s proven
            algorithm.
          </li>
          <li>
            Premium Telegram channel access for 1 month where “Stocks on Radar”
            are shared daily.
          </li>
          <li>1-month handholding support for guidance and doubt-solving.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Do I need to know technical analysis to join this course?",
    answer: (
      <p>
        No, the tutorial is designed for beginners as well as intermediate
        traders. Everything from charts to scanners is explained in simple
        language.
      </p>
    ),
  },
  {
    question: "How do I access the scanner?",
    answer: (
      <p>
        You’ll receive step-by-step instructions in the course video on how to
        use the scanner via TradingView and Chartink platforms. It’s
        plug-and-play.
      </p>
    ),
  },
  {
    question: "Will I get stock recommendations daily?",
    answer: (
      <p>
        Yes, inside the premium Telegram channel, Dr. Bansal’s team shares
        “Stocks on Radar” daily (on market days).
      </p>
    ),
  },
  {
    question: "What happens after the 1-month Telegram support ends?",
    answer: (
      <p>
        You can choose to continue receiving daily stock ideas and guidance by
        renewing Telegram channel access at just ₹500/month.
      </p>
    ),
  },
  {
    question: "Is it a lifetime scanner or subscription-based?",
    answer: (
      <p>
        The scanner is lifetime access. The Telegram support is valid for 1
        month initially and can be renewed monthly if you wish.
      </p>
    ),
  },
  {
    question:
      "Will I get discounts if I’ve already purchased Kurukshetra or Chakravyuh courses?",
    answer: (
      <div>
        Yes!
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Kurukshetra buyers get Flat 50% OFF</li>
          <li>Chakravyuh buyers get Flat 25% OFF</li>
          <li>Early Birds offer Get Flat 15% OFF</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Will this help me become a profitable trader?",
    answer: (
      <p>
        While no one can guarantee profits, Bansal Ka Brahmastra gives you a
        strategic edge, a proven scanner, and daily trade ideas – all of which
        increase your probability of success.
      </p>
    ),
  },
  {
    question: "Can I get a refund after purchase?",
    answer: (
      <p>
        Since this is a digital product with immediate access, there is no
        refund once purchased. Please read all details carefully before buying.
      </p>
    ),
  },
  {
    question: "How do I contact support if I have questions?",
    answer: (
      <div>
        You can reach out via WhatsApp directly from the website or You can
        contact us through the following:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Payment & joining related: (+91) 95608 84223</li>
          <li>Enquiries: (+91) 88514 75191</li>
          <li>Email: wecare@iamrakeshbansal.com</li>
        </ul>
      </div>
    ),
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-primary/5 py-10">
      <div className="container">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-montserrat text-center text-foreground mb-8 sm:mb-12">
          Frequently Asked Questions (FAQs)
        </h2>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                className="flex justify-between items-center w-full p-4 sm:p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors hover:bg-gray-50"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="text-base sm:text-lg font-medium text-foreground font-montserrat pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 pt-0 text-gray-700 text-sm font font-inter sm:text-base">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
