// src/components/Banner.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaTimes } from 'react-icons/fa';
import { bannerAssets } from '../../assets/dummydata';
import DeliveryBike from '../../assets/delivery-bike.svg';
import LeafImg from '../../assets/leaf.svg'; // Add a small leaf icon or SVG in your assets
import "../../index.css";

const Banner = () => {
  const [showVideo, setShowVideo] = useState(false);
  const { bannerImage, video } = bannerAssets;
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-green-100 via-green-600 to-lime-900 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-lime-700/10" />

        {/* Leaf Particles Container */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <img
              key={i}
              src={LeafImg}
              alt="leaf"
              className={`absolute w-6 h-6 opacity-80 animate-leaf-${i % 4}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Left Content */}
          <div className="flex-1 space-y-8 relative md:pr-8 lg:pr-19 text-center md:text-left animate-fadeIn">
            <h1 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight font-serif drop-shadow-md animate-slideUp">
              Savor nature’s best<br />
              <span className="text-lime-300 text-gradient-animate bg-clip-text">
                delivered to your door.
              </span>
            </h1>

            <p className="text-lg md:text-lg lg:text-xl font-playfair italic sm:text-xl text-lime-100 max-w-xl opacity-90 mx-auto md:mx-0 animate-fadeIn delay-200">
              Best cooks and best delivery guys all at your service.
            </p>

            {/* Animated Delivery Bicycle with motion blur */}
            <div className="relative w-full h-32 overflow-hidden">
              <img
                src={DeliveryBike}
                alt="Delivery Bike"
                className="absolute animate-bike w-24 h-24 drop-shadow-bike-glow"
              />
              <div className="absolute w-24 h-24 bg-green-400/20 rounded-full blur-lg animate-bike-trail"></div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              <button
                onClick={() => navigate("/menu")}
                className="px-6 py-3 bg-green-900 hover:bg-lime-800 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-lime-400/30 focus:outline-none focus:ring-2 focus:ring-lime-300"
              >
                Start Your Order
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 bg-gradient-to-r from-lime-300 to-lime-200 hover:from-lime-200 hover:to-lime-100 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-lime-300/30 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-300"
                aria-label="Watch Promo Video"
              >
                <FaPlay className="text-xl text-green-900 group-hover:animate-pulsePlay transition-transform" />
                <span className="text-lg text-green-900 font-semibold">Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image with 3D effect */}
          <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px]">
            <div className="relative rounded-full p-2 bg-gradient-to-br from-green-700 via-green-800 to-lime-400 shadow-2xl z-20 w-[250px] xs:w-[300px] sm:w-[350px] h-[250px] xs:h-[300px] sm:h-[350px] mx-auto animate-float group-hover:animate-float-hover">
              <img
                src={bannerImage}
                alt="Girl Banner"
                className="rounded-full border-4 xs:border-8 border-green-900/50 w-full h-full object-cover object-top banner-image shadow-inner-glow transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-green-900/40 mix-blend-multiply" />
              <div className="absolute inset-0 rounded-full ring-4 ring-lime-300/30 animate-pulseRing"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-lg p-4 animate-fadeIn">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 text-lime-300 hover:text-lime-200 text-3xl z-10 transition-all transform hover:rotate-90"
          >
            <FaTimes />
          </button>
          <div className="w-full max-w-4xl mx-auto animate-scaleIn">
            <video
              controls
              autoPlay
              className="w-full aspect-video object-contain rounded-lg shadow-2xl"
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Styles & Animations */}
      <style>
        {`
          /* Gradient animation for heading */
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .text-gradient-animate {
            background: linear-gradient(270deg, #a5d6a7, #c8e6c9, #81c784);
            background-size: 600% 600%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientMove 8s ease infinite;
          }

          /* Delivery bike animation */
          @keyframes moveBike {
            0% { left: -150px; opacity: 0; transform: rotate(-10deg); }
            20% { opacity: 1; }
            40% { left: 50%; transform: translateX(-50%) rotate(0deg); }
            60% { left: 50%; transform: translateX(-50%) rotate(0deg); }
            80% { opacity: 1; }
            100% { left: 110%; opacity: 0; transform: rotate(10deg); }
          }
          .animate-bike { animation: moveBike 6s ease-in-out infinite; }

          @keyframes bikeTrail { 0%,100%{opacity:0;} 40%,60%{opacity:0.3;} }
          .animate-bike-trail { animation: bikeTrail 6s ease-in-out infinite; }
          .drop-shadow-bike-glow { filter: drop-shadow(0 0 15px rgba(132,204,22,0.6)); }

          /* Leaf particle animations */
          ${[0,1,2,3].map(i => `
            @keyframes leaf${i} {
              0% { transform: translateY(0px) rotate(0deg) scale(0.8); opacity:0; }
              20% { opacity: 1; }
              50% { transform: translateY(300px) rotate(${i*90}deg) scale(1); opacity:1; }
              100% { transform: translateY(600px) rotate(${i*180}deg) scale(0.5); opacity:0; }
            }
            .animate-leaf-${i} { animation: leaf${i} ${6+i}s linear infinite; }
          `).join("")}

          /* Fade & slide animations */
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 1.2s ease-in-out forwards; }
          .animate-slideUp { animation: fadeIn 1.5s ease-out forwards; }

          /* Float animation for hero image */
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
          @keyframes floatHover { 0% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-8px) scale(1.02); } 100% { transform: translateY(0px) scale(1); } }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .group-hover\\:animate-float-hover:hover { animation: floatHover 4s ease-in-out infinite; }

          /* Play icon pulse */
          @keyframes pulsePlay { 0%,100%{transform:scale(1);} 50%{transform:scale(1.2);} }
          .group-hover\\:animate-pulsePlay:hover { animation: pulsePlay 1s infinite; }

          /* Hero image ring pulse */
          @keyframes pulseRing { 0%,100%{opacity:0.5;} 50%{opacity:0.8;} }
          .animate-pulseRing { animation: pulseRing 3s ease-in-out infinite; }

          /* Video modal scale */
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
          .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
        `}
      </style>
    </div>
  );
};

export default Banner;
