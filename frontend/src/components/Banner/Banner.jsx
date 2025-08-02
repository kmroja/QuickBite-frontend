import React, { useState } from 'react';
import { FaSearch, FaDownload, FaPlay, FaTimes } from 'react-icons/fa';
import { bannerAssets } from '../../assets/dummydata';
import "../../index.css";

const Banner = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { bannerImage, orbitImages, video } = bannerAssets;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

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

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto md:mx-0 group">
              <div className="relative flex items-center bg-green-900/30 rounded-xl border-2 border-lime-500/30 shadow-2xl hover:border-lime-400/50 transition-all duration-300">
                <div className="pl-6 pr-3 py-4">
                  <FaSearch className="text-xl text-lime-300/80" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Discover your next favorite meal..."
                  className="w-full py-4 pr-6 bg-transparent outline-none placeholder-lime-200/70 text-lg font-medium tracking-wide"
                />
                <button
                  type="submit"
                  className="mr-4 px-6 py-3 bg-gradient-to-r from-lime-300 to-lime-200 rounded-lg font-semibold text-green-900 hover:from-lime-200 hover:to-lime-100 transition-all duration-300 shadow-lg hover:shadow-lime-300/20"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              <button className="group flex items-center gap-3 bg-green-800/30 hover:bg-green-800/50 px-6 py-3 rounded-xl transition-all duration-300 border-2 border-green-700/50 hover:border-lime-400 backdrop-blur-sm">
                <FaDownload className="text-xl text-lime-300 group-hover:animate-bounce" />
                <span className="text-lg">Download App</span>
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 bg-gradient-to-r from-lime-300 to-lime-200 hover:from-lime-200 hover:to-lime-100 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-lime-300/30"
              >
                <FaPlay className="text-xl text-green-900" />
                <span className="text-lg text-green-900 font-semibold">Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Image Container with Orbiting Images */}
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
