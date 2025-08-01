"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdPhone, MdEmail, MdAccessTime } from "react-icons/md";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const [isChecked, setIsChecked] = useState(true);


  const [status, setStatus] = useState<string>("");
  const [messageError, setMessageError] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "message") {
      setMessageError(value.length < 250);
      setIsSubmitDisabled(value.length < 250);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.message.length < 250) {
      setMessageError(true);
      setStatus("Message must be at least 250 characters.");
      return;
    } else if (!isChecked){
      setMessageError(true);
      setStatus("Please Click on Checkbox.");
      return;
    }else {
      setMessageError(false);
    }

    try {
      const response = await axios.post("/api/contact", formData);

      if (response.status === 200) {
        setStatus("Message sent successfully");
        setFormData({ name: "",phoneNumber:"", email: "", message: "" });
        setShowPopup(true); // Show popup on success
        setTimeout(() => {
          setShowPopup(false);
          router.push("/"); // Redirect to home page
        }, 2000); // Close popup after 3 seconds
      } else {
        setStatus("Failed to send the message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("Error sending the message");
    }
  };
  useEffect(() => {
    setMessageError(formData.message.length < 250);
    setIsSubmitDisabled(formData.message.length < 250);
  }, [formData.message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-green-900 text-white">
      {showPopup && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-black text-center">
            <h2 className="text-2xl font-semibold">Thank You!</h2>
            <p className="mt-2">
              Your message has been submitted successfully.
            </p>
            <p>Redirecting to the homepage...</p>
          </div>
        </motion.div>
      )}
      {/* Hero Section with Animated Graphics */}
      <motion.div
        className="relative h-64 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
            backgroundSize: ["100% 100%", "200% 200%"],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 20,
          }}
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(16, 185, 129, 0.3))",
          }}
        />
        <motion.div
          className="text-center z-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Want to get in touch?
          </h1>
          <h2 className="text-2xl md:text-3xl">Contact us</h2>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Information Side */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Call Us</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MdPhone className="text-green-400 mr-3 text-xl" />
                  <div>
                    <p>Payment & Joining related:</p>
                    <Link
                      href="tel:+919560884223"
                      className="font-semibold hover:text-green-400 transition-colors"
                    >
                      (+91) - 95608 - 84223
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <MdPhone className="text-green-400 mr-3 text-xl" />
                  <div>
                    <p>Enquiries:</p>
                    <Link
                      href="tel:+918851475191"
                      className="font-semibold hover:text-green-400 transition-colors"
                    >
                      (+91) - 88514 - 75191
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <MdEmail className="text-green-400 mr-3 text-xl" />
                  <Link
                    href="mailto:wecare@iamrakeshbansal.com"
                    className="hover:text-green-400 transition-colors"
                  >
                    wecare@iamrakeshbansal.com
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Hours of Operation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Monday: 10 am to 6 pm",
                  "Tuesday: 10 am to 6 pm",
                  "Wednesday: 10 am to 6 pm",
                  "Thursday: 10 am to 6 pm",
                  "Friday: 10 am to 6 pm",
                  "Saturday: 10 am to 6 pm",
                ].map((day, index) => (
                  <div key={index} className="flex items-center">
                    <MdAccessTime className="text-green-400 mr-2" />
                    <span>{day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">Connect With Us</h2>
              <div className="flex justify-center space-x-4">
                {[
                  {
                    Icon: FaFacebookF,
                    color: "bg-blue-600",
                    url: "https://www.facebook.com/rakeshbansal.official",
                  },
                  {
                    Icon: FaXTwitter,
                    color: "bg-sky-500",
                    url: "https://x.com/iamrakeshbansal",
                  },
                  {
                    Icon: FaInstagram,
                    color: "bg-pink-600",
                    url: "https://www.instagram.com/therakeshbansal/",
                  },
                  {
                    Icon: FaLinkedinIn,
                    color: "bg-blue-700",
                    url: "https://www.linkedin.com/in/drrakeshbansal/",
                  },
                ].map(({ Icon, color, url }, index) => (
                  <motion.a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${color} p-3 rounded-full text-white`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name   <span style={{color:'red'}}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number   <span style={{color:'red'}}>*</span>
                </label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter 10 digit phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email    <span style={{color:'red'}}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message     <span style={{color:'red'}}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                ></textarea>
                <div className="text-sm text-gray-600 mt-1">
                  {formData.message.length}/250 characters minimum
                </div>
                {messageError && (
                  <p className="text-red-500 text-sm mt-1">
                    Message must be at least 250 characters.
                  </p>
                )}
              </div>
              <div className="flex items-start">
  <input
    type="checkbox"
    id="consent"
    name="consent"
    required
    checked={isChecked}
    className="mt-1 mr-2"
    onChange={handleCheckboxChange}
  />
  <label htmlFor="consent" className="text-sm">
    I agree to receive communication on newsletters, promotional content, offers and events through <strong>SMS, RCS, WhatsApp</strong>.
  </label>
</div>

              <Button
                disabled={isSubmitDisabled}
                variant="gradient"
                size="md"
                className={`w-full ${
                  isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Send Message
              </Button>
              {status && <p className="text-center text-sm mt-4">{status}</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
