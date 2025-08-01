import {
  Clock,
  BarChart2,
  PieChart,
  DollarSign,
  BookOpen,
  TrendingUp,
} from "lucide-react";
// payment link chan ge

export type ServiceKey =
  | "Intraday/BTST"
  | "Index & Option"
  | "Option & Intraday"
  | "Mentorship"
  | "Futures"
  | "Renko Charts"
  | "Commodity"
  | "HNI";

export const services = [
  { name: "Intraday/BTST", icon: Clock, color: "bg-purple-500" },
  { name: "Index & Option", icon: PieChart, color: "bg-yellow-500" },
  { name: "Option & Intraday", icon: PieChart, color: "bg-yellow-500" },
  { name: "Futures", icon: BarChart2, color: "bg-green-500" },
  { name: "Renko Charts", icon: BarChart2, color: "bg-green-500" },
  { name: "Mentorship", icon: BookOpen, color: "bg-blue-500" },
  { name: "Commodity", icon: DollarSign, color: "bg-red-500" },
  { name: "HNI", icon: TrendingUp, color: "bg-indigo-500" },
];

type ServicePlan = {
  duration: "Monthly" | "Quarterly" | "Yearly" | "Half-yearly" | "";
  price: string;
  buttonText?: string;
};

type WhyChooseUs = {
  title: string;
  info: string;
};

type WhatWeOffer = {
  title: string;
  info: string;
};

type ServiceFeatures = {
  price?: string;
  features: string[];
};
type KeyFeatures = string;

type AdvancedFeatures = {
  [key: string]: ServiceFeatures;
};
export const serviceContent: Record<
  ServiceKey,
  {
    buttonText?: string;
    title: string;
    additionalDescription: string;
    listItem: string[];
    description: string;
    generalFeatures?: string[];
    advancedFeatures?: AdvancedFeatures;
    disclaimer?: string[];
    registration?: string;
    whyChooseUs?: WhyChooseUs[];
    whatWeOffer?: WhatWeOffer[];
    plans?: ServicePlan[];
    notes?: string;
    keyFeatures?: KeyFeatures[];
    href?: string;
    termsAndConditions?: string[];
  }
> = {
  "Intraday/BTST": {
    title: "Nifty Intraday/BTST Service",
    description: `Unlock the Potential for Higher Returns with Live Trading Calls – Stay Ahead in the Market!`,
    listItem: [
      "Our Intraday Trading Subscription Plan is specially designed for active traders who want disciplined and precise signals focused primarily on Nifty Index. Occasionally, we also provide high-conviction trades in Bank Nifty and Midcap Nifty when opportunities arise. The service includes more frequent Intraday calls, with BTST (Buy Today, Sell Tomorrow) recommendations shared selectively based on market conditions.",
      "We provide only the Index/Stock name and current cash market price (CMP) to ensure fair execution and avoid price spikes. You can choose to trade in the cash segment or Futures & Options based on your risk appetite and availability in the derivatives segment.",
    ],
    additionalDescription:
      "Please note: These signals are strictly intended for Intraday and BTST trading in Index/Equity.",
    keyFeatures: [
      "Monthly 15-20 Calls",
      "Entry Price",
      // "Exit Price",
      // "Stop Loss",
      // "First Target",
      // "Top Nifty 50 Companies",
      "Index Trades",
    ],
    whyChooseUs: [
      {
        title: "📈 Focused Index Trading:",
        info: "Concentrated on Nifty with occasional trades in Bank Nifty and Midcap Nifty – curated for market movers.",
      },
      {
        title: "🔔 Real-Time Trade Signals:",
        info: "Receive timely alerts with entry, exit, and stop-loss levels during trading hours. Our experts use a combination of in-house analysis and proven algorithms to deliver high-probability trades.",
      },
      {
        title: "🧠 Expert-Backed Recommendations:",
        info: "Led by Dr. Rakesh Bansal, our experienced team ensures each signal is backed by deep market insight and practical experience.",
      },
      {
        title: "✅ Simplified Strategies:",
        info: "Clear, no-jargon advice designed for quick action. We keep it simple, effective, and profitable.",
      },
      {
        title: "📊 Transparent Performance Reports:",
        info: "Access detailed reports to understand the rationale behind trades, track past performance, and learn through real examples.",
      },
      {
        title: "💼 Disciplined Trading Approach:",
        info: "Trade with confidence using our structured signals that include all key trade parameters—entry, target, and stop-loss.",
      },
    ],
    disclaimer: [
      "All our recommendations are backed by solid trading rationale, and we publish a monthly performance report on particular group or WhatsApp.",
    ],
    notes:
      "Start your journey to consistent trading success with our premium yet affordable subscription plan—only ₹999 per month. Get actionable insights, boost your confidence, and make better trading decisions with RKB Intraday/BTST.",
    registration:
      "Registration granted by SEBI, membership of a SEBI recognized supervisory body (if any) and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors",
    plans: [
      {
        duration: "Monthly",
        price: "Rs- 999/-",
      },
      { duration: "Quarterly", price: "Rs- 2,700/-" },
      { duration: "Yearly", price: "Rs- 9,999/-" },
    ],
    href: "https://rakeshbansal.rpy.club/g/KbkzwwjCcO",
  },
  "Index & Option": {
    title: "Master the Art of Options Buying and Index",
    description:
      "Options trading presents an enticing opportunity, but to succeed, you need a sophisticated skill set. In options buying, it's not just about predicting market trends, it's about timing your trades effectively. To ensure a seamless trading experience, we exclusively recommend options trading in the top Nifty 50 companies. We provide entry prices, exit prices, and stop-loss levels, empowering you to make confident and informed trading decisions. This strategic approach minimizes impact costs and ensures ample liquidity, allowing you to execute trades smoothly and efficiently.",
    additionalDescription: "",
    listItem: [],
    keyFeatures: [
      "Monthly 10-15 Calls",
      "Entry Price",
      "Exit Price",
      "Stop Loss",
      "First Target",
      "Top Nifty 50 Companies",
      "Nifty, Bank Nifty, FINNIFTY, & MIDCPNIFTY",
    ],
    whatWeOffer: [
      {
        title: "Expert-Backed Recommendations:",
        info: "Our trading ideas are powered by a unique blend of original intelligence and AI technology.",
      },
      {
        title: "Simplified Strategies:",
        info: "We are strong advocates of keeping it simple. Our recommendations focus solely on options buying, eliminating the complexities of naked selling or intricate strategies. This straightforward approach enhances your understanding and execution.",
      },
      {
        title: "Disciplined Trading:",
        info: "We firmly believe that over-trading can erode capital. We encourage disciplined trading, helping you avoid impulsive decisions and stay focused on strategic opportunities.",
      },
      {
        title: "Transparency and Reports:",
        info: "All our recommendations are backed by detailed trading rationale, and we publish a monthly options/index performance report on our website. This allows you to track our performance and gain further insights into our strategies.",
      },
    ],
    disclaimer: [
      "All our recommendations are backed by solid trading rationale, and we publish a monthly performance report on particular group or WhatsApp.",
    ],
    registration:
      "Registration granted by SEBI, membership of a SEBI recognized supervisory body (if any) and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors",
    plans: [
      { duration: "Monthly", price: "Rs- 1,999/-" },
      { duration: "Quarterly", price: "Rs- 5,500/-" },
      { duration: "Yearly", price: "Rs- 19,999/-" },
    ],
    href: "https://rakeshbansal.rpy.club/jcp/3vKH8YQCjS",
  },
  "Option & Intraday": {
    title: "Option & Intraday",
    href: "https://rakeshbansal.rpy.club/pick-package/NjXQphqSS",
    description:
      "Seize profitable market opportunities with our combined trading package, designed to help you excel in both options buying and intraday/BTST strategies. Whether you're aiming for short-term gains or a disciplined options approach, our expert-backed recommendations and real-time signals provide you with everything you need to trade confidently and strategically.",
    listItem: [],
    additionalDescription:
      "Join us today to master options buying and intraday trading with a disciplined, straightforward, and transparent approach. This is your chance to trade with confidence and enhance your profitability.",
    whatWeOffer: [
      {
        title: "Options Buying (Nifty 50 Focus):",
        info: "We offer precise entry, exit, and stop-loss levels for Nifty 50 companies, ensuring optimal liquidity and reduced impact costs. Our trading ideas are powered by a mix of human expertise and AI technology, focusing solely on options buying for simplified and effective strategies.",
      },
      {
        title: "Intraday/BTST Signals:",
        info: "Get real-time alerts for intraday and BTST trading opportunities, ideal for capturing single-day market movements. Trades are based on current cash market prices, helping you avoid price spikes and distribute load efficiently. You can choose to trade in the cash segment or Futures & Options, depending on stock availability.",
      },
    ],
    advancedFeatures: {
      Options: {
        price: "₹1,999/month",
        features: [
          "Monthly 10-15 Calls",
          "Entry Price, Exit Price, and Stop Loss provided for each trade.",
          "Covers Nifty, Bank Nifty, FINNIFTY, and MIDCPNIFTY for strategic options trading",
        ],
      },
      Intraday: {
        price: "₹999/month",
        features: [
          "Monthly 15-20 Calls",
          "Entry Price, Exit Price, Stop Loss, and First Target for each signal",
          "Focuses on top Nifty 50 companies for effective short-term trading.",
        ],
      },
    },
    whyChooseUs: [
      {
        title: "Expert-Backed Recommendations:",
        info: "Led by industry experts like Dr. Rakesh Bansal, our trading signals blend years of market experience with advanced algorithms, offering actionable insights you can trust.",
      },
      {
        title: "Simplified & Effective Strategies:",
        info: "We believe in keeping things simple, focusing solely on options buying and straightforward intraday trading strategies. This clarity helps you execute trades without unnecessary complexity.",
      },
      {
        title: "Disciplined Trading Approach:",
        info: "Avoid over-trading and manage risk effectively with our well-defined entry, exit, and stop-loss levels for each trade.",
      },
      {
        title: "Transparency & Reports:",
        info: "Track your progress with our monthly performance reports, offering a transparent view of our trading rationale and results.",
      },
    ],
    disclaimer: [
      "All our recommendations are backed by solid trading rationale, and we publish a monthly performance report on particular group or WhatsApp.",
    ],
    registration:
      "Registration granted by SEBI, membership of a SEBI recognized supervisory body (if any) and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors",
    plans: [
      { duration: "Monthly", price: "Rs- 1,999/-" },
      { duration: "Quarterly", price: "Rs- 5,500/-" },
      { duration: "Yearly", price: "Rs- 19,999/-" },
    ],
  },
  "Renko Charts": {
    title: "Renko Charts",
    href: "https://rakeshbansal.rpy.club/g/oFwngxvqJh",
    description: `Our RKB - Renko Charts Subscription Plan offers exclusive trading calls based on Renko Charts, detailed analysis, and timely market updates from Dr. Rakesh Bansal. Stay informed, spot opportunities, and enhance your trading skills. For personalized queries, visit <a  style={{ color: 'blue', textDecoration: 'none' }} href="https://learnrkb.in" target="_blank" rel="noopener noreferrer">learnrkb.in</a>. Join us for real-time insights and expert guidance to simplify your trading journey!`,
    listItem: [],
    additionalDescription: "",
    keyFeatures: [
      "Yearly 10-12 Calls",
      "Entry Price",
      "Exit Price",
      "Detailed Analysis",
      "Medium & Long Term Trade Signal",
      "Exclusive Community Forum Access",
      "Live Market Support",
    ],

    whyChooseUs: [
      {
        title: "Exclusive Trading Signals:",
        info: "Receive 10–12 high-conviction trading calls annually, carefully curated based on Renko Chart analysis.",
      },
      {
        title: "Complimentary Handholding:",
        info: "Enjoy 3 months of free access to expert guidance, market insights, and community support via a dedicated Telegram channel and the Learn RKB portal.",
      },
      {
        title: "Personalized Query Support:",
        info: "Ask up to 5 trading or market-related questions each month and get timely, expert responses from Dr. Rakesh Bansal’s team.",
      },
      {
        title: "Structured Learning:",
        info: "Access to resources and market insights designed to build your confidence in using Renko Charts effectively.",
      },
      {
        title: "Real-Time Updates:",
        info: "Stay updated with timely market insights, reports, and live trade signals to capitalize on emerging opportunities.",
      },
      {
        title: "Mentorship from Dr. Rakesh Bansal:",
        info: "Learn directly from an industry veteran and leverage proven strategies for trend analysis and trade execution.",
      },
      {
        title: "Enhanced Decision-Making:",
        info: "Simplify your trading strategy with clear, objective, and actionable signals from Renko Charts.",
      },
    ],
    disclaimer: [
      "All our recommendations are backed by solid trading rationale, and we publish a monthly performance report on particular group or, Learnrkb.in and WhatsApp.",
    ],
    registration:
      "Registration granted by SEBI, membership of a SEBI recognized supervisory body (if any) and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors",
    plans: [
      { duration: "Quarterly", price: "Rs- 1,499/-" },
      { duration: "Half-yearly", price: "Rs- 2,799/-" },
      { duration: "Yearly", price: "Rs- 5,299/-" },
    ],
  },
  Futures: {
    title: "Futures Service",
    href: "https://rakeshbansal.rpy.club/jcp/Z3WkEvk1L6",
    description: `We let the performance speak for itself. You can view our historical performance under the 
      "Performance" tab on our website. Here's what you gain from our Futures Trading Strategy:`,
    listItem: [],
    additionalDescription:
      "Join us today to master options buying and intraday trading with a disciplined, straightforward, and transparent approach. This is your chance to trade with confidence and enhance your profitability.",
    keyFeatures: [
      "Monthly 8-10 Calls",
      "Entry Price",
      "Exit Price",
      "Stop Loss",
      "Performance Reports",
      "Top Nifty 50 Companies",
    ],
    whyChooseUs: [
      {
        title: "Emotion-Free Trading:",
        info: "The trend is surely your friend, but emotions can be your enemies. We've developed a system to validate our views, avoiding the urge to chase every breakout or rack up minor gains. This approach ensures that our strategies are data-driven and not influenced by impulsive reactions.",
      },
      {
        title: "Focused on Winning Trades:",
        info: "We firmly believe that you only need a few big winning ideas to be successful in futures trading. Our recommendations come with a solid trading rationale and comprehensive reports. We share every signal with BUY/SELL signals, Expiry dates, Future CMP (Current Market Price), Cash CMP, Stop Loss (SL) and Lot Size. This information empowers you to make informed trading decisions with confidence.",
      },
      {
        title: "Limited and Monitored Trading Ideas:",
        info: "Our trading ideas are carefully selected and continuously monitored to meet margin requirements. This disciplined approach ensures that you have a manageable number of trades to consider.",
      },
      {
        title: "Regular Performance Reports:",
        info: "We maintain transparency by publishing monthly performance reports on our WhatsApp Or Particular group. This helps you track our results and assess the effectiveness of our strategies over time.",
      },
    ],
    disclaimer: [
      "All our recommendations are backed by solid trading rationale, and we publish a monthly performance report on particular group or WhatsApp.",
    ],
    registration:
      "Registration granted by SEBI, membership of a SEBI recognized supervisory body (if any) and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors",
    plans: [
      { duration: "Monthly", price: "Rs- 5,000/-" },
      { duration: "Quarterly", price: "Rs- 13,500/-" },
      { duration: "Yearly", price: "Rs- 50,000/-" },
    ],
  },

  Mentorship: {
    title: "Mentorship Service",
    href: "https://rakeshbansal.rpy.club/jcp/cjSFgnD01I",
    description:
      "Unlock Your Trading Potential with Our Comprehensive Mentorship Program!",
    additionalDescription:
      "Are you ready to take your trading journey to the next level? Our upgraded mentorship program offers you a range of powerful tools and insights to enhance your trading skills and profitability. We're dedicated to providing you with the knowledge and support you need to succeed in the dynamic world of the stock market.",
    listItem: [],
    keyFeatures: [
      "Quarterly 10-15 Calls",
      "Entry Price",
      "Exit Price",
      "Short & Medium Term",
      "Live Market Support",
    ],
    generalFeatures: [
      "Strategic Buy Ideas for Short to Medium Term: Our program equips you with carefully researched and analyzed cash market buy ideas that span the short to medium-term horizon. Supported by robust rationale and detailed reports, we provide entry price, exit price, and stop-loss levels, empowering you to make confident and informed trading decisions.",
      "Webinar Series for In-Depth Learning: To ensure your success, we conduct webinars that cater to problem-solving, address conceptual doubts, and tackle any queries you might have. Additionally, our webinar series includes real-life examples featuring shared videos showcasing real-life trading scenarios. These examples provide you with the conceptual understanding necessary to navigate the complexities of the stock market effectively.",
      "Mentorship Performance Reports: Our mentorship program provides transparency through quarterly and yearly performance reports, which will be published on our website. This allows you to track our performance and assess the program's overall effectiveness.",
    ],
    disclaimer: [
      "All our recommendations are backed by solid trading rationale, and we publish a monthly performance report on particular group or WhatsApp.",
    ],
    registration:
      "Registration granted by SEBI, membership of a SEBI recognized supervisory body (if any) and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors",
    plans: [
      { duration: "Monthly", price: "Rs- 3,800/-" },
      { duration: "Quarterly", price: "Rs- 9,999/-" },
      { duration: "Yearly", price: "Rs- 34,999/-" },
    ],
  },

  Commodity: {
    title: "Commodity Service",
    href: "https://rakeshbansal.rpy.club/jcp/atcYbhpxGM",
    description:
      "The MCX market offers vast potential, but it also demands discipline and a strategic approach. Our advisory provides you with the knowledge and support needed to make informed trading decisions with confidence. We offer precise entry prices, exit prices, and stop-loss levels, empowering you to trade with assurance.",
    listItem: [],
    additionalDescription:
      "Blending human intelligence with robust data-driven models, we guide you through the exciting world of MCX, focusing on gold, silver, crude oil, and other strategically chosen metals.",
    keyFeatures: [
      "Quarterly 10-15 Calls",
      "Entry Price",
      "Exit Price",
      "Stop Loss",
      "Performance Reports",
      "Short & Medium Term",
      "Silver, Zinc, Aluminium, Gold, Copper and Crude Oil",
    ],
    whyChooseUs: [
      {
        title: "Regular Updates:",
        info: "Receive timely signals and analysis to navigate the MCX market with confidence.",
      },
      {
        title: "Data-Driven Insights:",
        info: "Our quantitative models crunch the numbers, providing you with valuable trading opportunities.",
      },
      {
        title: "Strategic Risk Management:",
        info: "We prioritize calculated entries and exits, incorporating stop-loss levels to safeguard your capital.",
      },
      {
        title: "Transparency & Reports:",
        info: "Track your progress with our monthly performance reports, offering a transparent view of our trading rationale and results.",
      },
    ],
    disclaimer: [
      "All our recommendations are backed by solid trading rationale, and we publish a monthly commodities performance report on particular group or WhatsApp.",
    ],
    plans: [
      { duration: "Monthly", price: "Rs- 3,500/-" },
      { duration: "Quarterly", price: "Rs- 8,999/-" },
      { duration: "Yearly", price: "Rs- 31,999/-" },
    ],
  },

  HNI: {
    title: "Exclusive HNI Service",
    href: "https://forms.gle/diuYQdWGtuvjmvts8",
    description:
      "Our HNI (High Net-worth Individual) subscription is designed for serious investors seeking personalized insights, exclusive stock recommendations, and expert guidance tailored to maximize potential returns. This service gives you direct access to Rakesh Bansal Ventures' expertise, ensuring that you stay ahead in the dynamic stock market.",
    listItem: [],
    additionalDescription: `
      <b>What's Included:</b><br>
        <li>Blending human intelligence with robust data-driven models</li>
        <li>Exclusive Access to Telegram Channels:
            <li>HNI Channel</li>
            <li>Future Service Channel</li>
            <li>Mentorship Channel</li>
        </li>
   
        `,
    advancedFeatures: {
      Future: {
        features: [
          "10-15 calls per month",
          "Entry, Exit, and Stop Loss prices.",
          "Regular performance reports",
          "Focus on top Nifty 50 companies",
        ],
      },
      Mentorship: {
        features: [
          "10-15 calls per Quarter",
          "Entry &  Exit",
          "Short & Medium Term",
          "Focuses on top Nifty 50 companies for effective short-term trading.",
        ],
      },
    },
    whyChooseUs: [
      {
        title: "HNI Group Exclusive Benefits:",
        info: "Access to exclusive stock information and business insights Personalized entry and exit strategies for chosen shares Personalized discussions and one-on-one consultations based on pre-booked slots",
      },
      {
        title: "One-on-One Consultations:",
        info: "Exclusive one-on-one consultations with Dr. Rakesh Bansal may be available based on slot bookings and advisor discretion.",
      },
      {
        title: "Direct Access to Rakesh Bansal Ventures’ Senior Team:",
        info: "Get the facility to connect with a senior representative of the Rakesh Bansal Ventures team for personalized insights and discussions.",
      },
    ],
    disclaimer: [
      "Investment in securities market is subject to market risks. Read all the related documents carefully before investing.",
      "We don't guarantee any kind of Profit.",
      "Stock market involves risk and trade only if you are comfortable with risk.",
      "Please don't trade/invest based on our performance sheet, as past performance is not a guarantee for future performance.",
      "Our performance sheet is for our own satisfaction & transparency. You may or may not be able to buy/sell at our recommended price.",
      "Our humble request is to trade/invest according to your individual risk appetite.",
    ],

    plans: [
      {
        duration: "",
        price: "For Detail Discussion",
        buttonText: "Register Now",
      },
    ],
    notes:
      "100% payment in advance, no refunds applicable under any circumstances.",

    termsAndConditions: [
      "The fee is annual and payment is 100% advance and under no circumstances Rakesh Bansal Ventures (hereinafter referred to as Advisor) shall be liable for any refund for amount paid by the client.",
      "In case of any cancellation/termination from Client, the amount paid by the client shall be forfeited and Advisor shall not be liable to provide any more services to the client.",
      "The Client represents that the research advisory shall solely be used for own use and not shared with anyone under any circumstances, whatsoever.",
      "The services will not include portfolio management or any related services relating to sale/purchase of Equities/other financial instruments, the services shall remain pure research advisory based.",
      "There is no commitment of any profits under the scope of this service. Client has to understand the speculative and dynamic nature of stock market.",
      "Specific requests may be made by client to have one-on-one consultation with Dr. Rakesh Bansal with respect to research advisory. Such requests may be entertained at sole discretion of the Advisor.",
    ],
  },
};

// --- Slug to ServiceKey Mapping ---
/**
 * Central mapping from URL slug to ServiceKey.
 * Use this to fetch the correct service content based on the slug.
 */
export const serviceSlugToKey: Record<string, ServiceKey> = {
  "intraday-btst-plan": "Intraday/BTST",
  "options-plan": "Index & Option",
  "mentorship-plan": "Mentorship",
  "futures-plan": "Futures",
  "commodity-plan": "Commodity",
  "hni-service": "HNI",
};
