import { Outlet, Link, useLocation } from "react-router-dom";
import { GiChefToque } from "react-icons/gi";
import { FaStore, FaShoppingBag, FaUtensils, FaUser } from "react-icons/fa";

const RestaurantLayout = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/restaurant/dashboard", icon: <FaStore /> },
    { name: "Orders", path: "/restaurant/orders", icon: <FaShoppingBag /> },
    { name: "Menu", path: "/restaurant/menu", icon: <FaUtensils /> },
    { name: "Profile", path: "/restaurant/profile", icon: <FaUser /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white">
        <div className="p-6 flex gap-3 items-center border-b border-gray-700">
          <GiChefToque className="text-3xl text-yellow-400" />
          <div>
            <h1 className="text-xl font-bold">QuickBite</h1>
            <p className="text-sm text-gray-400">Restaurant Panel</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`flex items-center gap-3 p-3 rounded ${
                location.pathname === l.path
                  ? "bg-green-600"
                  : "hover:bg-gray-700"
              }`}
            >
              {l.icon}
              {l.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RestaurantLayout;
