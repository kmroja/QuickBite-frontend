import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import axios from "axios";
import AdminNavbar from "../Navbar/Navbar";

// ✅ bring in all style/config objects from dummyAdmin
import {
  navLinksSidebar,
  layoutClasses,
  tableClasses,
  statusStyles,
  paymentMethodDetails,
} from "../../../assets/dummyAdmin";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://quickbite-backend-6dvr.onrender.com/api/orders/getall",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setOrders(res.data);
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
        { status: newStatus }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading)
    return (
      <div
        className={`${layoutClasses.page} flex items-center justify-center text-amber-400`}
      >
        Loading orders...
      </div>
    );

  if (error)
    return (
      <div
        className={`${layoutClasses.page} flex items-center justify-center text-red-400`}
      >
        {error}
      </div>
    );

  return (
    <>
      <AdminNavbar navLinks={navLinksSidebar} />
      <div className={layoutClasses.page}>
        <div className="max-w-7xl mx-auto">
          <div className={layoutClasses.card}>
            <h2 className={layoutClasses.heading}>Order Management</h2>
            <div className={tableClasses.wrapper}>
              <table className={tableClasses.table}>
                <thead className={tableClasses.headerRow}>
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Address",
                      "Items",
                      "Total Items",
                      "Price",
                      "Payment",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className={
                          tableClasses.headerCell +
                          (h === "Total Items" ? " text-center" : "")
                        }
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const totalItems = order.items.reduce(
                      (s, i) => s + i.quantity,
                      0
                    );
                    const totalPrice = order.items.reduce(
                      (s, i) => s + i.item.price * i.quantity,
                      0
                    );
                    const payMethod =
                      paymentMethodDetails[
                        order.paymentMethod?.toLowerCase()
                      ] || paymentMethodDetails.default;
                    const stat =
                      statusStyles[order.status] || statusStyles.processing;

                    return (
                      <tr key={order._id} className={tableClasses.row}>
                        <td
                          className={`${tableClasses.cellBase} font-mono text-sm text-amber-100`}
                        >
                          #{order._id.slice(-8)}
                        </td>
                        <td className={tableClasses.cellBase}>
                          <div className="flex items-center gap-2">
                            <FiUser className="text-amber-400" />
                            <div>
                              <p className="text-amber-100">
                                {order.user?.name ||
                                  `${order.firstName} ${order.lastName}`}
                              </p>
                              <p className="text-sm text-amber-400/60">
                                {order.user?.phone || order.phone}
                              </p>
                              <p className="text-sm text-amber-400/60">
                                {order.user?.email || order.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={tableClasses.cellBase}>
                          {order.address}, {order.city} - {order.zipCode}
                        </td>
                        <td className={tableClasses.cellBase}>
                          {order.items.map((itm, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2 rounded-lg"
                            >
                              <img
                                src={`https://quickbite-backend-6dvr.onrender.com${itm.item.imageUrl}`}
                                alt={itm.item.name}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                              <div className="flex-1 text-amber-100/80 text-sm">
                                {itm.item.name} x{itm.quantity}
                              </div>
                            </div>
                          ))}
                        </td>
                        <td
                          className={`${tableClasses.cellBase} text-center`}
                        >
                          {totalItems}
                        </td>
                        <td
                          className={`${tableClasses.cellBase} text-amber-300 text-lg`}
                        >
                          ₹{totalPrice.toFixed(2)}
                        </td>
                        <td className={tableClasses.cellBase}>
                          <div
                            className={`${payMethod.class} px-3 py-1.5 rounded-lg border text-sm`}
                          >
                            {payMethod.label}
                          </div>
                        </td>
                        <td className={tableClasses.cellBase}>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className={`px-4 py-2 rounded-lg ${stat.bg} ${stat.color} border border-amber-500/20 text-sm`}
                          >
                            {Object.keys(statusStyles).map((s) => (
                              <option key={s} value={s}>
                                {statusStyles[s].label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
