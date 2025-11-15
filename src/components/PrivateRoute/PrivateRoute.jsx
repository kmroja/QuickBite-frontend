import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children, role }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const loginData = localStorage.getItem("loginData");

    if (!token || !loginData) {
      setIsAuth(false);
      return;
    }

    const parsedUser = JSON.parse(loginData);
    setUser(parsedUser);

    axios
      .get("https://quickbite-backend-6dvr.onrender.com/api/user/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  if (!isAuth) return <Navigate to="/login" replace />;

  // ✅ Role check — support string or array
 if (role && user?.role !== role) {
  return <Navigate to="/" replace />;
}

  return children;
};

export default PrivateRoute;
