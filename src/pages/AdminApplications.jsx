import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all applications
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/restaurant-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(data.applications || []);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ✅ Approve or Reject Application
  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const url =
        action === "approve"
          ? `${API_URL}/api/restaurant-applications/${id}/approve`
          : `${API_URL}/api/restaurant-applications/${id}/reject`;

      const { data } = await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.message);
      fetchApplications(); // refresh list
    } catch (error) {
      console.error(`❌ Failed to ${action}:`, error);
      toast.error(`Failed to ${action} application`);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Loading applications...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        🍽️ Restaurant Applications
      </h1>

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
                  <td
                    className={`py-3 px-4 font-medium ${
                      app.status === "pending"
                        ? "text-yellow-600"
                        : app.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {app.status}
                  </td>
                  <td className="py-3 px-4 text-center space-x-3">
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(app._id, "approve")}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(app._id, "reject")}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {app.status !== "pending" && (
                      <span className="text-gray-500 text-sm italic">
                        {app.status === "approved" ? "Approved ✅" : "Rejected ❌"}
                      </span>
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
