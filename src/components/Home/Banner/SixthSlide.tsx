// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { Users, Book, Video, Award } from "lucide-react";

// const features = [
//   {
//     icon: Users,
//     title: "Expert Community",
//     description: "Connect with seasoned traders and mentors",
//   },
//   {
//     icon: Book,
//     title: "Comprehensive Courses",
//     description: "In-depth lessons on various trading strategies",
//   },
//   {
//     icon: Video,
//     title: "Live Webinars",
//     description: "Attend interactive sessions with industry experts",
//   },
//   {
//     icon: Award,
//     title: "Certification",
//     description: "Earn credentials to showcase your expertise",
//   },
// ];

// export default function SixthSlide() {
//   return (
//     <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl w-full">
//         <div className="text-center mb-12">
//           <motion.h2
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
//           >
//             Elevate Your Trading Skills
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="text-xl text-gray-300"
//           >
//             Join our comprehensive trading education platform and take your
//             skills to the next level.
//           </motion.p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 * index }}
//               className="bg-gray-800 rounded-lg p-6 text-center"
//             >
//               <feature.icon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-white mb-2">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-400">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//           className="mt-12 text-center"
//         >
//           <a
//             href="#"
//             className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out"
//           >
//             Start Learning Now
//           </a>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
