"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronDownIcon,
  Briefcase,
  MousePointer,
  HelpCircle,
  Clock,
  Bookmark,
  DollarSign,
  BarChart2,
  Users,
  MessageCircle,
  Globe,
  XCircle,
  Bell,
  TrendingUp,
  Lock,
} from "lucide-react";

const faqs = [
  {
    question: "What services does Rakesh Bansal Ventures offer?",
    answer:
      "We provide multiple services including Intraday/BTST, Options, Futures, Delivery, Commodity, and HNI services.",
    icon: <Briefcase className="w-6 h-6 text-purple-500" />,
  },
  {
    question: "How can I subscribe to your services?",
    answer:
      "You can subscribe to our services through our website. Simply visit the services page and choose the plan that suits you best.",
    icon: <MousePointer className="w-6 h-6 text-green-500" />,
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Currently, we do not offer a free trial. However, our competitive pricing and expert-backed signals ensure that you get value for your subscription.",
    icon: <HelpCircle className="w-6 h-6 text-purple-500" />,
  },
  {
    question: "What is the Intraday/BTST service?",
    answer:
      "Our Intraday/BTST service provides 5-6 trade signals every week. These signals are for short-term trades that are squared off the same day or the next day.",
    icon: <Clock className="w-6 h-6 text-green-500" />,
  },
  {
    question: "What does the Options Plan include?",
    answer:
      "The Options Plan includes signals for top Nifty 50 companies & index signals.",
    icon: <Bookmark className="w-6 h-6 text-purple-500" />,
  },
  {
    question: "Can I get a discount on subscriptions?",
    answer:
      "We occasionally offer discounts and special promotions. Please keep an eye on our website and communications for any ongoing offers.",
    icon: <DollarSign className="w-6 h-6 text-green-500" />,
  },
  {
    question: "How do I know the performance of your recommendations?",
    answer:
      "We provide detailed performance reports on our website. These reports include the rationale behind each recommendation and track our performance.",
    icon: <BarChart2 className="w-6 h-6 text-purple-500" />,
  },
  {
    question: "What is the HNI service?",
    answer:
      "Our HNI service is tailored for high-net-worth individuals with a subscription fee of ₹5 lakh +18% GST. This service includes an initial meeting with Rakesh Bansal, along with exclusive future and delivery calls.",
    icon: <Users className="w-6 h-6 text-green-500" />,
  },
  {
    question: "Do you provide support for your services?",
    answer:
      "Yes, we offer support for all our services. You can reach out to our service team for any assistance.",
    icon: <MessageCircle className="w-6 h-6 text-purple-500" />,
  },
  {
    question: "How can I contact Rakesh Bansal Ventures?",
    answer:
      "You can contact us through the following:\n• Payment & joining related: (+91) 95608 84223\n• Enquiries: (+91) 88514 75191\n• Email: wecare@iamrakeshbansal.com",
    icon: <Globe className="w-6 h-6 text-green-500" />,
  },
  // {
  //   question: "Can I use the services while traveling abroad?",
  //   answer: "Yes, our services can be accessed from anywhere. If you are traveling, make sure to have internet access to receive our signals and updates.",
  //   icon: <Globe className="w-6 h-6 text-purple-500" />,
  // },
  {
    question: "What is the refund policy?",
    answer:
      "Generally, we do not offer refunds for any subscription plans unless there are exceptional circumstances.",
    icon: <XCircle className="w-6 h-6 text-green-500" />,
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time by visiting your account settings on our website. Please note that cancellations will take effect at the end of your current billing cycle.",
    icon: <XCircle className="w-6 h-6 text-purple-500" />,
  },
  {
    question: "Are the signals shared via WhatsApp?",
    answer:
      "No, we do not provide any services via WhatsApp. All signals and updates are shared through our App platforms as mentioned on our website.",
    icon: <Bell className="w-6 h-6 text-green-500" />,
  },
  {
    question: "Where do you provide calls and trading updates?",
    answer:
      "As soon as you subscribe to our plan, you will be automatically added to the group chat on our app where we provide all the calls and alerts.",
    icon: <Bell className="w-6 h-6 text-purple-500" />,
  },
  {
    question: "Why did the market price change after I took the call?",
    answer:
      "We apologize for the inconvenience. The market prices are highly volatile, and our calls are based on real-time updates.",
    icon: <TrendingUp className="w-6 h-6 text-green-500" />,
  },
  {
    question:
      "Is there any way to connect with other subscribers? Or how safe is my identity?",
    answer:
      "No, we do not facilitate direct connections between subscribers. We prioritize the privacy and security of our subscribers above all else. This policy is in place to protect your personal information and ensure a secure environment for all our clients.",
    icon: <Lock className="w-6 h-6 text-purple-500" />,
  },
];

interface Faq {
  question: string;
  answer: string;
  icon: JSX.Element;
}

interface FaqProps {
  faq: Faq;
  index: number;
  isActive: boolean;
  setActiveIndex: (index: number | null) => void;
}

const FAQItem: React.FC<FaqProps> = ({
  faq,
  index,
  isActive,
  setActiveIndex,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="bg-white overflow-hidden shadow-sm rounded-sm sm:rounded-lg mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.button
        className="w-full px-4 py-5 sm:p-6 text-left focus:outline-none"
        onClick={() => setActiveIndex(isActive ? null : index)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {faq.icon}
            <span
              className={`ml-3 text-sm lg:text-base xl:text-lg font-medium transition-colors duration-300 ${
                isActive ? "text-purple-700" : "text-foreground"
              }`}
            >
              {faq.question}
            </span>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-purple-500 transition-transform duration-300 ${
              isActive ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </motion.button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-4 pb-5 sm:px-6 sm:pb-6"
          >
            <motion.p
              className="text-gray-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {faq.answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-br from-purple-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-green-400 text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isActive={activeIndex === index}
                setActiveIndex={setActiveIndex}
              />
            ))}
          </div>
          <div className="space-y-4">
            {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, index) => (
              <FAQItem
                key={index + Math.ceil(faqs.length / 2)}
                faq={faq}
                index={index + Math.ceil(faqs.length / 2)}
                isActive={activeIndex === index + Math.ceil(faqs.length / 2)}
                setActiveIndex={setActiveIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
