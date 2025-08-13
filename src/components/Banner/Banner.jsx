import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate hook
import { FaPlay, FaTimes } from 'react-icons/fa';
import { bannerAssets } from '../../assets/dummydata';
import DeliveryBike from '../../assets/delivery-bike.svg';
import "../../index.css";

const Banner = () => {
  const [showVideo, setShowVideo] = useState(false);
  const { bannerImage, video } = bannerAssets;

  const navigate = useNavigate(); // ✅ Create navigate instance

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-green-100 via-green-600 to-lime-900 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-lime-700/10" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Left Content */}
          <div className="flex-1 space-y-8 relative md:pr-8 lg:pr-19 text-center md:text-left">
            <h1 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight font-serif drop-shadow-md">
              Savor nature’s best<br />
              <span className="text-lime-300 bg-gradient-to-r from-lime-300 to-lime-200 bg-clip-text">
                delivered to your door.
              </span>
            </h1>

            <p className="text-lg md:text-lg lg:text-xl font-playfair italic sm:text-xl text-lime-100 max-w-xl opacity-90 mx-auto md:mx-0">
              Best cooks and best delivery guys all at your service.
            </p>

            {/* Animated Delivery Bicycle */}
            <div className="relative w-full h-28 overflow-hidden">
              <img
                src={DeliveryBike}
                alt="Delivery Bike"
                className="absolute animate-bike w-24 h-24"
              />
              <style>
                {`
                  @keyframes moveBike {
                    0% { left: -150px; }
                    40% { left: 50%; transform: translateX(-50%); }
                    60% { left: 50%; transform: translateX(-50%); }
                    100% { left: 110%; }
                  }
                  .animate-bike {
                    animation: moveBike 3s linear infinite;
                  }
                `}
              </style>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              {/* Start Your Order Button */}
              <button
                onClick={() => navigate("/menu")} // ✅ Navigate to /menu
                className="px-6 py-3 bg-green-900 hover:bg-lime-800 text-white font-semibold rounded-lg shadow-lg transition-all"
              >
                Start Your Order
              </button>

              {/* Watch Video Button */}
              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 bg-gradient-to-r from-lime-300 to-lime-200 hover:from-lime-200 hover:to-lime-100 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-lime-300/30"
              >
                <FaPlay className="text-xl text-green-900" />
                <span className="text-lg text-green-900 font-semibold">Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px]">
            <div className="relative rounded-full p-1 bg-gradient-to-br from-green-700 via-green-800 to-lime-400 shadow-2xl z-20 w-[250px] xs:w-[300px] sm:w-[350px] h-[250px] xs:h-[300px] sm:h-[350px] mx-auto">
              <img
                src={bannerImage}
                alt="Girl Banner"
                className="rounded-full border-4 xs:border-8 border-green-900/50 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-green-900/40 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-lg p-4">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 text-lime-300 hover:text-lime-200 text-3xl z-10 transition-all"
          >
            <FaTimes />
          </button>
          <div className="w-full max-w-4xl mx-auto">
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
    </div>
  );
};

export default Banner;
