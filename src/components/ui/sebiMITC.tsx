"use client";

import { motion } from "framer-motion";

export default function SEBIMITC() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 py-12">
      <main className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700 mb-8 text-center">
          SEBI Most Important Terms and Conditions (MITC)
          </h1>
         

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-lg"
            >
             RAs shall disclose to the client the terms and conditions of the research services offered
including rights and obligations. RAs shall ensure that neither any research service is
rendered nor any fee is charged until consent is received from the client on the terms
and conditions.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-lg"
            >
              1. <b>Availing the research services:</b> By accepting delivery of the research service, the
client confirms that he/she has elected to subscribe the research service of the RA
at his/her sole discretion. RA confirms that research services shall be rendered in
accordance with the applicable provisions of the RA Regulations.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-lg"
            >
              2. <b>Obligations on RA:</b> RA and client shall be bound by SEBI Act and all the applicable
rules and regulations of SEBI, including the RA Regulations and relevant
notifications of Government, as may be in force, from time to time. 
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-lg"
            >
             3. <b>Client Information and KYC:</b> The client shall furnish all such details in full as may
be required by the RA in its standard form with supporting details, if required, as may
be made mandatory by RAASB/SEBI from time to time.
RA shall collect, store, upload and check KYC records of the clients with KYC
Registration Agency (KRA) as specified by SEBI from time to time. 
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-lg"
            >
              4. <b>Standard Terms of Service:</b> The consent of client shall be taken on the following
              understanding:
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              “I / We have read and understood the terms and conditions applicable to a
research analyst as defined under regulation 2(1)(u) of the SEBI (Research
Analyst) Regulations, 2014, including the fee structure.<br></br><br></br>I/We are subscribing to the research services for our own benefits and
consumption, and any reliance placed on the research report provided by
research analyst shall be as per our own judgement and assessment of the
conclusions contained in the research report.<br></br><br></br>
I/We understand that – <br></br><br></br>

i. Any investment made based on the recommendations in the research report
are subject to market risk.<br></br><br></br>
ii. Recommendations in the research report do not provide any assurance of
returns.<br></br><br></br>
iii. There is no recourse to claim any losses incurred on the investments made
based on the recommendations in the research report.”<br></br><br></br>
<b>Declaration of the RA that:</b><br></br><br></br>
i. It is duly registered with SEBI as an RA pursuant to the SEBI (Research
Analysts) Regulations, 2014 and its registration details are: (registration
number, registration date);<br></br><br></br>
ii. It has registration and qualifications required to render the services
contemplated under the RA Regulations, and the same are valid and
subsisting;<br></br><br></br>
iii. Research analyst services provided by it do not conflict with or violate any
provision of law, rule or regulation, contract, or other instrument to which it is a
party or to which any of its property is or may be subject;<br></br><br></br>
iv. The maximum fee that may be charged by RA is ₹1.51 lakhs per annum per
family of client.<br></br><br></br>
v. The recommendations provided by RA do not provide any assurance of
returns.<br></br><br></br>
<b>Additionally, if RA is an individual, declaration that:</b><br></br><br></br>
i. It is not engaged in any additional professional or business activities, on a
whole-time basis or in an executive capacity, which interfere with/influence or
have the potential to interfere with/influence the independence of research
report and/or recommendations contained therein. 
            </motion.p>
           

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              5. <b>Consideration and mode of payment:</b> The client shall duly pay to RA, the agreed
fees for the services that RA renders to the client and statutory charges, as
applicable. Such fees and statutory charges shall be payable through the specified
manner and mode(s)/ mechanism(s)
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              6. <b>Risk factors:</b> (A statement covering the standard risks associated with investment
                in securities to be added under this clause by the RA) 
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              7. <b>Conflict of interest:</b> The RA shall adhere to the applicable regulations/ circulars/
directions specified by SEBI from time to time in relation to disclosure and mitigation
of any actual or potential conflict of interest. (A statement covering the mandatory
disclosures to be added under this clause by the RA.) 
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              8. <b>Termination of service and refund of fees:</b> Disclosure that the RA may suspend
or terminate rendering of research services to client on account of suspension/
cancellation of registration of RA by SEBI and shall refund the residual amount to
the client.<br></br>In case of suspension of certificate of registration of the RA for more than 60 (sixty)
days or cancellation of the RA registration, RA shall refund the fees, on a pro rata
basis for the period from the effective date of cancellation/ suspension to end of the
subscription period.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              9. <b>Grievance redressal and dispute resolution:</b> Any grievance related to <br></br>(i) nonreceipt of research report or<br></br> (ii) missing pages or inability to download the entire
report, or <br></br> (iii) any other deficiency in the research services provided by RA, shall be
escalated promptly by the client to the person/employee designated by RA, in this
behalf (RA to provide name and e-mail ID of the designated person/employee).
<br></br><br></br>The RA shall be responsible to resolve grievances within 7 (seven) business
working days or such timelines as may be specified by SEBI under the RA
Regulations.<br></br><br></br>
RA shall redress grievances of the client in a timely and transparent manner.<br></br><br></br>
Any dispute between the RA and his client may be resolved through arbitration or
through any other modes or mechanism as specified by SEBI from time to time. 
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              10. <b>Additional clauses:</b> All additional voluntary clauses added by the RA should not be
in contravention with rules/ regulations/ circulars of SEBI. Any changes in such
voluntary clauses/document(s) shall be preceded by a notice of 15 days
            </motion.p>
           
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
            11. <b>Mandatory notice:</b> Clients shall be requested to go through Do’s and Don’ts while
dealing with RA as specified in SEBI master circular no. SEBI/HO/MIRSD-POD1/P/CIR/2024/49 dated May 21, 2024 or as may be specified by SEBI from time to
time.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              12. <b> Most Important Terms and Conditions (MITC):</b> RA shall also disclose MITC to
their clients which shall be standardised by Industry Standards Forum (ISF) in
consultation with SEBI and RAASB.<br></br><br></br>
RAs/research entity shall also include the following disclosure as part of the terms
and conditions in their MITC: <br></br><br></br>
“The terms and conditions and the consent thereon are for the research services
provided by the RA and RA cannot execute/ carry out any trade (purchase/ sell
transaction) on behalf of the client. Thus, you are advised not to permit RA to
execute any trade on your behalf.” 

            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg"
            >
              13. <b>Optional Centralised Fee Collection Mechanism:</b> RA Shall provide the guidance
to their clients on an optional ‘Centralised Fee Collection Mechanism for IA and RA’
(CeFCoM) available to them for payment of fees to RA
            </motion.p>
          </section>

        </motion.div>
      </main>
    </div>
  );
}
