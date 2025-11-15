import React, { useState, useEffect } from "react";
import { FiUser, FiSearch } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import axios from "axios";
import { navLinksSidebar, layoutClasses, statusStyles, paymentMethodDetails } from "../../../assets/dummyAdmin.jsx";

const paymentBadgeColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cod: "bg-blue-100 text-blue-800",
  default: "bg-gray-100 text-gray-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://quickbite-backend-6dvr.onrender.com/api/orders/getall",
          { headers }
        );
        setOrders(res.data);
        setFilteredOrders(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://quickbite-backend-6dvr.onrender.com/api/orders/getall/${orderId}`,
        { status: newStatus },
        { headers }
      );
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      setFilteredOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = orders.filter((order) => {
      const customerName = order.user?.name || `${order.firstName} ${order.lastName}`;
      return (
        order._id.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
      );
    });
    setFilteredOrders(filtered);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        Loading orders...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col transition-all duration-500 ease-in-out
        ${collapsed ? "w-20" : "w-72"}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="flex items-center gap-3 p-6 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition">
          <GiShoppingBag className="text-3xl text-yellow-400 transform hover:scale-125 transition-transform" />
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-2xl tracking-wider">QuickBite</h1>
              <p className="text-gray-300 text-sm font-medium">Admin Dashboard</p>
            </div>
          )}
        </div>
        <nav className="flex flex-col mt-6 gap-2 px-2">
          {navLinksSidebar.map((link) => {
            const isActive = window.location.pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href || link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-gradient-to-r from-green-500 to-green-700 font-semibold shadow-md" : "hover:bg-gray-700 hover:shadow-sm"
                }`}
              >
                <div className="text-lg">{link.icon}</div>
                {!collapsed && <span className="font-medium">{link.name}</span>}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${collapsed ? "ml-20" : "ml-72"} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8">
            <h2 className="text-3xl font-extrabold text-green-700 mb-6">Order Management</h2>

            {/* Search Bar */}
            <div className="flex items-center mb-6 gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-inner max-w-md">
              <FiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer, or Status..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-green-100">
                  <tr>
                    {["Order ID", "Customer", "Address", "Items", "Total Items", "Price", "Payment", "Status"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-left text-sm font-semibold text-gray-800 ${h === "Total Items" ? "text-center" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
                    const totalPrice = order.items.reduce((s, i) => s + i.item.price * i.quantity, 0);
                    const payMethod = paymentMethodDetails[order.paymentMethod?.toLowerCase()] || paymentMethodDetails.default;
                    const stat = statusStyles[order.status] || statusStyles.processing;
                    const badgeClass = paymentBadgeColors[order.paymentMethod?.toLowerCase()] || paymentBadgeColors.default;

                    return (
                      <tr key={order._id} className="hover:bg-green-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-sm text-gray-700">#{order._id.slice(-8)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-green-600" />
                            <div>
                              <p className="text-gray-900 font-medium">{order.user?.name || `${order.firstName} ${order.lastName}`}</p>
                              <p className="text-sm text-gray-500">{order.user?.phone || order.phone}</p>
                              <p className="text-sm text-gray-500">{order.user?.email || order.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{order.address}, {order.city} - {order.zipCode}</td>
                        <td className="px-4 py-3">
                          {order.items.map((itm, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 mb-1 shadow-sm">
                              <img
                                src={`https://quickbite-backend-6dvr.onrender.com${itm.item.imageUrl}`}
                                alt={itm.item.name}
                                className="w-10 h-10 object-cover rounded-lg shadow"
                              />
                              <div className="flex-1 text-gray-700 text-sm font-medium">{itm.item.name} x{itm.quantity}</div>
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-800">{totalItems}</td>
                        <td className="px-4 py-3 font-semibold text-green-700 text-lg">₹{totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>{payMethod.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`px-4 py-2 rounded-lg border border-gray-300 text-sm ${stat.bg} ${stat.color}`}
                          >
                            {Object.keys(statusStyles).map((s) => (
                              <option key={s} value={s}>{statusStyles[s].label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col gap-4 mt-4">
              {filteredOrders.map((order) => {
                const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
                const totalPrice = order.items.reduce((s, i) => s + i.item.price * i.quantity, 0);
                const payMethod = paymentMethodDetails[order.paymentMethod?.toLowerCase()] || paymentMethodDetails.default;
                const stat = statusStyles[order.status] || statusStyles.processing;
                const badgeClass = paymentBadgeColors[order.paymentMethod?.toLowerCase()] || paymentBadgeColors.default;

                return (
                  <div key={order._id} className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition-shadow">
                    <div className="flex justify-between mb-2">
                      <div className="font-mono text-gray-800 font-semibold">#{order._id.slice(-8)}</div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-lg border border-gray-300 text-sm ${stat.bg} ${stat.color}`}
                      >
                        {Object.keys(statusStyles).map((s) => (
                          <option key={s} value={s}>{statusStyles[s].label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FiUser className="text-green-600" />
                      <div>
                        <p className="text-gray-900 font-medium">{order.user?.name || `${order.firstName} ${order.lastName}`}</p>
                        <p className="text-sm text-gray-500">{order.user?.phone || order.phone}</p>
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm mb-2">{order.address}, {order.city} - {order.zipCode}</div>
                    <div className="flex flex-col gap-2 mb-2">
                      {order.items.map((itm, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 shadow-sm">
                          <img src={`https://quickbite-backend-6dvr.onrender.com${itm.item.imageUrl}`} alt={itm.item.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="text-gray-700 text-sm font-medium">{itm.item.name} x{itm.quantity}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-gray-800 font-medium mb-2">
                      <span>Total: {totalItems} items</span>
                      <span className="text-green-700 font-semibold">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>{payMethod.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
