"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${className}`}
    {...props}
  />
);

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div
    className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

interface Section {
  title: string;
  content: string;
}

export default function Disclaimer() {
  const [searchTerm, setSearchTerm] = useState("");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const sections: Section[] = [
    {
      title: "General Information",
      content:
        "RAKESH BANSAL VENTURES is SEBI registered Research Entity in terms of SEBI (Research Analyst) Regulations, 2014 with SEBI Research Analyst No: INH100008984. We engage in the business of providing fundamental and technical reports including charts and other technical tools to identify market pattern aiming to provide an overview of the previous trading pattern and expectation from the future market.",
    },
    {
      title: "Investment Risks",
      content:
        "Investment in securities market are subject to market risks. Read all the related documents carefully before investing.",
    },
    {
      title: "Information Reliability",
      content:
        'The information and views in the reports, our website https://www.iamrakeshbansal.com / & all the services ("Research Information") we provide are believed to be reliable, but we do not represent or warrant its accuracy, completeness or reliability of the information contained in our Research Information, investors and clients are advised to independently evaluate the market conditions/ risks involved, before making any trading/investment decisions.',
    },
    {
      title: "Confidentiality",
      content:
        "The report / information / opinions have been prepared by us and are subject to change without any notice. The report and information contained herein is strictly confidential and meant solely for the selected recipient and may not be altered in any way, transmitted to, copied or distributed, in part or in whole, to any other person or to the media or reproduced in any form, without prior written consent of us.",
    },
    {
      title: "Data Sources",
      content:
        "The information provided in the Report is from publicly available data, which we believe and reliable. While reasonable endeavors have been made to present reliable data in the Report so far as it relates to current and historical information, we are not guarantee the accuracy or completeness of the data in the Report.",
    },
    {
      title: "Liability",
      content:
        "Accordingly, we or our partner's / relatives of our partner's shall not be in any way responsible for any loss or damage that may arise to any person from any inadvertent error in the information contained, views and opinions expressed in this publication.",
    },
    {
      title: "Past Performance",
      content:
        "Past performance should not be taken as an indication or guarantee of future performance, and no representation or warranty, express or implied, is made regarding future performance. The price, value of and income from any of the securities or financial instruments mentioned in this report can fall as well as rise.",
    },
    {
      title: "Research Team",
      content:
        "The Report also includes analysis and views of our research team. The Report is purely for information purposes and does not construe to be investment recommendation/advice or an offer or solicitation of an offer to buy/sell any securities. The opinions expressed in the Report are our current opinions as of the date of the Report and may be subject to change from time to time without notice.We or any persons connected with us do not accept any liability arising from the use of this document.",
    },
    {
      title: "Investors",
      content:
        "Investors should not solely rely on the information contained in this Report and must make investment decisions based on their own investment objectives, judgment, risk profile and financial position. The recipients of this Report may take professional advice before acting on this information.",
    },
    {
      title: "Independence",
      content:
        "As we/ our partners are presently engaged in various financial services business and so might have financial, business or other interests in other entities including the subject company/ies mentioned in this Report. However, we have encourages independence in preparation of research report and strives to minimize conflict in preparation of research report. We/ Our Partner’s and their relatives did not receive any compensation or other benefits from the subject company/ies mentioned in the Report or from a third party in connection with preparation of the Report. Accordingly, We/ Our Partner’s and their relatives do not have any material conflict of interest at the time of publication of this Report.",
    },
    {
      title: "Consent",
      content: `It is confirmed that for giving these recommendations, we have not received any compensation from the companies mentioned herein in the preceding twelve months.

We/ Our Partner’s and their relatives collectively do not own 1% or more of the actual / beneficial ownership of equity securities of the subject company/ies mentioned in the report as of the last day of the month preceding the publication of the research report.

We submit that no material disciplinary action has been taken on me by any regulatory authority impacting Equity Research activities.`,
    },
    {
      title: "Website Access",
      content: `By accessing https://www.iamrakeshbansal.com/, you have read, understood and agree to be legally bound by the terms of the following disclaimer and user agreement:
        
        https://www.iamrakeshbansal.com/ is not responsible for any errors, omissions, representations or any links on any of our pages. https://www.iamrakeshbansal.com/ does not endorse any advertisers on our web pages. Please verify the veracity of all information on your own before undertaking any alliance. This website contains articles contributed by several individuals. The views are exclusively their own and do not necessarily represent the views of the website or its management. The linked sites are not under our control and we are not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. https://www.iamrakeshbansal.com/ is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by us of the site.`,
    },
    {
      title: "Risks of Online Services",
      content:
        "There are risks associated with utilizing internet and short messaging system (SMS) based information and research dissemination services. Subscribers are advised to understand that the services can fail due to failure of hardware, software, and Internet connection. While we try our best that the messages are delivered in time to the subscribers Mobile Network, the delivery of these messages to the customer’s mobile phone/handset is the responsibility of the customer’s Mobile Network. SMS may be delayed and/or not delivered to the customer’s mobile phone/handset on certain days, owing to technical reasons and https://www.iamrakeshbansal.com/ cannot be held responsible for the same.",
    },
    {
      title: "Warranty",
      content:
        "https://www.iamrakeshbansal.com/ hereby expressly disclaims any implied warranties imputed by the laws of any jurisdiction. We consider ourselves and intend to be subject to the jurisdiction only of the court of Delhi in India. If you don’t agree with any of our disclaimers above, please do not read the material on any of our pages. This site is specifically for users in the territory of India. Although the access to users outside India is not denied, https://www.iamrakeshbansal.com/ shall have no legal liabilities whatsoever in any laws of any jurisdiction other than India. We reserve the right to make changes to our site and these disclaimers, terms, and conditions at any time.",
    },
    {
      title: "Intellectual Property",
      content:
        "The content of the website cannot be copied, reproduced, republished, uploaded, posted, transmitted or distributed for any non-personal use without obtaining prior permission from RAKESH BANSAL VENTURES. We reserve the right to terminate the accounts of subscribers/customers, who violate the proprietary rights, in addition to necessary legal action.",
    },
    {
      title: "Communication Consent",
      content:
        "Please note that by surfing our website, submitting your details in our website you are authorizing RAKESH BANSAL VENTURES to contact you and send Promotional and Transactional communication even though you may be registered under National Do Not Call Registry established under the Telecom Unsolicited Commercial Communications Regulations 2007 or registered or may register under the National Customer Preference Register established under new regulation viz the Telecom Commercial Communications Customer Preference Regulations, 2010.",
    },
    {
      title: "SEBI Registration",
      content: `Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.

RAKESH BANSAL VENTURES

SEBI Registered Research Analyst Registration Number: INH100008984`,
    },
  ];

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const makeLinksClickable = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <Link
          key={i}
          href={part}
          className="text-purple-600 hover:text-purple-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </Link>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white">
      <main className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-8 sm:mb-12" {...fadeInUp}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-purple-600">
            Important Notice
          </h2>
          <motion.div
            className="flex items-center justify-center space-x-2 mb-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <span className="font-semibold text-sm sm:text-base text-black">
              Disclaimer
            </span>
          </motion.div>
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search disclaimer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border-purple-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
            initial="initial"
            animate="animate"
          >
            {filteredSections.map((section, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-purple-600">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm text-gray-600"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {makeLinksClickable(section.content)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
