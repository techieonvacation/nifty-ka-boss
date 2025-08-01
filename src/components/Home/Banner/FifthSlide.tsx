// "use client";

// import React from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import {
//   TrendingUp,
//   DollarSign,
//   BarChart2,
//   Users,
//   Zap,
//   Clock,
//   Briefcase,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const services = [
//   {
//     icon: Clock,
//     title: "Intraday Trading",
//     description: "Master short-term market movements",
//   },
//   {
//     icon: Briefcase,
//     title: "Options Trading",
//     description: "Leverage advanced derivatives strategies",
//   },
//   {
//     icon: TrendingUp,
//     title: "Futures Trading",
//     description: "Navigate the world of futures contracts",
//   },
//   {
//     icon: Users,
//     title: "Mentorship Program",
//     description: "One-on-one guidance for serious traders",
//   },
// ];

// export default function FifthSlide() {
//   return (
//     <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden py-16">
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="max-w-7xl w-full relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center mb-16"
//         >
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
//             Elevate Your Trading Journey
//           </h1>
//           <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//             Join our expert-led community and unlock the secrets of successful
//             trading strategies across various markets.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <div className="relative mb-12">
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-30"></div>
//               <div className="relative bg-gray-800 bg-opacity-50 rounded-2xl overflow-hidden shadow-2xl backdrop-filter backdrop-blur-lg">
//                 <Image
//                   src="/images/mentor-with-book.jpg"
//                   alt="Rakesh Bansal with his latest book"
//                   width={600}
//                   height={400}
//                   className="w-full h-auto"
//                 />
//                 <div className="p-6">
//                   <h2 className="text-2xl font-bold text-white mb-2">
//                     Rakesh Bansal
//                   </h2>
//                   <p className="text-gray-300">
//                     Author of "Mastering the Markets: A Comprehensive Guide to
//                     Trading Success"
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <h3 className="text-3xl font-bold text-white mb-6">
//               Our Comprehensive Services
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {services.map((service, index) => (
//                 <motion.div
//                   key={index}
//                   className="bg-gray-800 bg-opacity-50 rounded-lg p-6 backdrop-filter backdrop-blur-lg"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                 >
//                   <service.icon className="w-12 h-12 text-purple-400 mb-4" />
//                   <h4 className="text-xl font-semibold text-white mb-2">
//                     {service.title}
//                   </h4>
//                   <p className="text-gray-300">{service.description}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//           >
//             <div className="relative">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: 0.6 }}
//                 className="w-full h-96 bg-gray-800 bg-opacity-50 rounded-2xl overflow-hidden backdrop-filter backdrop-blur-lg"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-30"></div>
//                 <svg
//                   className="absolute inset-0 w-full h-full"
//                   viewBox="0 0 100 100"
//                   preserveAspectRatio="none"
//                 >
//                   <path
//                     d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
//                     fill="rgba(167, 139, 250, 0.1)"
//                   >
//                     <animate
//                       attributeName="d"
//                       values="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z;M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z;M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
//                       dur="10s"
//                       repeatCount="indefinite"
//                     />
//                   </path>
//                 </svg>
//                 <div className="relative z-10 flex items-center justify-center h-full">
//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.8, duration: 0.5 }}
//                     className="text-white text-center"
//                   >
//                     <TrendingUp className="w-16 h-16 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold mb-2">
//                       Live Market Insights
//                     </h2>
//                     <p className="text-gray-300">
//                       Real-time analysis and expert commentary
//                     </p>
//                   </motion.div>
//                 </div>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 1, duration: 0.5 }}
//                 className="absolute -bottom-8 -left-8 w-40 h-40 bg-gray-800 bg-opacity-50 rounded-2xl overflow-hidden shadow-lg backdrop-filter backdrop-blur-lg"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 opacity-30"></div>
//                 <div className="relative z-10 flex items-center justify-center h-full">
//                   <DollarSign className="w-12 h-12 text-white" />
//                 </div>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 1.2, duration: 0.5 }}
//                 className="absolute -top-8 -right-8 w-40 h-40 bg-gray-800 bg-opacity-50 rounded-2xl overflow-hidden shadow-lg backdrop-filter backdrop-blur-lg"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-30"></div>
//                 <div className="relative z-10 flex items-center justify-center h-full">
//                   <BarChart2 className="w-12 h-12 text-white" />
//                 </div>
//               </motion.div>
//             </div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 1.4 }}
//               className="mt-12 text-center"
//             >
//               <h3 className="text-2xl font-bold text-white mb-4">
//                 Ready to Transform Your Trading?
//               </h3>
//               <p className="text-gray-300 mb-6">
//                 Join our community of successful traders and take your skills to
//                 the next level.
//               </p>
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-lg font-semibold hover:from-purple-600 hover:to-pink-600 px-8 py-4"
//               >
//                 Start Your Journey Now
//                 <Zap className="ml-2 h-5 w-5" />
//               </Button>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }
