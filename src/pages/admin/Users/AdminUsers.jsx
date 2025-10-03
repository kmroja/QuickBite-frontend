import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/users`, { headers });
        setUsers(data);
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border px-2 py-1">{user.name || user.username}</td>
                <td className="border px-2 py-1">{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center py-2 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
