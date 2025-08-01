"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Book,
  Users,
  RefreshCcw,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function ChakravyuhCoursePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const features = [
    { icon: Book, text: "2+ HOURS OF CONTENT" },
    { icon: Users, text: "GROUP Q&A SESSIONS" },
    { icon: RefreshCcw, text: "course Completion Certificate" },
    // { icon: GraduationCap, text: "10,526+ STUDENTS" },
  ];

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 fixed top-[66px] w-full z-20 shadow-sm border-b border-purple-200"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-purple-800 font-semibold text-lg">
              Chakravyuh Ka Tod
            </h1>
          </div>
          <Link
            href="https://rakeshbansal.rpy.club/pick-package/QET7mva5S"
            passHref
          >
            <Button
              variant="gradient"
              size="lg"
              className="flex items-center space-x-2 py-1 lg:text-base lg:px-3"
            >
              Buy Now
            </Button>
          </Link>
        </div>
      </motion.div>

      <main className="container px-4 sm:px-6 py-28 sm:py-20 lg:py-16">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-purple-100 to-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center p-4 gap-5">
              <div className="flex flex-col justify-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-purple-900 leading-tight"
                >
                  <span className="text-xl sm:text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    Master the Power of
                  </span>
                  <br />
                  <span className="text-green-600 text-xl sm:text-4xl md:text-5xl">
                    Renko Charts
                  </span>
                  <br />
                  {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Entry and Exit
                  </span> */}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-sm sm:text-base font-light mb-6 text-gray-700"
                >
                  Unravel the hidden potential of Renko Charts in Chakravyuh Ka
                  Tod, a groundbreaking course by renowned market expert Dr.
                  Rakesh Bansal. Designed for beginners and seasoned traders
                  alike, this course demystifies Renko Charts and reveals how
                  they can simplify your trading decisions, help you spot clear
                  exit signals, and let you ride strong trends with confidence.
                  <br />
                  <br />
                  Renko Charts remove the “noise” often seen in candlestick or
                  bar charts, making it easier to identify real trends and
                  potential reversals. Whether you are a long-term investor
                  aiming to “buy and hold” or an active trader seeking the
                  perfect entry and exit, Renko Charts offer a more objective
                  way of reading the markets. Through hands-on tutorials, expert
                  insights, and real-world examples, Chakravyuh Ka Tod will
                  equip you with a powerful, simplified approach to technical
                  analysis.
                </motion.p>
                {/* <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-green-100 border-l-4 border-green-500 p-4 mb-6"
                >
                  <p className="text-sm sm:text-base text-green-800">
                    Led by the esteemed&nbsp;
                    <span className="font-semibold">Dr. Rakesh Bansal</span>, a
                    seasoned expert in the field, this course provides you with
                    the knowledge and tools necessary to analyze market trends,
                    make informed decisions, and achieve your trading and
                    investment goals.
                  </p>
                </motion.div> */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <feature.icon className="w-5 h-5 text-purple-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <Link
                  href="https://rakeshbansal.rpy.club/pick-package/QET7mva5S"
                  className="w-full block"
                >
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-auto sm:w-full"
                  >
                    Buy Now
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center justify-between h-full">
                <div className="w-full">
                  <Swiper
                    modules={[Pagination]}
                    pagination={{
                      clickable: true,
                      renderBullet: (index, className) => {
                        return `<span class="${className} w-3 h-3 mx-1 mt-4 rounded-full bg-purple-300 hover:bg-purple-500 transition-colors duration-300"></span>`;
                      },
                    }}
                    className="h-[400px]"
                  >
                    <SwiperSlide className="flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* <img src={Banner} alt="Banner" /> */}
                        <Image
                          src="https://learnrkb.in/iamrakeshbansal/courses/RenkoEnglish.png"
                          alt="Course Preview"
                          fill
                          className="object-fill"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-30"></div>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide className="flex items-center justify-center">
                      <div className="w-full h-full">
                        <iframe
                          src={`https://learnrkb.in/iamrakeshbansal/courses/ChakraEnglish.mp4`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
                {/* <div className="mt-14 w-full">
                  <Link
                    href="https://iamrakeshbansal.ck.page/kurukshetra"
                    className="w-full block"
                    passHref
                  >
                    <Button
                      variant="gradient"
                      size="md"
                      className="w-auto sm:w-full"
                    >
                      For Demo Class Click Here
                    </Button>
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* About Kurukshetra Win the Battle Section */}
        <section id="about-course" className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-purple-900 mb-6"
          >
            Key Highlights
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-100 to-white rounded-lg shadow-lg overflow-hidden p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Foundational Renko Learning",
                  content:
                    "Start from Scratch - No prior knowledge of Renko Charts or technical analysis is required. This course provides a clear, step-by-step introduction, making it ideal for absolute beginners. Progressive Curriculum -  Lessons build upon each other, ensuring you thoroughly understand the fundamentals of Renko Charts before moving on to advanced strategies.",
                  icon: Book,
                },
                {
                  title: "Simplified & Objective Analysis",
                  content:
                    "Reduced Market Noise - Renko Charts distill price action into clean, easy-to-read “blocks,” making trend direction clearer and less confusing than traditional candlestick or bar charts. Confidence in Decision-Making - By focusing on pure price movements, you can eliminate emotional biases and rely on data-driven signals for both entries and exits.",
                  icon: RefreshCcw,
                },
                {
                  title: "Early Exit & Trend Reversal Signals",
                  content:
                    "Protect Your Profits - Exiting winning trades at the right time is often harder than entry. Renko Charts offer clear reversal patterns that help you lock in gains. Ride Trends to the Fullest: Stay with strong trends longer without second-guessing, maximizing your profit potential.",
                  icon: GraduationCap,
                },
                {
                  title: "Adaptable for All Traders",
                  content:
                    "Buy-and-Hold Friendly - Investors who prefer to hold positions for the long term can identify robust trends early, improving overall portfolio returns. Active Trader Edge - Shorter-term traders benefit from precise and timely signals, ensuring that you capture optimal entry and exit points without being whipsawed by volatile market swings.",
                  icon: Users,
                },
                {
                  title: "Hands-On Practice & Real-World Examples",
                  content:
                    "Practical Applications - Go beyond theory with detailed case studies illustrating how to interpret Renko patterns across different market scenarios. In-depth Analysis - Watch Dr. Rakesh Bansal decode real charts and demonstrate how he pinpoints potential opportunities using Renko-based charts.",
                  icon: Users,
                },
                {
                  title: "Guidance from an Industry Veteran",
                  content:
                    "Expert Insights - Dr. Rakesh Bansal—renowned market mentor—shares his proven approaches and personal strategies for analyzing Renko Charts. Mentorship Approach - His passion for teaching and commitment to your success shines through every lesson, equipping you with the mindset and technical acumen to excel in any market condition.",
                  icon: GraduationCap,
                },
                {
                  title: "Complimentary 3-Month Handholding",
                  content:
                    "Structured Support - Get direct access to Dr. Rakesh Bansal’s team and community for three months—absolutely free. This includes a dedicated Telegram channel for handholding and market insights. High-Conviction Calls - Receive 10–12 meticulously curated trading calls per year, exclusively based on Renko Charts, complete with full handholding and support.",
                  icon: RefreshCcw,
                },
                {
                  title: "Affordable Ongoing Subscription",
                  content:
                    "Nominal Renewal Options - Extend your handholding subscription post the initial 3-month complimentary period at minimal charges—Rs. 1,499 (Quarterly), Rs. 2,799 (Half-Yearly), or Rs. 5,299 (Yearly). Dedicated Q&A - Ask up to 5 queries every month to get personalized, timely feedback and insights from Dr. Bansal and his expert team.",
                  icon: RefreshCcw,
                },
                {
                  title: "Interactive & Engaging Learning Experience",
                  content:
                    "Community Forum - Exchange ideas and discuss various trading scenarios with fellow learners, enriching your knowledge base and boosting confidence.",
                  icon: RefreshCcw,
                },
                {
                  title: "Lifetime Skillset for Market Mastery",
                  content:
                    "Versatility - Once you master Renko Charts, you can apply them to any equity, index, or asset class—both in Indian and global markets. Future-Proof Your Trading - Even as market conditions evolve, the timeless principles and robust techniques you learn here will keep you ahead of the game.",
                  icon: RefreshCcw,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-purple-200 rounded-full p-3">
                    <item.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 bg-purple-50 border-l-4 border-purple-500 p-4"
            >
              <p className="text-purple-800">
                This course is your gateway to mastering technical analysis,
                guided by one of the most respected names in the field. Whether
                your goal is to trade actively or invest wisely, the skills you
                acquire here will serve you for a lifetime.
              </p>
            </motion.div> */}
          </motion.div>
        </section>

        {/* Instructor Section */}
        <section id="instructor" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 p-6">
                <h2 className="text-4xl font-bold text-purple-900 mb-2">
                  Know Your
                </h2>
                <h3 className="text-4xl font-bold mb-2 text-gray-900">
                  Coach, Guide & Mentor
                </h3>
                <h4 className="text-3xl font-bold mb-6 text-green-500">
                  Dr. Rakesh Bansal
                </h4>
                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    {
                      Icon: FaInstagram,
                      followers: "653K+",
                      platform: "Instagram",
                    },
                    {
                      Icon: FaTwitter,
                      followers: "310.7K+",
                      platform: "Twitter",
                    },
                    {
                      Icon: FaLinkedin,
                      followers: "13k+",
                      platform: "LinkedIn",
                    },
                    {
                      Icon: FaYoutube,
                      followers: "400.8K+",
                      platform: "YouTube",
                    },
                  ].map((social, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <social.Icon className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
                      <span className="text-lg font-bold">
                        {social.followers}
                      </span>
                      <span className="text-sm text-gray-600">followers</span>
                    </div>
                  ))}
                </div>
                <Link href="/about-us">
                  <Button variant="gradient" size="lg">
                    Learn More About Rakesh Bansal
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/3 p-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-64 h-64 mx-auto md:mx-0"
                >
                  <Image
                    src="https://learnrkb.in/iamrakeshbansal/courses/course-page.webp"
                    alt="Rakesh Bansal"
                    fill
                    className="object-cover object-top rounded-md"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter Description Section */}
        <section id="chapter-description" className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-purple-900 mb-6"
          >
            How It Works
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-100 to-white rounded-lg shadow-lg overflow-hidden p-6 how-it-works"
          >
            <ul>
              <li>
                Course Access: Just like Kurukshetra – Win the Battle, you can
                access the course videos and materials through the Rakesh Bansal
                Ventures application.
              </li>
              <li>
                Interactive Learning - Learn the theory and practical
                application of Renko Charts through detailed video lessons,
                quizzes, and real-market examples.
              </li>
              <li>Handholding Subscription (First 3 Months Free): </li>
              <li>
                Access a dedicated Telegram channel via learnrkb.in for
                continued support.
              </li>
              <li>
                Ask up to 5 user queries per month and receive timely answers.
              </li>
              <li>
                Dr. Rakesh Bansal will share 10–12 high-conviction Renko-based
                trading calls per year, guiding you every step of the way.
              </li>
              <li>
                Extend Your Subscription - Once your 3-month complimentary
                subscription ends, you can choose a plan that suits your
                needs—quarterly, half-yearly, or yearly—to keep receiving
                updates, support, and new calls.
              </li>
              <li>
                Mandatory Course Enrollment - To subscribe to the handholding
                plans, you must be enrolled in Chakravyuh Ka Tod.
              </li>
            </ul>
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  title: "Introduction",
                  content:
                    "This chapter serves as your gateway to the world of technical analysis, providing a solid foundation for the concepts and techniques that will be covered throughout the course. By the end of this chapter, you will have a clear overview of the topics and tools that will empower you to make informed trading and investment decisions.",
                },
                {
                  title: "Single Candlestick Patterns",
                  content:
                    "Dive deep into the world of individual candlestick formations, where a single candle can reveal significant insights into market sentiment. This chapter covers crucial patterns like Doji, Hammer, and Marubozu, each of which plays a pivotal role in indicating potential price reversals or continuations. You will learn how to interpret these patterns within various market contexts, understanding what they signal about buyer and seller dynamics. Mastering these patterns will allow you to make quick, informed decisions based on concise, visual information.",
                },
                {
                  title: "Double Candlestick Patterns",
                  content:
                    "Expand your analytical toolkit with double candlestick patterns, which offer more nuanced insights into market behavior than single candlesticks. This chapter explores key patterns such as Bullish/Bearish Engulfing and Piercing/Dark Cloud Cover, which are particularly effective in identifying potential trend reversals. Through detailed examples, you will learn how to recognize these formations and interpret their implications, enhancing your ability to anticipate market shifts and make timely trading decisions.",
                },
                {
                  title: "Multiple Candlestick Patterns",
                  content:
                    "Take your understanding to the next level by studying multiple candlestick patterns that involve three or more consecutive candles. This chapter focuses on formations like Morning Star, Evening Star, and Three White Soldiers, which are powerful indicators of trend reversals or continuations. You will learn how to spot these patterns in real-time, understanding their significance within broader market trends. By mastering these complex patterns, you will be equipped to identify critical turning points in the market, allowing for more strategic entry and exit points.",
                },
                {
                  title: "Dow Theory",
                  content:
                    "This chapter introduces you to the foundational principles of Dow Theory, the bedrock of modern technical analysis. You will explore the core concepts, including the identification of primary, secondary, and minor trends, and the phases of market movements. Understanding Dow Theory will provide you with a structured approach to analyzing market behavior over different time frames, helping you to identify the underlying trend and position yourself accordingly in the market.",
                },
                {
                  title: "Dow Theory - Examples",
                  content:
                    "Building on the theoretical knowledge from the previous chapter, this section offers practical examples and real-world case studies to illustrate the application of Dow Theory. You will analyze historical market data and learn how to apply the principles of Dow Theory to identify trends and make informed trading decisions. These examples will reinforce your understanding and provide a framework for implementing Dow Theory in your trading strategy.",
                },
                {
                  title: "Chart Patterns & Triangles",
                  content:
                    "In this chapter, you will delve into the study of chart patterns, with a particular focus on triangles—one of the most common and reliable patterns in technical analysis. By understanding the formation and significance of these patterns, you will be better equipped to predict and capitalize on price movements, whether they indicate a continuation or a reversal of the current trend.",
                },
                {
                  title: "Continuation Chart Patterns",
                  content:
                    "This chapter is dedicated to continuation patterns, which signal that the existing trend is likely to persist after a brief consolidation. You will explore key patterns such as Flags, Pennants, and Rectangles, understanding how they form and what they indicate about market sentiment. By mastering these patterns, you will learn how to spot opportunities to ride the trend, maximizing your profits by staying in the market during periods of trend continuation.",
                },
                {
                  title: "Reversal Chart Patterns",
                  content:
                    "Here, you will study reversal chart patterns, which are crucial for identifying when a trend is about to change direction. This chapter covers patterns such as Head and Shoulders, Rounding Tops, and Rounding Bottoms, each of which provides strong signals that the prevailing trend is weakening and may soon reverse. You will learn how to recognize these patterns early and position yourself to take advantage of the new trend, whether it is bullish or bearish.",
                },
                {
                  title: "Technical Indicators - Lagging Indicators",
                  content:
                    "This chapter introduces you to lagging indicators, which are essential tools for confirming trends that have already begun. You will learn about Moving Averages, MACD, and other lagging indicators that help you stay on the right side of the market by providing reliable signals based on historical data. By understanding the strengths and limitations of these indicators, you will be able to incorporate them into your trading strategy to reduce the risk of false signals and improve your timing.",
                },
                {
                  title:
                    "Technical Indicators - Leading & Volatility Indicators",
                  content:
                    "Explore the world of leading and volatility indicators, which are designed to predict future price movements and assess market volatility. This chapter covers leading indicators such as RSI and Stochastic, which help you anticipate market turns before they occur. Additionally, you will learn about volatility indicators like Bollinger Bands, which measure the market's volatility and can signal potential breakouts or breakdowns. By integrating these indicators into your analysis, you will gain a more comprehensive view of market dynamics and enhance your ability to make proactive trading decisions.",
                },
                {
                  title: "Support & Resistance",
                  content:
                    "This chapter focuses on the critical concepts of support and resistance, which are key to understanding price movements in any market. You will learn how to identify these levels on a chart and how they act as barriers that the price may struggle to break through. Understanding support and resistance will enable you to predict potential price reversals or continuations, helping you to set effective entry and exit points in your trades.",
                },
                {
                  title: "Breakout & Breakdown",
                  content:
                    "Learn how to identify and trade breakouts and breakdowns, which occur when the price moves above a resistance level or below a support level. This chapter teaches you the techniques for spotting these critical moments when the market is likely to make a significant move. You will explore the factors that contribute to breakouts and breakdowns, and how to confirm these signals to avoid false breakouts. Mastering this concept will allow you to capitalize on new trends as they begin to unfold.",
                },
                {
                  title: "Trendlines",
                  content:
                    "In this chapter, you will learn the art of drawing and interpreting trendlines, one of the most fundamental tools in technical analysis. Trendlines help you identify the direction and strength of a trend, providing a visual representation of market sentiment. You will practice drawing trendlines across various time frames and understand how to use them to confirm trends, spot potential reversals, and make informed trading decisions.",
                },
                {
                  title: "Fibonacci Retracement and Gaps",
                  content:
                    "This chapter explores the use of Fibonacci retracement levels as potential support and resistance levels in the market. You will learn how to apply these levels to identify areas where the price may reverse or continue. Additionally, you will study the significance of price gaps, which can signal strong momentum and provide opportunities for trading breakouts and trend continuations.",
                },
                {
                  title: "Conclusion",
                  content:
                    "The course concludes by reinforcing the importance of technical analysis as a vital tool for making informed trading and investment decisions. The conclusion also emphasizes the ongoing nature of learning and the importance of practice and continuous improvement in mastering technical analysis.",
                },
              ].map((chapter, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-700">{chapter.content}</p>
                </motion.div>
              ))}
            </div> */}
          </motion.div>
        </section>

        {/* Feedback Section */}
        {/* <section id="feedback" className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-purple-900 mb-6 text-center"
          >
            What Our Students Say
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-100 to-white rounded-lg shadow-lg overflow-hidden p-6"
          >
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              pagination={{ clickable: true }}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="feedback-swiper"
              style={{ paddingBottom: "40px" }} // Add padding to the bottom
            >
              {[
                {
                  name: "Donda Pradip",
                  image: "/feedback/pradip-donda.webp",
                  feedback:
                    "This course has been incredibly useful for my trading. It has helped me better understand how to set stop losses and manage risks in the market. The technical analysis taught in the course is especially helpful for making informed trading decisions. Highly recommended for traders!",
                  rating: 5,
                },
                {
                  name: "Sourav Banerjee",
                  image: "/feedback/sourav-banerjee.webp",
                  feedback:
                    "The course content is excellent, but I would suggest adding more examples using real-time charts of various companies. This would provide a clearer understanding of how to apply the concepts in actual market situations and improve practical knowledge for better trading decisions.",
                  rating: 4,
                },
                {
                  name: "Neha Gupta",
                  image: "/feedback/neha-gupta.webp",
                  feedback:
                    "Rakesh Sir's teaching style is excellent. He explains the basics thoroughly, such as when a pattern works and when it doesn't. For example, in the piercing pattern, he clearly explained how the second green candle opens below the red. Overall, Sir has explained everything very well.",
                  rating: 5,
                },
                {
                  name: "Shashank M Hiremath",
                  image: "/feedback/sharkshank.webp",
                  feedback:
                    "The overall content of the Kurukshetra course was excellent. Each module was systematically handled, and the quiz questions helped identify areas of improvement. I've watched the course videos multiple times, which has significantly enhanced my trading and investment skills. Thank you, Bansal Sir.",
                  rating: 4,
                },
                {
                  name: "Ajay Ramjiyavan Chaudhari",
                  image: "/feedback/ajay-chaudhary.webp",
                  feedback:
                    "For me, it was my first attempt at learning, and the experience was fantastic. The course covered the basics clearly and was kept simple throughout. The chart explanations were very effective, making the overall learning process smooth and easy to follow. Highly recommend for beginners!",
                  rating: 5,
                },
                {
                  name: "Madhura D H",
                  image: "/feedback/madhura-harinath.webp",
                  feedback:
                    "I always wanted to learn from Rakesh Sir, and his trading style is truly exciting. I'm grateful to have learned from him through this course. I hope for an opportunity to meet him in person, especially as I’m from Bangalore, Karnataka. It would be wonderful if he visits the city!",
                  rating: 5,
                },
                {
                  name: "Manish kumar Sinha",
                  image: "/feedback/manish-sinha.webp",
                  feedback:
                    "The course is well-structured and easy to follow, providing clear explanations that enhance understanding of key concepts. It effectively breaks down complex topics, making learning accessible and enjoyable. Participants will gain valuable insights and clarity, enabling them to grasp and apply the material confidently.",
                  rating: 5,
                },
                {
                  name: "Trushit Patel",
                  image: "/feedback/trushit patel.webp",
                  feedback:
                    "The course was wonderful! It used simple, easy-to-understand language and provided perfect examples that clarified the concepts. The content was valuable and definitely worth the investment. I appreciate the effort put into making the material accessible and engaging. Thank you for a great learning experience!",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col"
                  >
                    <div className="flex items-center mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full mr-4 w-20 h-20 object-cover object-center"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900">
                          {testimonial.name}
                        </h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={
                                i < testimonial.rating ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 flex-grow">
                      {testimonial.feedback}
                    </p>
                    <div className="mt-4 text-purple-600">
                      <Quote className="w-6 h-6 inline-block mr-2" />
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </section> */}

        {/* FAQ Section */}
        <section id="faq" className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-purple-900 mb-6 text-center"
          >
            Education FAQs
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              {
                question: "Who is this course for?",
                answer:
                  "This course is designed for both beginners with no prior market experience and seasoned traders looking to simplify their trading strategy using Renko Charts.",
              },
              {
                question: "How do I access the course materials?",
                answer:
                  "You can watch all course videos and review materials on the Rakesh Bansal Ventures application. Simply log in after purchasing, and you’ll find Chakravyuh Ka Tod under your courses.",
              },
              {
                question: "What is the duration of access for the course?",
                answer:
                  "You will have 90 days of access to the course after purchase, during which you can watch the videos and review the materials as often as you like.",
              },
              {
                question:
                  " Is the handholding subscription included in the course fee?",
                answer:
                  "Yes, you get 3 months of complimentary handholding included with your course purchase. After this period, you can renew your subscription at nominal charges (Rs. 1,499/quarter, Rs. 2,799/half-yearly, or Rs. 5,299/year).",
              },
              {
                question: "Where does the handholding subscription take place?",
                answer:
                  "The handholding subscription is facilitated through our website, learnrkb.in, and a dedicated Telegram channel, where you can post queries and receive direct support from Dr. Bansal and the team.",
              },
              {
                question:
                  "Can I purchase the handholding subscription without enrolling in the course?",
                answer:
                  "No. To ensure you have the proper foundation and context for Renko Chart-based trading, course enrollment is mandatory to purchase any subscription plan.",
              },
              {
                question: "What do I get with the handholding subscription?",
                answer:
                  "Ability to ask 5 trading or market queries per month. 10–12 high-conviction trading calls per year from Dr. Rakesh Bansal. Ongoing market insights, support, and educational tips through the dedicated Telegram channel.",
              },
              {
                question: "Will I receive a certificate upon completion?",
                answer:
                  "Yes. Upon completing 80% of the course materials, you will receive a certificate of completion.",
              },
              {
                question: "Can I get a refund if I’m not satisfied?",
                answer:
                  "All purchases are final. No cancellations or refunds will be provided once the course or the handholding subscription is purchased.",
              },
              {
                question: "What happens if I use all 5 of my monthly queries?",
                answer:
                  "Once you’ve used your 5 allotted queries in a given month, you will not be able to submit additional questions until the next cycle begins. However, we understand that some learners may need extra guidance. We are planning to introduce a credit system soon, allowing you to purchase additional queries beyond your monthly limit. More details on how to buy and use these credits will be shared once the system is launched.",
              },
              {
                question: "What should I do if I face technical issues?",
                answer:
                  "For any technical challenges, please reach out to our support team via: Phone: (+91) 95608-84223 (Payment & Joining Related Queries) | Phone: (+91) 88514-75191 (General Enquiries) | Email: wecare@iamrakeshbansal.com | We are here to ensure you have a seamless learning experience.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full text-left p-4 focus:outline-none"
                  onClick={() => toggleSection(`faq-${index}`)}
                >
                  <span className="text-lg font-medium text-purple-900">
                    {faq.question}
                  </span>
                  {activeSection === `faq-${index}` ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {activeSection === `faq-${index}` && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-8 bg-gradient-to-br from-purple-100 to-white rounded-lg shadow-lg p-8 text-center"
          >
            <h3 className="text-2xl font-semibold text-purple-900 mb-6">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">
                  Payment & Enrollment
                </h4>
                <Link
                  href="tel:+919560884223"
                  className="flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+91 95608 84223</span>
                </Link>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">
                  General Inquiries
                </h4>
                <Link
                  href="tel:+918851475191"
                  className="flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+91 88514 75191</span>
                </Link>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">
                  Email Support
                </h4>
                <Link
                  href="mailto:wecare@iamrakeshbansal.com"
                  className="flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>wecare@iamrakeshbansal.com</span>
                </Link>
              </div>
            </div>
          </motion.div> */}
        </section>

        {/* CTA Section */}
        <section className="bg-purple-100 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-purple-900">
            Enroll Today
          </h2>
          <p className="text-lg mb-6 text-gray-700">
            Chakravyuh Ka Tod is your gateway to mastering Renko Charts under
            the expert guidance of Dr. Rakesh Bansal.
            <br />
            Uncover a simpler, more objective way to trade the markets—boost
            your confidence in your entries, secure your exits at the perfect
            time, <br />
            and ride big trends to their full potential.
            <br />
            <br />
            <b>Ready to break the cycle of uncertainty?</b>
            <br />
            Purchase Chakravyuh Ka Tod now and start your journey toward
            consistent, informed trading with Renko Charts!
          </p>
          <Link
            href="https://rakeshbansal.rpy.club/pick-package/QET7mva5S"
            passHref
          >
            <Button variant="gradient" size="lg">
              Buy Now
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
