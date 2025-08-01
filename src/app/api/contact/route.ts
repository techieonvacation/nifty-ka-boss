import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { name, phoneNumber, email, message } = await request.json();

  if (!name || !phoneNumber || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Setup the nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    // Email to the admin
    const adminMailOptions = {
      from: `"RKB Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Message from Website Contact Form",
      text: `Hello Admin,\n\nYou have received a new message from your website's contact form.\n\nHere are the details:\n\nName: ${name}\nPhoneNumber: ${phoneNumber}\nEmail: ${email}\nMessage: ${message}\n\nPlease respond to this message at your earliest convenience.\n\nBest Regards,\nRKB Website Team`,
    };

    // Email to the user
    const userMailOptions = {
      from: `"RKB Website" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: process.env.ADMIN_EMAIL,
      subject: "Thank You for Contacting Us",
      text: `Dear ${name},\n\nThank you for reaching out to us! We have received your message and our team will get back to you shortly.\n\nIn the meantime, if you have any additional questions, feel free to reply to this email.\n\nBest Regards,\nTeam RKB`,
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { message: "Emails sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error sending emails" },
      { status: 500 }
    );
  }
}
