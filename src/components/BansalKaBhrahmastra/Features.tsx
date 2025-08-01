"use client";

import { motion } from "framer-motion";
import { Shield, CreditCard, CuboidIcon as Cube, Diamond } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function Features() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      id: 1,
      title: "1-Hour Masterclass",
      description: "Learn charting + screening with examples",
      icon: <Shield className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700",
    },
    {
      id: 2,
      title: "Proven & Trusted Tool",
      description: "Uses his personal, battle-tested indicator & scanner",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-purple-500 to-purple-700",
    },
    {
      id: 3,
      title: "Telegram Premium Channel access ",
      description: "Receive Daily 'Stocks on Radar' for 1 Month",
      icon: <Cube className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-700",
    },
    // {
    //   id: 4,
    //   title: "Optional Renewal ",
    //   description: "Continue Telegram channel access @ ₹500/month only",
    //   icon: <Award className="w-8 h-8" />,
    //   color: "from-cyan-500 to-cyan-700",
    // },
    {
      id: 5,
      title: "Early Access Benefits",
      description: "Get Brahmastra 2.0 & 3.0 at a nominal price in future",
      icon: <Diamond className="w-8 h-8" />,
      color: "from-pink-500 to-pink-700",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      ref={ref}
      className="w-full py-10 bg-background relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full opacity-70 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-50 rounded-full opacity-70 blur-3xl"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">
            What You{" "}
            <span className="mt-1 text-primary font-montserrat">Will Get?</span>
          </h2>
          <p className="text-foreground/80 text-xl font-inter">
            Explore Dr. Rakesh Bansal's premium trading comparison table.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#c5003e]"></div>

              <div className="p-8 flex flex-col items-center text-center h-full">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-montserrat">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>

              {/* Decorative corner */}
              <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-50"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
