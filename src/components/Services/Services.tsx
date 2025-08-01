"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertTriangle,
  Clock,
  BarChart2,
  PieChart,
  DollarSign,
  BookOpen,
  // LightbulbIcon,
  // BriefcaseIcon,
  // HandshakeIcon,
  // CalendarIcon,
  // ClockIcon,
} from "lucide-react";
import { serviceContent, ServiceKey } from "./ServicesContent";

const fullDisclaimer = `
RAKESH BANSAL VENTURES is SEBI registered Research Entity in terms of SEBI (Research Analyst) Regulations, 2014 with SEBI Research Analyst No: INH100008984. We engage in the business of providing fundamental and technical reports including charts and other technical tools to identify market pattern aiming to provide an overview of the previous trading pattern and expectation from the future market.

<b>"Investment in securities market are subject to market risks. Read all the related documents carefully before investing."</b>

The information and views in the reports, our website <a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a> / & all the services ("Research Information") we provide are believed to be reliable, but we do not represent or warrant its accuracy, completeness or reliability of the information contained in our Research Information, investors and clients are advised to independently evaluate the market conditions/ risks involved, before making any trading/investment decisions.

The report / information / opinions have been prepared by us and are subject to change without any notice. The report and information contained herein is strictly confidential and meant solely for the selected recipient and may not be altered in any way, transmitted to, copied or distributed, in part or in whole, to any other person or to the media or reproduced in any form, without prior written consent of us. The information provided in the Report is from publicly available data, which we believe and reliable. While reasonable endeavors have been made to present reliable data in the Report so far as it relates to current and historical information, we are not guarantee the accuracy or completeness of the data in the Report. Accordingly, we or our partner's / relatives of our partner's shall not be in any way responsible for any loss or damage that may arise to any person from any inadvertent error in the information contained, views and opinions expressed in this publication.

Past performance should not be taken as an indication or guarantee of future performance, and no representation or warranty, express or implied, is made regarding future performance. The price, value of and income from any of the securities or financial instruments mentioned in this report can fall as well as rise.

The Report also includes analysis and views of our research team. The Report is purely for information purposes and does not construe to be investment recommendation/advice or an offer or solicitation of an offer to buy/sell any securities. The opinions expressed in the Report are our current opinions as of the date of the Report and may be subject to change from time to time without notice. We or any persons connected with us do not accept any liability arising from the use of this document.

Investors should not solely rely on the information contained in this Report and must make investment decisions based on their own investment objectives, judgment, risk profile and financial position. The recipients of this Report may take professional advice before acting on this information.

As we/ our partners are presently engaged in various financial services business and so might have financial, business or other interests in other entities including the subject company/ies mentioned in this Report. However, we have encourages independence in preparation of research report and strives to minimize conflict in preparation of research report. We/ Our Partner's and their relatives did not receive any compensation or other benefits from the subject company/ies mentioned in the Report or from a third party in connection with preparation of the Report. Accordingly, We/ Our Partner's and their relatives do not have any material conflict of interest at the time of publication of this Report.

It is confirmed that for giving these recommendations, we have not received any compensation from the companies mentioned herein in the preceding twelve months.

We/ Our Partner's and their relatives collectively do not own 1% or more of the actual / beneficial ownership of equity securities of the subject company/ies mentioned in the report as of the last day of the month preceding the publication of the research report.

We submit that no material disciplinary action has been taken on me by any regulatory authority impacting Equity Research activities.

By accessing <a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a>, you have read, understood and agree to be legally bound by the terms of the following disclaimer and user agreement:

<a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a> is not responsible for any errors, omissions, representations or any links on any of our pages. <a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a> does not endorse any advertisers on our web pages. Please verify the veracity of all information on your own before undertaking any alliance. This website contains articles contributed by several individuals. The views are exclusively their own and do not necessarily represent the views of the website or its management. The linked sites are not under our control and we are not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. <a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a> is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by us of the site.

There are risks associated with utilizing internet and short messaging system (SMS) based information and research dissemination services. Subscribers are advised to understand that the services can fail due to failure of hardware, software, and Internet connection. While we try our best that the messages are delivered in time to the subscribers Mobile Network, the delivery of these messages to the customer's mobile phone/handset is the responsibility of the customer's Mobile Network. SMS may be delayed and/or not delivered to the customer's mobile phone/handset on certain days, owing to technical reasons and <a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a> cannot be held responsible for the same.

<a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a> hereby expressly disclaims any implied warranties imputed by the laws of any jurisdiction. We consider ourselves and intend to be subject to the jurisdiction only of the court of Delhi in India. If you don't agree with any of our disclaimers above, please do not read the material on any of our pages. This site is specifically for users in the territory of India. Although the access to users outside India is not denied, <a href="https://www.iamrakeshbansal.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://www.iamrakeshbansal.com</a> shall have no legal liabilities whatsoever in any laws of any jurisdiction other than India. We reserve the right to make changes to our site and these disclaimers, terms, and conditions at any time.

The content of the website cannot be copied, reproduced, republished, uploaded, posted, transmitted or distributed for any non-personal use without obtaining prior permission from RAKESH BANSAL VENTURES. We reserve the right to terminate the accounts of subscribers/customers, who violate the proprietary rights, in addition to necessary legal action.

Please note that by surfing our website, submitting your details in our website you are authorizing RAKESH BANSAL VENTURES to contact you and send Promotional and Transactional communication even though you may be registered under National Do Not Call Registry established under the Telecom Unsolicited Commercial Communications Regulations 2007 or registered or may register under the National Customer Preference Register established under new regulation viz the Telecom Commercial Communications Customer Preference Regulations, 2010.

Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.

<b>RAKESH BANSAL VENTURES</b>

<b>SEBI Registered Research Analyst Registration Number: INH100008984</b> `;

interface ServiceProps {
  param: string;
}

const KeyboardEffect: React.FC<{ text: string }> = ({ text }) => {
  const controls = useAnimation();

  React.useEffect(() => {
    let isMounted = true;
    const animateText = async () => {
      try{
      if (!isMounted) return;
      await controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
      }));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!isMounted) return;
      await controls.start((i) => ({
        opacity: 0,
        y: 10,
        transition: { delay: (text.length - i) * 0.05 },
      }));
      await new Promise((resolve) => setTimeout(resolve, 500));
      animateText();
    }catch(error){
      console.log("error",error)
    }
    };
    animateText();
    return () => {
      isMounted = false; // Set the flag to false to avoid calling controls after unmount
      controls.stop(); // Stop any ongoing animations
    };
  }, [controls, text]);

  return (
    <div style={{ display: "flex", gap: "0.2rem" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          animate={controls}
          initial={{ opacity: 0, y: 10 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

const ServicesPage: React.FC<ServiceProps> = ({ param }) => {
  const [selectedService, setSelectedService] =
    useState<ServiceKey>("Intraday/BTST");
  const [content, setContent] = useState(serviceContent["Intraday/BTST"]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [sebiAgreed, setSebiAgreed] = useState(false);
  const [planAgreed, setPlanAgreed] = useState(false);
  useEffect(() => {
    if (param && param in serviceContent) {
      const serviceKey = param as ServiceKey;
      setSelectedService(serviceKey);
      setContent(serviceContent[serviceKey]);
    }
  }, [param]);


  useEffect(() => {
    if (agreed && planAgreed && sebiAgreed) {
      setDisclaimerAgreed(true);
    } else {
      setDisclaimerAgreed(false);
    }
  }, [agreed, planAgreed,sebiAgreed]);




  const handleSubscribe = () => {
    if (!disclaimerAgreed) {
      setShowDisclaimer(true);
    } else if (content.href) {
      window.location.href = content.href;
    }
  };

  const handleProceed = () => {
    if (content.href) {
      window.location.href = content.href;
    }
    setShowDisclaimer(false);
  };

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
    setDisclaimerAgreed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <ServiceHeader title={content.title} />
      <main className="container mx-auto px-4 py-8 lg:py-10">
        <AnimatePresence mode="wait">
          <motion.section
            key={selectedService}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="bg-white text-gray-800 rounded-lg p-4 shadow-xl"
          >
            <ServiceDescription content={content} />
            {content.keyFeatures && (
              <KeyFeatures features={content.keyFeatures} />
            )}
            {content.plans && (
              <PricingPlans
                plans={content.plans}
                onSubscribe={handleSubscribe}
                buttonText={content.buttonText ?? "Subscribe Now"}
              />
            )}
            {content.notes && <Notes text={content.notes} />}
            {content.generalFeatures && (
              <GeneralFeatures features={content.generalFeatures} />
            )}
            {content.advancedFeatures && (
              <AdvancedFeatures features={content.advancedFeatures} />
            )}
            {content.whyChooseUs && <WhyChooseUs items={content.whyChooseUs} />}
            {content.whatWeOffer && <WhatWeOffer items={content.whatWeOffer} />}
            {content.disclaimer && <Disclaimer text={content.disclaimer} />}
            {content.registration && (
              <Registration text={content.registration} />
            )}

            {content.termsAndConditions && (
              <TermsAndConditions text={content.termsAndConditions} />
            )}
          </motion.section>
        </AnimatePresence>
      </main>
      <DisclaimerModal
        show={showDisclaimer}
        onClose={handleCloseDisclaimer}
        agreed={agreed}
        planagreed={planAgreed}
        disclaimerAgreed={disclaimerAgreed}
        setAgreed={setAgreed}
        sebiAgreed={sebiAgreed}
        setSebiAgreed={setSebiAgreed}
        setPlanAgreed={setPlanAgreed}
        handleProceed={handleProceed}
      />
    </div>
  );
};

const ServiceHeader: React.FC<{ title: string }> = ({ title }) => (
  <motion.header
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-purple-800 to-gray-600 py-5 lg:py-10"
  >
    <div className="absolute inset-0 z-0">
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="w-full h-full opacity-10 object-contain object-top"
        style={{
          backgroundImage: 'url("/images/fyi.png")',
          backgroundSize: "200% 200%",
        }}
      />
    </div>

    <div className="z-10 flex flex-col items-center">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
          <KeyboardEffect text={title.toUpperCase()} />
        </h1>
      </motion.div>
    </div>
  </motion.header>
);

const ServiceDescription: React.FC<{
  content: (typeof serviceContent)[ServiceKey];
}> = ({ content }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-600">
        {content.title}
      </h2>
      
      {content.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 font-light text-sm sm:text-base list-disc list-inside"
          dangerouslySetInnerHTML={{ __html: content.description }}
        />

      )}
      {/* </motion.p> */}

      {content.listItem && (
      <ul className="mb-6">
    {content.listItem.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
      )}
      {content.additionalDescription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 font-light text-sm sm:text-base list-disc list-inside"
          dangerouslySetInnerHTML={{ __html: content.additionalDescription }}
        />
      )}
    </div>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center"
    >
      <Image
        src="/images/service-page-img.webp"
        alt="Rakesh Bansal"
        width={500}
        height={500}
        className="rounded-full shadow-2xl"
      />
    </motion.div>
  </div>
);

const KeyFeatures: React.FC<{ features: string[] }> = ({ features }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mt-12 mb-8"
  >
    <h3 className="text-2xl font-semibold mb-6 text-indigo-600">
      Key Features
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-purple-50 rounded-lg px-4 py-2 shadow-md"
        >
          <div className="flex items-center">
            <div className="bg-indigo-500 rounded-full p-2 mr-4">
              {index === 0 && (
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
              {index === 1 && (
                <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
              {index === 2 && (
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
              {index === 3 && (
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
              {index > 3 && (
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-green-700">
              {feature.split(":")[0]}
            </h4>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const CustomCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 rounded-lg p-3 lg:p-4 shadow-xl mb-8"
  >
    <h3 className="text-2xl font-semibold mb-4 text-indigo-600">{title}</h3>
    {children}
  </motion.div>
);

const CustomAccordion: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-indigo-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GeneralFeatures: React.FC<{ features: string[] }> = ({ features }) => (
  <CustomCard title="General Features">
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center space-x-2"
        >
          <Check className="w-5 h-5 text-green-500" />
          <span>{feature}</span>
        </motion.li>
      ))}
    </ul>
  </CustomCard>
);

const AdvancedFeatures: React.FC<{
  features: Record<string, { price?: string; features: string[] }>;
}> = ({ features }) => (
  <CustomCard title="Advanced Features">
    {Object.entries(features).map(([key, value], index) => (
      <CustomAccordion
        key={index}
        title={`${key.charAt(0).toUpperCase() + key.slice(1)} Service`}
      >
        <p className="font-semibold mb-2 text-indigo-600">
          Price: {value.price}
        </p>
        <ul className="space-y-2">
          {value.features.map((feature, featureIndex) => (
            <motion.li
              key={featureIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
              className="flex items-center space-x-2"
            >
              <Check className="w-5 h-5 text-green-500" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </CustomAccordion>
    ))}
  </CustomCard>
);

const WhyChooseUs: React.FC<{ items: { title: string; info: string }[] }> = ({
  items,
}) => (
  <CustomCard title="Why Choose Us">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg p-2 shadow-md"
        >
          <h4 className="font-semibold text-indigo-600 mb-2 text-base lg:text-lg">
            {item.title}
          </h4>
          <p className="text-gray-600 font-light text-sm lg:text-base">
            {item.info}
          </p>
        </motion.div>
      ))}
    </div>
  </CustomCard>
);

const WhatWeOffer: React.FC<{ items: { title: string; info: string }[] }> = ({
  items,
}) => (
  <CustomCard title="What We Offer">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <h4 className="font-semibold text-indigo-600 mb-2">{item.title}</h4>
          <p className="text-gray-600">{item.info}</p>
        </motion.div>
      ))}
    </div>
  </CustomCard>
);

const PricingPlans: React.FC<{
  plans: {
    buttonText?: string;
    duration: string;
    price: string;
  }[];
  onSubscribe: () => void;
  buttonText: string;
}> = ({ plans, onSubscribe }) => {
  const isSinglePlan = plans.length === 1;
  return (
    <CustomCard title="Pricing Plans">
      <div className="flex flex-wrap gap-6 items-center justify-center">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-lg p-6 shadow-md w-full h-full max-w-[250px] max-h-[250px]"
            style={{
              backgroundImage: `url(${getPlanBackgroundImage(
                plan.duration,
                isSinglePlan
              )})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h4 className="text-xl font-semibold mb-2 text-white">
              {plan.duration}
            </h4>
            <p className="text-3xl font-bold mb-4 text-white">{plan.price}</p>
            <button
              onClick={onSubscribe}
              className="w-full bg-background border border-border text-foreground py-2 px-4 rounded transition-colors duration-300 hover:bg-opacity-80"
            >
              {plan.buttonText ? plan.buttonText : "Subscribe Now"}
            </button>
          </motion.div>
        ))}
      </div>
    </CustomCard>
  );
};

const Disclaimer: React.FC<{ text: string[] }> = ({ text }) => (
  <CustomCard title="Disclaimer">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start space-x-2 text-yellow-600"
    >
      <div className="flex items-start space-x-2 text-yellow-600">
        <AlertTriangle className="w-6 h-6 flex-shrink-0 text-yellow-500" />
        <ul className="list-inside space-y-2 text-sm md:text-base text-red-600">
          {text.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 font-semibold">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  </CustomCard>
);

const TermsAndConditions: React.FC<{ text: string[] }> = ({ text }) => (
  <CustomCard title="Terms and Conditions">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start space-x-2 text-yellow-600"
    >
      <ul className="list-inside space-y-2 text-sm md:text-base text-red-600">
        {text.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 font-semibold">•</span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  </CustomCard>
);

const Registration: React.FC<{ text: string }> = ({ text }) => (
  <CustomCard title="Registration Information">
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-blue-600 text-sm md:text-base"
    >
      {text}
    </motion.p>
  </CustomCard>
);

const Notes: React.FC<{ text: string }> = ({ text }) => (
  <CustomCard title="Join Us Today!">
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-green-600 text-sm md:text-base"
    >
      {text}
    </motion.p>
  </CustomCard>
);

const DisclaimerModal: React.FC<{
  show: boolean;
  onClose: () => void;
  sebiAgreed: boolean;
  agreed: boolean;
  planagreed: boolean;
  disclaimerAgreed:boolean;
  setAgreed: (agreed: boolean) => void;
  setSebiAgreed: (sebiAgreed: boolean) => void;
  setPlanAgreed: (planagreed: boolean) => void;
  handleProceed: () => void;
}> = ({ show, onClose, agreed,sebiAgreed,setSebiAgreed, setAgreed, handleProceed, planagreed, setPlanAgreed,disclaimerAgreed }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white text-gray-800 p-6 rounded-lg max-w-4xl w-full h-[60vh] md:h-[80vh] lg:h-[90vh] flex flex-col relative"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-600">Disclaimer</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div
            className="text-base font-light text-gray-800 overflow-y-auto p-4 bg-gray-100 rounded-lg"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: fullDisclaimer }}
          />
          <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="mt-6 flex flex-row sm:flex-col justify-between space-y-4 sm:space-y-2 sm:space-x-4">
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">
                I agree to the above terms and conditions
              </span>
            </label>
            <label className="flex items-center"style={{marginLeft:'0px'}}>
              <input
                type="checkbox"
                checked={sebiAgreed}
                onChange={(e) => setSebiAgreed(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">
                I agree to the <a style={{color:'blue'}}href="/sebi-terms-conditions" target="_blank"> SEBI Most Important Terms and Conditions (MITC) </a>
              </span>
            </label>
            <label className="flex items-center" style={{marginLeft:'0px'}}>
              <input
                type="checkbox"
                checked={planagreed}
                onChange={(e) => setPlanAgreed(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">
                I confirm that I am the only person in my family who has subscribed to this plan.
              </span>
            </label>
            </div>
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-white bg-gray-400 hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
              {/* <button
                onClick={handleProceed}
                disabled={!agreed}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  agreed ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400"
                }`}
              > */}
              <button
                onClick={handleProceed}
                disabled={!disclaimerAgreed}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${disclaimerAgreed
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400"
                  }`}
              >
                Proceed
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
function getPlanBackgroundImage(
  duration: string,
  isSinglePlan: boolean
): string {
  if (isSinglePlan) {
    return "/images/dream-card1.png";
  }
  switch (duration.toLowerCase()) {
    case "monthly":
      return "/images/dream-card1.png";
    case "quarterly":
      return "/images/dream-card2.png";
    case "yearly":
      return "/images/dream-card3.png";
    default:
      return "/images/dream-card1.png";
  }
}
export default ServicesPage;