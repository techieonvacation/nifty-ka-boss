"use client";

import React  from "react";
import { motion } from "framer-motion";
// import {
 
//   FileText,

//   Bell,
//   Globe,
//   UserCheck,
//   XCircle,
//   Mail,
//   ChevronDown,
// } from "lucide-react";


const RenkoReport = () => {
 


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-green-100 py-12 px-4 sm:px-6 lg:px-8 renko-report">
      <motion.div
        className="max-w-4xl mx-auto"
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
          Renko Report
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
            <p className="text-center">Welcome to the official Chakravyuh Ka Tod Telegram channel<br/>
                your trusted source for high-conviction trading calls <br/>
                and expert market insights from <br/>
                Dr. Rakesh Bansal.
            </p>

            <div className="renko-01">
            Here, we’ll share:
            <ul>
                <li>Exclusive Trading Ideas based on Renko Charts</li>
                <li>Reports & Analysis offering a deeper understanding of each call</li>
                <li>Timely Market Updates to keep you on top of emerging opportunities</li>
            </ul>
            </div>
            <div className="note">Important Note:
This channel is dedicated to delivering timely and actionable information. For any queries or personalized support, please visit learnrkb.in and post your questions there. This ensures all discussions and clarifications remain organized and easily accessible for everyone in the community.
Stay tuned for real-time insights, and thank you for being a part of Chakravyuh Ka Tod!
</div>

        </motion.div>


        {/* <motion.div
          className="mt-16 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p>
            &copy; {new Date().getFullYear()} Rakesh Bansal Ventures. All rights
            reserved.
          </p>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default RenkoReport;
