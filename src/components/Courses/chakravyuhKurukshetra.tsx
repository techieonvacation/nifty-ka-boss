"use client";

import React from "react";
import Image from "next/image";

import Link from "next/link";

export default function CoursePage() {


  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="kurukshetra-new course-combo">
        <div className="course-header inset-0 bg-gradient-to-r from-gray-900 via-purple-900 to-green-900">
            <div className="container">
                <p>In Courses</p>
                <h1>Chakravyuh Ka Tod + Kurukshetra: <br/>
                Win the Battle</h1>
                <ul>
                    <li><span><Image src="/images/icon-courses-notes.png" alt="Course Modules" width={30} height={30}/></span>Technical Analysis & Renko Charts Secrets</li>
                    <li><span><Image src="/images/icon-courses-language.png" alt="Course Modules" width={30} height={30}/></span>Hindi & English</li>
                    <li><span><Image src="/images/icon-courses-members.png" alt="Course Modules" width={30} height={30}/></span>1900+ Members</li>
                    <li><span><Image src="/images/icon-courses-validity.png" alt="Course Modules" width={30} height={30}/></span>Validity: 1 Year</li>
                </ul>
                <div className="cta-box">
                    <Link href="https://com.rpy.club/pdp/IN1rISdQa" className="btn-enroll">Request A Call</Link>
                </div>
            </div>
        </div>
        <div className="floating-widget">
            <div className="video"><Image src="/images/combo-kuru+Renko.jpg" alt="Course Preview" width={360} height={180}/></div>
            <div className="info">
                <span></span>
                <p>Instructed by</p>
                <h5>Dr. Rakesh Bansal</h5>
            </div>
            <div className="right-info">₹11,999
                <span>*Incl. of Taxes</span>
            </div>
            <Link href="https://com.rpy.club/pdp/IN1rISdQa" className="btn-enroll to-green-500 from-purple-500 bg-gradient-to-r">Enroll Now</Link>

        </div>

      <main className="course-content">
        <div className="container">
            <div className="empty-rightspace">
                <p>2 Powerful Stock Market Courses | 1 Exclusive Price | Led by SEBI Registered Analyst Dr. Rakesh Bansal</p>
                <h2>Break Market Traps & Win Your Trading Battle</h2>
                <p>If you’re serious about mastering Renko chart trading and building a solid foundation in technical analysis, 
                    this is your golden opportunity. With this combo of two flagship stock trading courses, you’ll learn to 
                    simplify market noise, make confident entry/exit decisions, and trade like a pro — all with expert guidance 
                    and live support.</p>
                <h2>Who This Combo is For</h2>
                <ul className="greentick-bullets">
                    <li> Beginners wanting to start strong with Renko charts</li>
                    <li> Intermediate traders struggling with entry/exit timing</li>
                    <li> Investors aiming for clear technical insights</li>
                    <li> Anyone looking for live market learning + community support</li>
                    <li> Traders wanting Hindi/English structured education</li>
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
                <h2>Combo Course Fee & Offer</h2>
                <div className="subscription-table">
                  <table cellPadding="5">
                    <tr>
                      <td>Courses Included</td>
                      <td>Chakravyuh Ka Tod + Kurukshetra</td>
                    </tr>
                    <tr>
                      <td>Original Price</td>
                      <td>₹24,899</td>
                    </tr>
                    <tr>
                      <td>Combo Offer</td>
                      <td>₹14,499</td>
                    </tr>
                    <tr>
                      <td>Special Coupon</td>
                      <td>FLAT2000</td>
                    </tr>
                    <tr>
                      <td>You Pay Only</td>
                      <td>₹12,499</td>
                    </tr>
                  </table>
                </div>
                <div className="coupon"><Image src="/images/icon-discount.png" alt="Course Preview" width={60} height={60} />Use Code <strong>FLAT2000</strong> <br/>at checkout</div>
                <div className="features">Instant Access<br/>
                1-Year Validity<br/>
                Mobile-Friendly</div>
                <h2>Ready to Break the Trap & Win the Battle?</h2>
                <p>Take the leap. Invest in your trading skills. Learn, apply, and grow with India’s most action-driven stock market combo.</p>
                <div className="cta-box-full">
                <Link href="https://com.rpy.club/pdp/IN1rISdQa" className="btn-enroll to-green-500 from-purple-500 bg-gradient-to-r">Enroll Now</Link>
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
