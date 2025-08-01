"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Scale,
  Bell,
  Globe,
  UserCheck,
  XCircle,
  Mail,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const sections = [
    {
      title: "SEBI Registration",
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      content:
        "RAKESH BANSAL VENTURES is registered with SEBI (Securities and Exchange Board of India) as a Research Entity.",
    },
    {
      title: "Nature of Business",
      icon: <FileText className="w-8 h-8 text-green-600" />,
      content:
        "We provide fundamental and technical reports, including charts and tools, to identify market patterns for investors.",
    },
    {
      title: "Information Accuracy",
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      content:
        "While we believe our information and views are reliable, we do not guarantee their accuracy, completeness, or reliability. Investors should independently evaluate market conditions and risks.",
    },
    {
      title: "Confidentiality",
      icon: <Lock className="w-8 h-8 text-green-600" />,
      content:
        "Our reports are confidential and intended solely for the selected recipient. Unauthorized distribution or alteration is prohibited without prior written consent.",
    },
    {
      title: "Data Source",
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      content:
        "Information in our reports is derived from publicly available data. We do not guarantee the accuracy or completeness of this data.",
    },
    {
      title: "Risk Disclaimer",
      icon: <Scale className="w-8 h-8 text-green-600" />,
      content:
        "Investment in securities is subject to market risks. Past performance is not indicative of future results.",
    },
    {
      title: "Independence and Conflict of Interest",
      icon: <UserCheck className="w-8 h-8 text-purple-600" />,
      content:
        "We strive to minimize conflicts of interest in preparing research reports. We or our partners may have financial interests but did not receive compensation from the subject companies mentioned in the report.",
    },
    {
      title: "Ownership Disclosure",
      icon: <FileText className="w-8 h-8 text-green-600" />,
      content:
        "Our company and partners do not collectively own 1% or more of the equity securities of the subject companies mentioned in the report.",
    },
    {
      title: "Disciplinary Action",
      icon: <XCircle className="w-8 h-8 text-purple-600" />,
      content:
        "No material disciplinary action has been taken against our company by any regulatory authority impacting equity research activities.",
    },
    {
      title: "Website Disclaimer",
      icon: <Globe className="w-8 h-8 text-green-600" />,
      content:
        "Our website (https://www.iamrakeshbansal.com/) is not responsible for errors, omissions, or representations on its pages. We disclaim liability for risks associated with internet and SMS-based information dissemination.",
    },
    {
      title: "Warranty Disclaimer",
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      content:
        "We expressly disclaim any implied warranties and consider ourselves subject to the jurisdiction of the court of Delhi in India.",
    },
    {
      title: "Geographical Limitation",
      icon: <Globe className="w-8 h-8 text-green-600" />,
      content:
        "Our website is specifically for users in the territory of India. While access for users outside India is not denied, we disclaim legal liabilities in jurisdictions other than India.",
    },
    {
      title: "User Authorization",
      icon: <UserCheck className="w-8 h-8 text-purple-600" />,
      content:
        "By using our website, users authorize RAKESH BANSAL VENTURES to contact them and send promotional and transactional communication.",
    },
    {
      title: "Termination of Accounts",
      icon: <XCircle className="w-8 h-8 text-green-600" />,
      content:
        "We reserve the right to terminate accounts of subscribers/customers violating proprietary rights.",
    },
    {
      title: "Communication Authorization",
      icon: <Bell className="w-8 h-8 text-purple-600" />,
      content:
        "Users authorize us to contact them, even if registered under the National Do Not Call Registry or other related regulations.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-green-600 mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Privacy Policy
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="p-6 cursor-pointer"
                onClick={() =>
                  setActiveSection(activeSection === index ? null : index)
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {section.icon}
                    <h2 className="text-xl font-semibold text-purple-700 ml-3">
                      {section.title}
                    </h2>
                  </div>
                  <motion.div
                    animate={{ rotate: activeSection === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-green-500" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {activeSection === index && (
                    <motion.p
                      className="text-gray-700"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {section.content}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xl sm:text-2xl text-gray-700 mb-6">
            For any queries, please contact:
          </p>
          <motion.div
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-full text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
            <Link
              href="mailto:info@iamrakeshbansal.com"
              className="hover:underline"
            >
              info@iamrakeshbansal.com
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p>
            &copy; {new Date().getFullYear()} Rakesh Bansal Ventures. All rights
            reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
