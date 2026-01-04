import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("authToken");

  const fetchApplications = async (currentFilter = filter) => {
    try {
      setLoading(true);
      const token = getToken();

      const url =
        currentFilter === "pending"
          ? `${API_URL}/api/restaurant-applications/pending`
          : `${API_URL}/api/restaurant-applications`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(data.data || data.applications || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchApplications(filter);
  }, [filter]);

  const handleAction = async (id, action) => {
    try {
      const token = getToken();
      const url = `${API_URL}/api/restaurant-applications/${id}/${action}`;

      const res = await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Updated");

      setApplications((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a
        )
      );
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading)
    return <div className="h-screen grid place-items-center">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-[#eef3eb]">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🍽️ Restaurant Applications
      </h1>

      {/* FILTER */}
      <div className="flex justify-center gap-3 mb-6">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === f
                ? "bg-green-700 text-white"
                : "bg-white border border-green-300"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">
          <thead className="bg-green-100">
            <tr>
              <th className="p-4 text-left">Restaurant</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Cuisine</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-t">
                  <td className="p-4">{app.restaurantName}</td>
                  <td className="p-4">{app.ownerName}</td>
                  <td className="p-4">{app.cuisine}</td>
                  <td className="p-4 font-semibold">
                    {app.status === "pending" && <span className="text-yellow-600">Pending</span>}
                    {app.status === "approved" && <span className="text-green-600">Approved</span>}
                    {app.status === "rejected" && <span className="text-red-600">Rejected</span>}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    {app.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleAction(app._id, "approve")}
                          className="bg-green-600 text-white px-4 py-1 rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(app._id, "reject")}
                          className="bg-red-600 text-white px-4 py-1 rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="italic text-gray-500">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplications;
