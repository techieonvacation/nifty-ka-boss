"use client";

import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink, MapPinHouse, Clock4 } from "lucide-react";


export default function CustomerGrievances() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 py-12">
      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-8 text-center">
            Customer Grievances
          </h1>

          <section className="max-w-6xl customer-01">
            <div className="details-row">
              <div className="spot-1"><h2 className="text-2xl font-semibold text-purple-700 mb-6">Designation</h2></div>
              <div className="spot-1"><h2 className="text-2xl font-semibold text-purple-700 mb-6">Contact Person</h2></div>
              <div className="spot-3"><h2 className="text-2xl font-semibold text-purple-700 mb-6">Details</h2></div>
            </div>
        	 			
           
{/*             <div className="details-row">
              <div className="spot-1">Customer Care</div>
              <div className="spot-1">Rakesh Kumar</div>
              <div className="spot-3">
              <p><span><MapPinHouse className="w-5 h-5 text-green-600" /></span>A-1/51, A1 Block, Lawrence Road Industrial Area, Keshav Puram, Tri Nagar,<br/>New Delhi-110035</p>
                <p><span><Phone className="w-5 h-5 text-green-600" /></span>+91-9560884223</p>
                <p><span><Mail className="w-5 h-5 text-green-600" /></span>wecare@iamrakeshbansal.com</p>
                <p><span><Clock4 className="w-5 h-5 text-green-600" /></span>10 am to 5pm Monday to Friday <br/>(closed on every national holiday and Saturday and Sunday)</p>
              </div>
            </div>
            <hr/> */}
            <div className="details-row">
              <div className="spot-1">Customer Care</div>
              <div className="spot-1">Preeti Rajput</div>
              <div className="spot-3">
              <p><span><MapPinHouse className="w-5 h-5 text-green-600" /></span>A-1/51, A1 Block, Lawrence Road Industrial Area, Keshav Puram, Tri Nagar,<br/>New Delhi-110035</p>
                <p><span><Phone className="w-5 h-5 text-green-600" /></span>+91-8851475191</p>
                <p><span><Mail className="w-5 h-5 text-green-600" /></span>wecare@iamrakeshbansal.com</p>
                <p><span><Clock4 className="w-5 h-5 text-green-600" /></span>10 am to 5pm Monday to Friday <br/>(closed on every national holiday and Saturday and Sunday)</p>
              </div>
            </div>
            <hr/>
            <div className="details-row">
              <div className="spot-1">Legal Consultant</div>
              <div className="spot-1">Adv. Anurag Gupta</div>
              <div className="spot-3">
              <p><span><MapPinHouse className="w-5 h-5 text-green-600" /></span>A-1/51, A1 Block, Lawrence Road Industrial Area, Keshav Puram, Tri Nagar,<br/>New Delhi-110035</p>
                <p><span><Phone className="w-5 h-5 text-green-600" /></span>+91-8586834560</p>
                <p><span><Mail className="w-5 h-5 text-green-600" /></span>legal@iamrakeshbansal.com</p>
                <p><span><Clock4 className="w-5 h-5 text-green-600" /></span>12 pm to 5pm Monday to Friday <br/>(closed on every national holiday and Saturday and Sunday)</p>
              </div>
            </div>
            <hr/>
            <div className="details-row">
              <div className="spot-1">Consultant</div>
              <div className="spot-1">Mr. Rahul Agrawal</div>
              <div className="spot-3">
              <p><span><MapPinHouse className="w-5 h-5 text-green-600" /></span>A-1/51, A1 Block, Lawrence Road Industrial Area, Keshav Puram, Tri Nagar,<br/>New Delhi-110035</p>
                <p><span><Mail className="w-5 h-5 text-green-600" /></span>rahul@iamrakeshbansal.com</p>
                <p><span><Clock4 className="w-5 h-5 text-green-600" /></span>12 pm to 5pm Monday to Friday <br/>(closed on every national holiday and Saturday and Sunday)</p>
              </div>
            </div>
            <hr/>
            <div className="details-row">
              <div className="spot-1">Principle Officer</div>
              <div className="spot-1">Dr. Rakesh Bansal</div>
              <div className="spot-3">
                <p><span><MapPinHouse className="w-5 h-5 text-green-600" /></span>A-1/51, A1 Block, Lawrence Road Industrial Area, Keshav Puram, Tri Nagar,<br/>New Delhi-110035</p>
                
                <p><span><Mail className="w-5 h-5 text-green-600" /></span>compliance@iamrakeshbansal.com</p>
                <p><span><Clock4 className="w-5 h-5 text-green-600" /></span>10 am to 5pm Monday to Friday <br/>(closed on every national holiday and Saturday and Sunday)</p>
              </div>
            </div>
            <hr />
          </section>

          {/* <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              In case of any complaints or queries, you may contact Rakesh
              Bansal Ventures at:
            </p>
            <div className="space-y-4">
              <motion.div
                className="flex items-center space-x-3 text-green-600"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Mail size={24} />
                <Link
                  href="mailto:wecare@iamrakeshbansal.com"
                  className="hover:underline"
                >
                  wecare@iamrakeshbansal.com
                </Link>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 text-green-600"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Phone size={24} />
                <Link href="tel:+919560884223" className="hover:underline">
                  +91-9560884223
                </Link>
              </motion.div>
            </div>
          </section> */}

          <section className=" p-2 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              SEBI Grievance Redressal
            </h2>
            <p className="text-gray-700 mb-4">
              If you are not satisfied with our response, you can lodge your
              grievances with SEBI:
            </p>
            <motion.a
              href="https://scores.sebi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-green-600 hover:underline mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ExternalLink size={24} />
              <span>SEBI Complaints Redress System (SCORES)</span>
            </motion.a>
            <p className="text-gray-700 mb-4">
              For any queries, feedback, or assistance, please contact SEBI's
              Toll-Free Helpline:
            </p>
            <div className="flex items-center space-x-3 text-green-600 mb-4">
              <Phone size={24} />
              <span>1800 22 7575 / 1800 266 7575</span>
            </div>
            <p className="text-gray-700 mb-4">
              SCORES can be accessed through mobile applications:
            </p>
            <motion.a
              href="https://play.google.com/store/apps/details?id=com.ionicframework.sebi236330"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-green-600 hover:underline"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ExternalLink size={24} />
              <span>Download SEBI SCORES App</span>
            </motion.a>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Online Dispute Resolution
            </h2>
            <p className="text-gray-700 mb-4">
              The ODR Portal is also available if you are unsatisfied with the
              response. Please refer to SEBI Circular No.
              SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131 dated July 31, 2023, on
              "Online Resolution of Disputes in the Indian Securities Market."
            </p>
            <p className="text-gray-700 mb-4">
              The common Online Dispute Resolution Portal (ODR Portal), which
              offers conciliation and online arbitration for resolving disputes
              in the Indian Securities Market, can be accessed via the following
              link:
            </p>
            <motion.a
              href="https://smartodr.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-green-600 hover:underline"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ExternalLink size={24} />
              <span>ODR Portal</span>
            </motion.a>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
