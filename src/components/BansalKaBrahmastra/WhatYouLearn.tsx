import { BookOpen, LineChart, Search, TrendingUp } from "lucide-react";

export default function WhatYouLearn() {
  const learningPoints = [
    {
      title: "Chart Reading",
      description:
        "Learn how to read charts and identify trading opportunities",
      icon: <LineChart className="h-6 w-6 text-primary-foreground" />,
    },
    {
      title: "Screening Tools",
      description: "Master TradingView & Chartink to screen stocks effectively",
      icon: <Search className="h-6 w-6 text-primary-foreground" />,
    },
    {
      title: "Algo-Based Scanner",
      description:
        "Implement Dr. Bansal's personal scanner with real-time tested algos",
      icon: <BookOpen className="h-6 w-6 text-primary-foreground" />,
    },
    {
      title: "Predictive Analysis",
      description: "Discover how to find stocks before the move happens",
      icon: <TrendingUp className="h-6 w-6 text-primary-foreground" />,
    },
  ];

  return (
    <section className="py-16 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 flex flex-col justify-center  items-center md:items-start">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left text-foreground font-montserrat">
              What You'll Learn
            </h2>
            <p className="text-muted-foreground mb-6 text-center md:text-left">
              Our comprehensive curriculum is designed to transform beginners
              into confident traders through practical, actionable lessons.
            </p>
            <div className="h-1 w-20 bg-accent rounded-full"></div>
          </div>

          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPoints.map((point, index) => (
              <div
                key={index}
                className="bg-background rounded-lg p-6 shadow-md border-l-4 border-accent"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-primary p-2 rounded-md">
                    {point.icon}
                  </div>
                  <h3 className="font-bold text-lg text-foreground font-inter dark:text-amber-400">
                    {point.title}
                  </h3>
                </div>
                <p className="text-slate-600 font-inter">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
