import React, { useState } from "react";
import { FaRegEnvelope } from "react-icons/fa6";
import { BiChevronRight } from "react-icons/bi";
import { socialIcons } from "../../assets/dummydata";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewSection from "../ReviewSection/ReviewSection";



const navItems = [
  { name: "Home", link: "/" },
  { name: "Menu", link: "/menu" },
  { name: "About Us", link: "/about" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Subscribed successfully!`, { theme: "colored" });
    setEmail("");
  };

  return (
    <>
      <footer className="bg-[#1B3A2F] text-[#F9F7F1] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {/* Left Column */}
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold font-sacramento text-[#A5D6A7] animate-pulse">
                QuickBite
              </h2>
              <p className="text-[#E8E6DD] text-sm font-sacramento italic">
                Where culinary artistry meets doorstep convenience.
                <br />
                Savor handcrafted perfection, delivered with care.
              </p>

              {/* Newsletter */}
              <form onSubmit={handleSubmit} className="relative mt-4 group">
                <div className="flex items-center gap-2 mb-2">
                  <FaRegEnvelope className="text-[#A5D6A7] animate-pulse" />
                  <span className="font-bold text-[#A5D6A7]">Get Exclusive Offers</span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F9F7F1]/10 border-2 border-[#A5D6A7]/40 focus:outline-none focus:border-[#A5D6A7] focus:ring-4 focus:ring-[#A5D6A7]/20 transition-all duration-300 placeholder-[#F9F7F1]/50 pr-24"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bg-gradient-to-br from-[#A5D6A7] via-[#2E7D32] to-[#1B3A2F] text-white px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg hover:shadow-green-300/40 overflow-hidden transition-all duration-500"
                  >
                    <span className="font-bold text-sm tracking-wide transition-transform duration-300 group-hover:-translate-x-1">
                      Join Now
                    </span>
                    <BiChevronRight className="text-xl transition-transform duration-300 group-hover:animate-spin flex-shrink-0" />
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700"></span>
                  </button>
                </div>
              </form>
            </div>

            {/* Middle Column */}
            <div className="flex justify-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 border-l-4 border-[#A5D6A7] pl-3 font-merriweather italic text-[#A5D6A7]">
                  Navigation
                </h3>
                <ul className="space-y-3">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        className="flex items-center hover:text-[#A5D6A7] transition-all group font-lora hover:pl-2"
                      >
                        <BiChevronRight className="mr-2 text-[#A5D6A7] group-hover:animate-bounce" />
                        <span className="hover:italic">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column Social */}
            <div className="flex justify-center md:justify-end">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 border-l-4 border-[#A5D6A7] pl-3 font-merriweather italic text-[#A5D6A7]">
                  Social Connect
                </h3>
                <div className="flex space-x-4">
                  {socialIcons.map(({ icon: Icon, color, label, link }, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl bg-[#A5D6A7]/10 p-3 rounded-full hover:bg-[#A5D6A7]/20 hover:scale-110 transition-all duration-300 relative group"
                      style={{ color }}
                    >
                      <Icon className="hover:scale-125 transition-transform" />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#A5D6A7] text-black px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewSection />

          {/* Bottom */}
          <div className="border-t border-[#2E7D32]/50 pt-8 mt-8 text-center">
            <p className="text-[#A5D6A7] text-lg mb-2 font-playfair">
              © 2025 QuickBite. All rights reserved.
            </p>
            <div className="group inline-block">
              <div className="text-lg font-sacramento bg-gradient-to-r from-[#A5D6A7] via-[#2E7D32] to-[#A5D6A7] bg-clip-text text-transparent hover:text-green-200 transition-all duration-500">
                Bringing your cravings to your doorstep.
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Footer;
