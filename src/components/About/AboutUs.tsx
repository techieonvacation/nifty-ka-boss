"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { IconType } from "react-icons";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useAnimation,
} from "framer-motion";
import {
  FaYoutube,
  FaLinkedin,
  FaFacebook,
  FaChartLine,
  FaGraduationCap,
  FaBook,
  FaTv,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
const socialIcons = [
  {
    Icon: FaYoutube,
    url: "https://www.youtube.com/@RakeshBansal",
    color: "text-purple-600",
  },
  {
    Icon: FaXTwitter,
    url: "https://x.com/iamrakeshbansal",
    color: "text-green-600",
  },
  {
    Icon: FaLinkedin,
    url: "https://www.linkedin.com/in/drrakeshbansal/",
    color: "text-purple-600",
  },
  {
    Icon: FaFacebook,
    url: "https://www.facebook.com/rakeshbansal.official",
    color: "text-green-600",
  },
];

interface Achievement {
  number: string;
  text: string;
}

const achievements: Achievement[] = [
  { number: "25+", text: "Years Experience" },
  { number: "45k+", text: "Trained Participants" },
  { number: "2M+", text: "Followers" },
  { number: "1", text: "TV Channels" },
];

interface EducationalContent {
  icon: IconType;
  title: string;
  description: string;
}
const educationalContent: EducationalContent[] = [
  {
    icon: FaChartLine,
    title: "Technical Analysis",
    description: "Learn advanced charting techniques",
  },
  {
    icon: FaGraduationCap,
    title: "Webinars",
    description: "Participate in live interactive sessions",
  },
  {
    icon: FaBook,
    title: "Courses",
    description: "Comprehensive trading education",
  },
  {
    icon: FaTv,
    title: "Media Appearances",
    description: "Insights on leading financial channels",
  },
];

interface AnimatedSectionProps {
  children: React.ReactNode;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children }) => {
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
      initial="hidden"
      animate={controls}
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

interface AnimatedCounterProps {
  number: string;
  text: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ number, text }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 },
      });
      const interval = setInterval(() => {
        setCount((prevCount) => {
          const nextCount = prevCount + 1;
          return nextCount > parseInt(number) ? parseInt(number) : nextCount;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [inView, number, controls]);

  return (
    <motion.div ref={ref} animate={controls} className="text-center">
      <div className="text-4xl font-bold mb-2 text-purple-600">
        {count}
        {number.includes("k") && "k"}
        {number.includes("M") && "M"}
        {number.includes("+") && "+"}
      </div>
      <div className="text-sm text-green-600">{text}</div>
    </motion.div>
  );
};

const AboutUs = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={scrollRef} className="bg-white text-black">
      <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-purple-900 to-gray-800 py-6">
        <div className="relative z-20 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl md:text-7xl font-bold mb-4 text-white"
          >
            Dr. Rakesh Bansal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-xl md:text-2xl mb-3 text-white"
          >
            Empowering Traders, Transforming Lives
          </motion.p>
          <motion.div className="flex justify-center space-x-4">
            {socialIcons.map(({ Icon, url, color }, index) => (
              <motion.a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`${color} text-2xl`}
              >
                <Icon />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatedSection>
        <section className="py-10 bg-gradient-to-r from-purple-100 to-green-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-600">
                  About Dr. Rakesh Bansal
                </h2>
                <p className="text-sm md:text-base mb-6 leading-relaxed">
                  Dr. Rakesh Bansal, a post-graduate in International Business
                  Management and holder of a doctorate in market analysis, has
                  been a prominent figure in stock market analysis since 1998.
                  With over two decades of extensive experience, he specializes
                  in technical analysis, wealth management, and investment
                  analysis.
                </p>
                <p className="text-sm md:text-base mb-6 leading-relaxed">
                  As a SEBI registered research analyst (INH100008984), Dr.
                  Bansal offers high-quality market insights and educational
                  resources to traders and investors across the country, helping
                  millions work towards their financial independence.
                </p>
              </div>
              <div className="">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/about-us-img.webp"
                    alt="Dr. Rakesh Bansal"
                    width={400}
                    height={400}
                    className="rounded-full border-4 border-blue-400 shadow-lg"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-5 bg-gradient-to-r from-green-100 to-purple-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-green-600">
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <AnimatedCounter
                  key={index}
                  number={achievement.number}
                  text={achievement.text}
                />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-5 bg-gradient-to-r from-purple-100 to-green-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-purple-600">
              Career and Media Presence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-green-600">
                  Expert Panelist
                </h3>
                <p className="text-sm mb-4">
                  Dr. Rakesh Bansal is a well-known expert panelist on leading
                  financial news channels, including Zee Business, CNBC Awaaz,
                  ET Now, and DD News. His stock market insights and trading
                  strategies are highly regarded by investors seeking to gain a
                  competitive edge in the market.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-green-600">
                  Professional Experience
                </h3>
                <p className="text-sm mb-4">
                  He has previously worked with prestigious firms such as R K
                  Global, SMC Global Securities Limited, and BLB Limited,
                  leading their technical analysis departments. His first book,
                  "Profitable Short Term Trading Strategies," published by
                  Vision Books, showcases his deep understanding of the stock
                  market.
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-10 bg-gradient-to-r from-green-100 to-purple-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-green-600">
              Trading Philosophy and Methodology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-purple-600">
                  Disciplined Approach
                </h3>
                <p className="text-sm mb-4">
                  Dr. Bansal's trading philosophy is rooted in discipline and
                  meticulous technical analysis. He focuses on identifying
                  strong entry and exit points, utilizing tools such as 3-line
                  break charts and inverse charts to uncover hidden market
                  opportunities.
                </p>
                <ul className="list-disc list-inside text-sm">
                  <li>3-line break charts</li>
                  <li>Inverse charts</li>
                  <li>ATM trading strategy</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-purple-600">
                  Psychological Aspect
                </h3>
                <p className="text-sm mb-4">
                  Bansal emphasizes the psychological aspect of trading,
                  ensuring traders maintain emotional stability while making
                  informed decisions. His ATM trading strategy is designed to
                  help traders capitalize on short-term trends while managing
                  risks effectively.
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-10 bg-gradient-to-r from-purple-100 to-green-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-purple-600">
              Educational Contributions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {educationalContent.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-6 shadow-lg text-center"
                >
                  <item.icon className="text-5xl mb-4 mx-auto text-green-600" />
                  <h3 className="text-xl font-semibold mb-2 text-purple-600">
                    {item.title}
                  </h3>
                  <p className="text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-10 bg-gradient-to-r from-green-100 to-purple-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-green-600">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question:
                    "What is Dr Bansal's approach to technical analysis?",
                  answer:
                    "Dr. Rakesh Bansal emphasizes charting techniques like 3-line break charts and inverse charts to identify trends. He stresses the importance of defining clear entry and exit points for successful trading.",
                },
                {
                  question: "Where can I access his educational content?",
                  answer:
                    "You can participate in his webinars and courses through iamrakesbansal.com and Rakesh Bansal Ventures App to benefit from his market insights and trading strategies.",
                },
                {
                  question: "Is Dr Bansal SEBI registered?",
                  answer:
                    "Yes, Dr Bansal is a SEBI-registered Research Analyst under the registration number INH100008984.",
                },
                {
                  question: "What are his qualifications?",
                  answer:
                    "Dr. Rakesh Bansal holds an MBA in Finance and a CPFA. He has also completed the Equity Derivatives Certification from the National Institute of Securities Markets (NISM), Mumbai. Additionally, he holds a Doctorate in Market Analysis with a Hybrid Tech Model and is the Founder of iamrakeshbansal.com.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg p-6 shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-2 text-purple-600">
                    {faq.question}
                  </h3>
                  <p className="text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-5 bg-gradient-to-r from-purple-100 to-green-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-purple-600">
              Conclusion
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-sm mb-4">
                Dr. Rakesh Bansal has immensely contributed to spreading
                financial literacy across India, training over 45,000
                participants in the financial markets. He firmly believes that
                wealth can be built in the stock market through consistency,
                patience, and dedication. His teachings emphasize a disciplined
                approach, empowering traders to achieve long-term success with
                the right mindset and strategies.
              </p>
              <p className="text-sm">
                Dr. Rakesh Bansal has significantly contributed to the Indian
                stock market community by offering disciplined, research-backed
                strategies for successful trading. His commitment to educating
                traders through technical analysis and risk management has
                empowered countless individuals to navigate the complexities of
                the financial markets with confidence.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-xs text-center text-gray-700 font-semibold">
            Disclaimer: Investments in the securities market are subject to
            market risks. Please read all related documents carefully before
            investing.
          </p>
        </div>
      </section>

      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-purple-500 origin-left"
        style={{ scaleX }}
      />
    </div>
  );
};

export default AboutUs;
