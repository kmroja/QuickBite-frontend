import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Banner from "../../components/Banner/Banner";
import SpecialOffer from "../../components/SpecialOffer/SpecialOffer";
import AboutHome from "../../components/AboutHome/AboutHome";
import OurMenuHome from "../../components/OurMenuHome/OurMenuHome";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Banner />
      <SpecialOffer />
      <AboutHome />
      <OurMenuHome />

      {/* 🔗 Explore Restaurants Button */}
      <div className="text-center my-10">
        <Link
          to="/restaurants"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all"
        >
          Explore Restaurants
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default Home;
