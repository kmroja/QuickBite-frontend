import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://quickbite-backend-6dvr.onrender.com";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Preparing: "bg-blue-100 text-blue-700",
  "Out for delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const verify = await axios.get(`${API_URL}/api/user/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ownerId = verify.data.user?._id || verify.data._id;

        const restRes = await axios.get(
          `${API_URL}/api/restaurants/owner/${ownerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const restaurantId = restRes.data.restaurant._id;

        const res = await axios.get(
          `${API_URL}/api/orders/restaurant/${restaurantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Order fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6 text-lg">Loading Orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Restaurant Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
          No orders yet
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="font-semibold">
                  Order ID: <span className="text-gray-600">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Customer: {order.user?.name || "Customer"}
                </p>
                <p className="text-sm text-gray-500">
                  Total: ₹{order.totalAmount}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    statusColors[order.status] || "bg-gray-100"
                  }`}
                >
                  {order.status}
                </span>

                <Link
                  to={`/restaurant/orders/${order._id}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
