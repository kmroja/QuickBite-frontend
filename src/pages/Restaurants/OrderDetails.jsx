import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const statusSteps = [
  "Pending",
  "Preparing",
  "Out for delivery",
  "Delivered",
];

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data.order || res.data);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrder();
    } catch (err) {
      alert("Status update failed");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) return <div className="p-6">Loading order...</div>;
  if (!order) return <div className="p-6 text-red-600">Order not found</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Order #{order._id.slice(-6)}
      </h1>

      {/* CUSTOMER */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="font-bold mb-2">Customer</h2>
        <p>{order.user?.name}</p>
        <p className="text-sm text-gray-600">{order.user?.email}</p>
      </div>

      {/* ADDRESS */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="font-bold mb-2">Delivery Address</h2>
        <p>{order.address}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="font-bold mb-3">Items</h2>

        {order.items.map((i, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b py-2"
          >
            <span>
              {i.item.name} × {i.quantity}
            </span>
            <span>₹{i.item.price * i.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-4">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* STATUS UPDATE */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-bold mb-3">Update Status</h2>

        <div className="flex flex-wrap gap-3">
          {statusSteps.map((s) => (
            <button
              key={s}
              disabled={order.status === s}
              onClick={() => updateStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold
                ${
                  order.status === s
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
