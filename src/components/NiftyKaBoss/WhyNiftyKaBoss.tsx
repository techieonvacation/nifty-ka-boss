import {
  Target,
  Award,
  BarChart3,
  Zap,
  TrendingUp,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function WhyNiftyKaBoss() {
  const features = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "Proven Precision",
      description:
        "Achieve results you can trust with an 87% accuracy rate, validated by 10 years of NIFTY data backtesting, and an outstanding 92% accuracy in 2025. Our system's rigorous testing and daily enhancements ensure you're always ahead of the curve.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Expert-Led Innovation",
      description:
        "Built by Dr. Rakesh Bansal, a pioneer in technical analysis and wealth management, Nifty Ka Boss integrates proprietary support and resistance indicators with advanced tools, designed specifically for the NIFTY market's unique challenges.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Complete Market Clarity",
      description:
        "Access detailed historical charts (Open, High, Low, Close), clear buy, sell, and neutral signals, and precise stop-loss and new base alerts. Dr. Bansal's exclusive indicators and system-defined levels give you a full picture of market opportunities.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Real-Time Power",
      description:
        "Yearly subscribers unlock our premium Telegram channel, delivering instant buy, sell, neutral, and new base alerts, so you can seize market moves as they happen and maximize your profits.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Always Evolving",
      description:
        "Nifty Ka Boss grows smarter every day, incorporating the latest market trends and technological advancements to keep you at the forefront of trading innovation.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Built for Everyone",
      description:
        "From first-time traders to market experts, Nifty Ka Boss simplifies complex market dynamics with intuitive tools and insights, making trading accessible, engaging, and rewarding for all.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Trusted by Thousands",
      description:
        "With a decade of data-driven success and a thriving community, Nifty Ka Boss has empowered countless traders to navigate the NIFTY market with confidence and achieve consistent results.",
      color: "from-teal-500 to-green-500",
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Recent Market Insights",
      description:
        "Stay informed with in-depth analysis of the NIFTY market's last 10 days, including Open, High, Low, and Close data, to understand trends and make strategic decisions with ease.",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 font-urbanist">
            Why Nifty Ka Boss is Your Trading Edge
          </h2>
          <p className="text-base text-gray-300 max-w-4xl mx-auto leading-relaxed font-urbanist">
            In the fast-moving world of NIFTY trading, Nifty Ka Boss stands out
            as your ultimate partner, combining cutting-edge technology with the
            unmatched expertise of Dr. Rakesh Bansal, a SEBI-registered research
            analyst (INH100008984) with over 25 years of experience since 1998.
            Holding a post-graduate degree in International Business Management
            and a doctorate in market analysis, Dr. Bansal is a trusted name
            followed by millions for his actionable insights that drive
            financial independence. Nifty Ka Boss isn't just a trading
            system—it's your key to mastering the market with precision and
            confidence. Here's why traders worldwide choose Nifty Ka Boss:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gray-800 p-6 hover:scale-105 transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 font-urbanist">
                  {feature.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed font-inter">
                  {feature.description}
                </p>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}
              ></div>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <p className="text-lg leading-relaxed font-dmSans">
            Join the growing community of traders who rely on Nifty Ka Boss to
            elevate their trading game. With Dr. Rakesh Bansal's expertise, a
            data-driven approach, and a commitment to your success, Nifty Ka
            Boss is your gateway to conquering the NIFTY market with confidence,
            clarity, and precision. Start today and transform your trading
            journey!
          </p>
        </div>
      </div>
    </section>
  );
}
