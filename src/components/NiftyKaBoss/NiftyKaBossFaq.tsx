"use client";

import { useState } from "react";
import { HelpCircle, MessageCircle } from "lucide-react";

const faqData = [
  {
    question: "What is Nifty Ka Boss?",
    answer:
      "Nifty Ka Boss is a cutting-edge trading system developed by Dr. Rakesh Bansal, delivering clear buy, sell, and neutral signals with an 87% accuracy rate, backed by 10 years of NIFTY data backtesting. It combines advanced analytics with Dr. Bansal's proprietary indicators to make trading simple, effective, and profitable.",
  },
  {
    question: "Why is Nifty Ka Boss the right choice for me?",
    answer:
      "With a stellar 92% accuracy in 2025 and continuous daily improvements, Nifty Ka Boss offers unmatched reliability. Backed by Dr. Bansal's 25+ years of expertise and SEBI registration, it provides actionable insights, historical charts, and real-time alerts (for yearly subscribers) to help you succeed, no matter your experience level.",
  },
  {
    question: "What's included in the Telegram channel?",
    answer:
      "Exclusive to Yearly Plan subscribers, our Telegram channel delivers real-time buy, sell, neutral, and new base alerts, ensuring you act on market opportunities the moment they arise.",
  },
  {
    question: "How reliable is Nifty Ka Boss?",
    answer:
      "Nifty Ka Boss boasts an 87% accuracy rate over a decade of NIFTY data, with 92% in 2025. Its reliability comes from Dr. Bansal's proprietary indicators, rigorous backtesting, and constant updates to align with market trends.",
  },
  {
    question: "Can beginners use Nifty Ka Boss?",
    answer:
      "Yes! Nifty Ka Boss is designed for all traders. Its intuitive signals, clear charts, and easy-to-understand insights make it perfect for beginners, while its advanced tools empower seasoned traders to maximize profits.",
  },
  {
    question: "How do the last 10 days' movement insights help?",
    answer:
      "Get a clear view of the NIFTY market's recent trends with detailed Open, High, Low, and Close data for the last 10 days, helping you spot patterns and make strategic decisions with confidence.",
  },
];

export default function NiftyKaBossFaq() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="container max-w-5xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 font-urbanist">
            FAQs Section: Answers to Get You Started
          </h2>
          <div className="flex justify-center space-x-2">
            {colors.slice(0, 4).map((color, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${color}`}></div>
            ))}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-primary/10 rounded-2xl overflow-hidden border-l-4 border-l-transparent hover:border-l-primary transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-6 text-left hover:bg-primary/20 transition-colors duration-200 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${colors[index]} mr-3 sm:mr-4 flex-shrink-0`}
                  ></div>
                  <span className="text-base sm:text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  {openItems.includes(index) ? (
                    <HelpCircle className="w-5 h-5 text-foreground" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-foreground" />
                  )}
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 bg-primary/10">
                  <div className="ml-7 sm:ml-8">
                    <p className="text-sm sm:text-base text-foreground leading-relaxed font-dmSans">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
