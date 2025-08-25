// src/components/ReviewSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/reviews");
        setReviews(Array.isArray(data) ? data : []);
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
      const { data } = await axios.post("https://quickbite-backend-6dvr.onrender.com/api/reviews", {
        name,
        rating,
        comment,
      });
      setReviews([data, ...reviews]); // prepend new review
      setName("");
      setRating(5);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-white">Customer Reviews</h2>

      {/* Reviews List */}
      <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div
              key={idx}
              className="p-2 bg-gray-800 text-gray-200 rounded-md shadow-sm"
            >
              <p className="font-bold">{review.name}</p>
              <p className="text-yellow-400">
                {"⭐".repeat(review.rating)}
              </p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No reviews yet.</p>
        )}
      </div>

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-2 bg-gray-900 p-3 rounded-lg"
      >
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;
