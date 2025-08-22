"use client";

import { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Sparkles,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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
    <div className="relative min-h-screen py-10 overflow-hidden">
      {/* Beautiful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large decorative shapes */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-yellow-200/10 to-orange-200/10 rounded-full blur-2xl animate-slow-spin"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-1/4 animate-float">
          <Star className="w-6 h-6 text-purple-300/30" />
        </div>
        <div className="absolute top-1/3 right-20 animate-float-delayed">
          <Sparkles className="w-8 h-8 text-blue-300/40" />
        </div>
        <div className="absolute bottom-1/4 left-16 animate-float">
          <Zap className="w-7 h-7 text-pink-300/35" />
        </div>
        <div className="absolute bottom-32 right-1/3 animate-float-delayed">
          <HelpCircle className="w-6 h-6 text-indigo-300/30" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-60">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, rgba(99, 102, 241, 0.03) 1.5px, transparent 1.5px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      <div className="container max-w-5xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-200/30 rounded-full px-4 py-2 text-sm font-medium text-purple-600 mb-6">
            <MessageCircle className="w-4 h-4 text-purple-500" />
            Frequently Asked Questions
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6 font-urbanist leading-tight">
            FAQs Section: Answers to Get You Started
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed font-inter">
            Get instant answers to common questions about Nifty Ka Boss and
            start your trading journey with confidence.
          </p>

          <div className="flex justify-center space-x-3 mb-4">
            {colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${color} animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 sm:px-8 py-6 sm:py-8 text-left hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div
                      className={`w-4 h-4 rounded-full ${colors[index]} mr-4 sm:mr-6 flex-shrink-0 shadow-lg`}
                    ></div>
                    <div
                      className={`absolute inset-0 w-4 h-4 rounded-full ${colors[index]} animate-ping opacity-30`}
                    ></div>
                  </div>
                  <span className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 pr-4 group-hover:text-purple-700 transition-colors duration-300">
                    {faq.question}
                  </span>
                </div>
                <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 bg-gradient-to-r from-purple-50/30 to-pink-50/30 border-t border-purple-100/50 animate-in slide-in-from-top duration-300">
                  <div className="ml-8 sm:ml-10 relative">
                    <div className="absolute -left-4 top-2 w-1 h-12 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full opacity-30"></div>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-inter pt-4">
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
