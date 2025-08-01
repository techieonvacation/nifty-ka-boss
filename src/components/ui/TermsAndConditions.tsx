"use client";

import { motion } from "framer-motion";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 py-12">
      <main className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-8 text-center">
            Terms and Conditions
          </h1>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-lg"
            >
              Welcome to Rakesh Bansal Ventures! These terms and conditions
              outline the rules and regulations for the use of Rakesh Bansal
              Ventures.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              By using this app we assume you accept these terms and conditions.
              Do not continue to use Rakesh Bansal Ventures if you do not agree
              to take all of the terms and conditions stated on this page.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              The following terminology applies to these Terms and Conditions,
              Privacy Statement and Disclaimer Notice and all Agreements:
              "Client", "You" and "Your" refers to you, the person log on this
              website and compliant to the Company's terms and conditions. "The
              Company", "Ourselves", "We", "Our" and "Us", refers to our
              Company. "Party", "Parties", or "Us", refers to both the Client
              and ourselves. All terms refer to the offer, acceptance and
              consideration of payment necessary to undertake the process of our
              assistance to the Client in the most appropriate manner for the
              express purpose of meeting the Client's needs in respect of
              provision of the Company's stated services, in accordance with and
              subject to, prevailing law of Netherlands. Any use of the above
              terminology or other words in the singular, plural, capitalization
              and/or he/she or they, are taken as interchangeable and therefore
              as referring to same.
            </motion.p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              License
            </h2>
            <p className="mb-4">
              Unless otherwise stated, Rakesh Bansal Ventures and/or its
              licensors own the intellectual property rights for all material on
              Rakesh Bansal Ventures. All intellectual property rights are
              reserved. You may access this from Rakesh Bansal Ventures for your
              own personal use subjected to restrictions set in these terms and
              conditions.
            </p>
            <p className="mb-4">You must not:</p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>Republish material from Rakesh Bansal Ventures</li>
              <li>
                Sell, rent or sub-license material from Rakesh Bansal Ventures
              </li>
              <li>
                Reproduce, duplicate or copy material from Rakesh Bansal
                Ventures
              </li>
              <li>Redistribute content from Rakesh Bansal Ventures</li>
            </ul>
            <p>This Agreement shall begin on the date hereof.</p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Comments
            </h2>
            <p className="mb-4">
              Parts of this app offer an opportunity for users to post and
              exchange opinions and information in certain areas of the website.
              Rakesh Bansal Ventures does not filter, edit, publish or review
              Comments prior to their presence on the website. Comments do not
              reflect the views and opinions of Rakesh Bansal Ventures, its
              agents and/or affiliates. Comments reflect the views and opinions
              of the person who post their views and opinions. To the extent
              permitted by applicable laws, Rakesh Bansal Ventures shall not be
              liable for the Comments or for any liability, damages or expenses
              caused and/or suffered as a result of any use of and/or posting of
              and/or appearance of the Comments on this website.
            </p>
            <p className="mb-4">
              Rakesh Bansal Ventures reserves the right to monitor all Comments
              and to remove any Comments which can be considered inappropriate,
              offensive or causes breach of these Terms and Conditions.
            </p>
            <p className="mb-4">You warrant and represent that:</p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>
                You are entitled to post the Comments on our App and have all
                necessary licenses and consents to do so;
              </li>
              <li>
                The Comments do not invade any intellectual property right,
                including without limitation copyright, patent or trademark of
                any third party;
              </li>
              <li>
                The Comments do not contain any defamatory, libelous, offensive,
                indecent or otherwise unlawful material which is an invasion of
                privacy
              </li>
              <li>
                The Comments will not be used to solicit or promote business or
                custom or present commercial activities or unlawful activity.
              </li>
            </ul>
            <p>
              You hereby grant Rakesh Bansal Ventures a non-exclusive license to
              use, reproduce, edit and authorize others to use, reproduce and
              edit any of your Comments in any and all forms, formats or media.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Hyperlinking to our App
            </h2>
            <p className="mb-4">
              The following organizations may link to our App without prior
              written approval:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>
                Online directory distributors may link to our App in the same
                manner as they hyperlink to the Websites of other listed
                businesses; and
              </li>
              <li>
                System wide Accredited Businesses except soliciting non-profit
                organizations, charity shopping malls, and charity fundraising
                groups which may not hyperlink to our Web site.
              </li>
            </ul>
            <p className="mb-4">
              These organizations may link to our home page, to publications or
              to other App information so long as the link: (a) is not in any
              way deceptive; (b) does not falsely imply sponsorship, endorsement
              or approval of the linking party and its products and/or services;
              and (c) fits within the context of the linking party's site.
            </p>
            <p className="mb-4">
              We may consider and approve other link requests from the following
              types of organizations:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>
                commonly-known consumer and/or business information sources;
              </li>
              <li>dot.com community sites;</li>
              <li>associations or other groups representing charities;</li>
              <li>online directory distributors;</li>
              <li>internet portals;</li>
              <li>accounting, law and consulting firms; and</li>
              <li>educational institutions and trade associations.</li>
            </ul>
            <p className="mb-4">
              We will approve link requests from these organizations if we
              decide that: (a) the link would not make us look unfavorably to
              ourselves or to our accredited businesses; (b) the organization
              does not have any negative records with us; (c) the benefit to us
              from the visibility of the hyperlink compensates the absence of
              Rakesh Bansal Ventures; and (d) the link is in the context of
              general resource information.
            </p>
            <p className="mb-4">
              These organizations may link to our App so long as the link: (a)
              is not in any way deceptive; (b) does not falsely imply
              sponsorship, endorsement or approval of the linking party and its
              products or services; and (c) fits within the context of the
              linking party's site.
            </p>
            <p className="mb-4">
              If you are one of the organizations listed in paragraph 2 above
              and are interested in linking to our App, you must inform us by
              sending an e-mail to Rakesh Bansal Ventures. Please include your
              name, your organization name, contact information as well as the
              URL of your site, a list of any URLs from which you intend to link
              to our App, and a list of the URLs on our site to which you would
              like to link. Wait 2-3 weeks for a response.
            </p>
            <p className="mb-4">
              Approved organizations may hyperlink to our App as follows:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>By use of our corporate name; or</li>
              <li>
                By use of the uniform resource locator being linked to; or
              </li>
              <li>
                By use of any other description of our App being linked to that
                makes sense within the context and format of content on the
                linking party's site.
              </li>
            </ul>
            <p>
              No use of Rakesh Bansal Ventures's logo or other artwork will be
              allowed for linking absent a trademark license agreement.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              iFrames
            </h2>
            <p>
              Without prior approval and written permission, you may not create
              frames around our Webpages that alter in any way the visual
              presentation or appearance of our App.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Content Liability
            </h2>
            <p>
              We shall not be hold responsible for any content that appears on
              your App. You agree to protect and defend us against all claims
              that is rising on our App. No link(s) should appear on any Website
              that may be interpreted as libelous, obscene or criminal, or which
              infringes, otherwise violates, or advocates the infringement or
              other violation of, any third party rights.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Reservation of Rights
            </h2>
            <p>
              We reserve the right to request that you remove all links or any
              particular link to our App. You approve to immediately remove all
              links to our App upon request. We also reserve the right to amen
              these terms and conditions and it's linking policy at any time. By
              continuously linking to our App, you agree to be bound to and
              follow these linking terms and conditions.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Removal of links from our App
            </h2>
            <p className="mb-4">
              If you find any link on our App that is offensive for any reason,
              you are free to contact and inform us any moment. We will consider
              requests to remove links but we are not obligated to or so or to
              respond to you directly.
            </p>
            <p>
              We do not ensure that the information on this website is correct,
              we do not warrant its completeness or accuracy; nor do we promise
              to ensure that the website remains available or that the material
              on the website is kept up to date.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Disclaimer
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by applicable law, we exclude all
              representations, warranties and conditions relating to our App and
              the use of this website. Nothing in this disclaimer will:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>
                limit or exclude our or your liability for death or personal
                injury;
              </li>
              <li>
                limit or exclude our or your liability for fraud or fraudulent
                misrepresentation;
              </li>
              <li>
                limit any of our or your liabilities in any way that is not
                permitted under applicable law; or
              </li>
              <li>
                exclude any of our or your liabilities that may not be excluded
                under applicable law.
              </li>
            </ul>
            <p className="mb-4">
              The limitations and prohibitions of liability set in this Section
              and elsewhere in this disclaimer: (a) are subject to the preceding
              paragraph; and (b) govern all liabilities arising under the
              disclaimer, including liabilities arising in contract, in tort and
              for breach of statutory duty.
            </p>
            <p>
              As long as the website and the information and services on the
              website are provided free of charge, we will not be liable for any
              loss or damage of any nature.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
