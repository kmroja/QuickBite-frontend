// src/pages/AdminApplications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected

  const getToken = () => localStorage.getItem("token") || localStorage.getItem("authToken");

  const fetchApplications = async (currentFilter = filter) => {
    setLoading(true);
    try {
      const token = getToken();
      const url =
        currentFilter === "pending"
          ? `${API_URL}/api/restaurant-applications/pending`
          : `${API_URL}/api/restaurant-applications`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // different shape for pending endpoint vs all
      const apps = data.data || data.applications || data.applications || data;
      setApplications(apps);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // when filter changes, fetch appropriate data
    fetchApplications(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleAction = async (id, action) => {
    try {
      const token = getToken();
      const url = `${API_URL}/api/restaurant-applications/${id}/${action}`;
      const method = "patch"; // our route uses PUT
      const res = await axios({ method, url, headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        toast.success(res.data.message || `${action} successful`);

        // update local state (replace the application object)
        setApplications((prev) => prev.map((a) => (a._id === id ? res.data.application || res.data.data || { ...a, status: action === "approve" ? "approved" : "rejected" } : a)));

        // Optional: if you want to fetch fresh data instead:
        // fetchApplications();
      } else {
        toast.error(res.data.message || `Failed to ${action}`);
      }
    } catch (err) {
      console.error(`❌ Failed to ${action}:`, err);
      toast.error(`Failed to ${action} application`);
    }
  };

  if (loading) return <div className="text-center py-10">Loading applications...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">🍽️ Restaurant Applications</h1>

      <div className="flex items-center justify-center gap-3 mb-6">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${filter === f ? "bg-green-600 text-white" : "bg-white border"}`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {applications.length === 0 ? (
        <p className="text-center text-gray-500">No restaurant applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Restaurant</th>
                <th className="py-3 px-4 text-left">Owner</th>
                <th className="py-3 px-4 text-left">Cuisine</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{app.restaurantName}</td>
                  <td className="py-3 px-4">{app.ownerName}</td>
                  <td className="py-3 px-4">{app.cuisine}</td>
                  <td className="py-3 px-4 font-medium">
                    {app.status === "pending" ? <span className="text-yellow-600">Pending</span> : app.status === "approved" ? <span className="text-green-600">Approved</span> : <span className="text-red-600">Rejected</span>}
                  </td>
                  <td className="py-3 px-4 text-center space-x-3">
                    {app.status === "pending" ? (
                      <>
                        <button onClick={() => handleAction(app._id, "approve")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Approve</button>
                        <button onClick={() => handleAction(app._id, "reject")} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Reject</button>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm italic">{app.status === "approved" ? "Approved ✅" : "Rejected ❌"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
