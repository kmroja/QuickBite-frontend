// src/components/ReviewSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { StarIcon as StarFilled } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          "https://quickbite-backend-6dvr.onrender.com/api/reviews"
        );
        setReviews(Array.isArray(data) ? data.reverse() : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return alert("Please fill all fields");
    try {
      const { data } = await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/reviews",
        { name, rating, comment }
      );

      const newReview = data?.review || data;
      if (newReview && newReview.name && newReview.comment) {
        setReviews([newReview, ...reviews]);
      }

      // Reset form
      setName("");
      setRating(5);
      setHover(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Avatar generator
  const getAvatar = (reviewerName) => {
    if (!reviewerName) return "👤";
    const initials = reviewerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return initials;
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-[#A5D6A7] mb-6 text-center">
        What Our Customers Say
      </h2>

      {/* Seamless Ticker */}
      {reviews.length > 0 && (
        <div className="overflow-hidden w-full bg-[#1B3A2F]/80 py-2 rounded-xl mb-6 relative">
          <div className="flex w-max animate-marquee gap-4">
            {[...reviews, ...reviews].map((review, idx) => (
              <div
                key={review._id || idx}
                className="inline-flex items-center gap-3 bg-[#2E7D32]/70 text-white px-4 py-2 rounded-full shadow-md"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#A5D6A7] text-[#1B3A2F] font-bold text-sm">
                  {getAvatar(review.name)}
                </div>

                <span className="font-bold">{review.name}</span>
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarFilled
                      key={i}
                      className={`h-4 w-4 ${
                        review.rating > i ? "text-yellow-400" : "text-gray-400"
                      }`}
                    />
                  ))}
                </span>
                <span className="italic text-sm truncate max-w-xs">
                  "
                  {review.comment.length > 40
                    ? review.comment.slice(0, 40) + "..."
                    : review.comment}
                  "
                </span>
              </div>
            ))}
          </div>

          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                animation: marquee 25s linear infinite;
              }
            `}
          </style>
        </div>
      )}

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-gradient-to-br from-[#1B3A2F]/80 to-[#2E7D32]/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-[#A5D6A7]/30"
      >
        <h3 className="text-xl font-semibold text-[#A5D6A7] mb-6 text-center">
          Share Your Experience
        </h3>

        {/* Name input with floating label */}
        <div className="relative mb-5">
          <input
            type="text"
            id="name"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="peer w-full p-3 rounded-xl bg-[#2E7D32]/30 text-white border border-[#A5D6A7]/40 focus:outline-none focus:ring-2 focus:ring-[#A5D6A7]"
          />
          <label
            htmlFor="name"
            className="absolute left-3 top-2 text-gray-400 text-sm transition-all duration-300
              peer-placeholder-shown:opacity-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2
              peer-not-placeholder-shown:opacity-0 peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-1 pointer-events-none"
          >
            Your Name
          </label>
        </div>

        {/* Star Rating */}
        <div className="flex items-center justify-center mb-5">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                {starValue <= (hover || rating) ? (
                  <StarFilled className="h-9 w-9 text-yellow-400 drop-shadow-glow" />
                ) : (
                  <StarOutline className="h-9 w-9 text-gray-500 hover:text-yellow-200" />
                )}
              </span>
            );
          })}
        </div>

        {/* Comment textarea with floating label */}
        <div className="relative mb-5">
          <textarea
            id="comment"
            placeholder=" "
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            className="peer w-full p-3 rounded-xl bg-[#2E7D32]/30 text-white border border-[#A5D6A7]/40 focus:outline-none focus:ring-2 focus:ring-[#A5D6A7] resize-none"
          />
          <label
            htmlFor="comment"
            className="absolute left-3 top-2 text-gray-400 text-sm transition-all duration-300
              peer-placeholder-shown:opacity-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2
              peer-not-placeholder-shown:opacity-0 peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-1 pointer-events-none"
          >
            Your Feedback
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#A5D6A7] to-[#81C784] text-[#1B3A2F] font-bold py-3 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Submit Review
        </button>
      </form>

      {/* Glow effect for selected stars */}
      <style>
        {`
          .drop-shadow-glow {
            filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.7));
          }
        `}
      </style>
    </div>
  );
};

export default ReviewSection;
