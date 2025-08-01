"use client";

import React from "react";

import Image from "next/image";

import Link from "next/link";

export default function CoursePage() {

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="kurukshetra-new">
        <div className="course-header inset-0 bg-gradient-to-r from-gray-900 via-purple-900 to-green-900">
            <div className="container">
                <p>In Courses</p>
                <h1>Kurukshetra: Win The Battle</h1>
                <ul>
                    <li><span><Image src="/images/icon-courses-notes.png" alt="Course Modules" width={30} height={30}/></span>Technical Analysis</li>
                    <li><span><Image src="/images/icon-courses-language.png" alt="Course Modules" width={30} height={30}/></span>Hindi</li>
                    <li><span><Image src="/images/icon-courses-members.png" alt="Course Modules" width={30} height={30}/></span>1000+ Members</li>
                    <li><span><Image src="/images/icon-courses-validity.png" alt="Course Modules" width={30} height={30}/></span>Validity: 1 Year</li>
                </ul>
                <div className="cta-box">
                    <Link href="https://com.rpy.club/pdp/4LbPho8o4" className="btn-enroll">Request A Call</Link>
                </div>
            </div>
        </div>
        <div className="floating-widget">
            <div className="video"><iframe width="100%" height="180" src="https://www.youtube.com/embed/ozfP9JbESWM?si=fiLaGM2XjFrRpe5C" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div>
            <div className="info">
                <span></span>
                <p>Instructed by</p>
                <h5>Dr. Rakesh Bansal</h5>
            </div>
            <div className="right-info">₹11,999
                <span>*Incl. of Taxes</span>
            </div>
            <Link href="https://com.rpy.club/pdp/4LbPho8o4" className="btn-enroll to-green-500 from-purple-500 bg-gradient-to-r">Enroll Now</Link>

        </div>

      <main className="course-content">
        <div className="container">
            <div className="empty-rightspace">
                
                <p>Kurukshetra: Win The Battle – Master Technical Analysis with Confidence!
Learn how to master stock market entry & exit strategies with one of India’s most trusted market experts – Dr. Rakesh Bansal. This practical technical analysis course is designed for real-world trading success, backed by expert guidance and actionable strategies.
</p>
                <h2>Why This Course Works – Backed by Proven Stats:</h2>
                <ul className="greentick-bullets">
                    <li> 82% of traders fail due to poor entry/exit decisions</li>
                    <li> 70% of learners say "technical analysis" feels too complex</li>
                    <li> Courses with mentor-led live support see 3X higher completion</li>
                    <li> Traders using structured entry/exit plans report up to 45% improvement in performance within 3 months</li>
                    <li>This course is built to solve these exact problems — with real-time examples, interactive learning, and 24/7 support.</li>
                   
                </ul>
                <h2>What You'll Learn in This Course</h2>
                <ul className="greentick-bullets">
                    <li> Technical Analysis Made Simple – No confusing jargon</li>
                    <li> 11 Chapters with Real-Time Practice – Pause, learn, apply</li>
                    <li> Live Q&A Sessions – Ask your mentor anything</li>
                    <li> Completion Certificate – Showcase your credibility</li>
                    <li> Lifetime Access to Discussion Forum – Ongoing support</li>
                    <li> Learn from an Industry Veteran – 20+ years of proven strategies</li>
                   
                </ul>
                <div className="about-mentor bg-gradient-to-br from-purple-900 via-black to-green-900">
                  <figure><Image src="/images/courses-rakesh-01.jpg" alt="Course Preview" width={200} height={200}/></figure>
                  <h2><span>About Your Mentor</span><br/>
                  Dr. Rakesh Bansal</h2>
                  <ul>
                    <li>SEBI Registered Research Analyst</li>
                    <li>Market Expert featured on Zee Business</li>
                    <li>20+ years of deep experience in Indian financial markets</li>
                    <li>Creator of multiple best online stock trading courses in India</li>
                    <li>Trusted name for those serious about mastering the markets</li>
                  </ul>
                </div>
                <h2>Is This the Right Trading Course for You?</h2>
                <p>Absolutely! This course is perfect for:</p>
                <ul className="greentick-bullets">
                  <li>Beginners who want to learn stock trading in India</li>
                  <li>Intermediate traders needing a reliable entry and exit strategy course</li>
                  <li>Investors exploring Renko chart trading and simplifying their decision-making</li>
                  <li>Traders seeking Telegram trading support in India from professionals</li>
                  <li>Anyone looking for a technical analysis course in Hindi/English</li>
                </ul>
                <h2>Why Kurukshetra is Different?</h2>
                <p>Unlike generic theory-based learning, this is a stock trading course with live support, actionable trade 
                  examples, and community-based learning — making it a truly practical stock market course.
                  <br/><br/>
                  This is not just a course — it’s a trading system, a mindset, and a battle-tested strategy to help you win 
                  your own Kurukshetra.
                </p>
                <h2>Subscription Plans – Start Learning Today!</h2>
                <div className="subscription-table">
                  <table cellPadding="5">
                    <tr>
                      <th>Plan</th>
                      <th>Duration</th>
                      <th>Price (Incl. GST)</th>
                      <th>Offer Price</th>
                    </tr>
                    <tr>
                      <td>Yearly Plan</td>
                      <td>12 Months</td>
                      <td>₹14,900</td>
                      <td>₹11,999 (Best Deal)</td>
                    </tr>
                    <tr>
                      <td>3-Month Plan</td>
                      <td>90 Days</td>
                      <td>₹14,900</td>
                      <td>₹10,999 </td>
                    </tr>
                  </table>
                </div>
                <div className="coupon"><Image src="/images/icon-discount.png" alt="Course Preview" width={60} height={60} />Use Code <strong>MAGIC2000</strong> to unlock exclusive pricing</div>
                <div className="features">Instant Access<br/>
                Learn Anytime<br/>
                Mobile-Friendly</div>
                <div className="cta-box-full">
                <Link href="https://com.rpy.club/pdp/4LbPho8o4" className="btn-enroll to-green-500 from-purple-500 bg-gradient-to-r">Enroll Now</Link>
                </div>
                <h2>Got Questions? We’re Just a Ping Away</h2>
                <p>WhatsApp Us: +91 95608-84223</p>
                <p>Visit: www.iamrakeshbansal.com</p>

            </div>
        </div>
        


      </main>
      </div>
    </div>
  );
}
