import React from "react";
import {
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
  FaHotdog,
  FaCoffee,
} from "react-icons/fa";
import { GiFrenchFries, GiScooter, GiSandwich } from "react-icons/gi";

const icons = [
  <FaPizzaSlice className="text-orange-500" />,
  <FaHamburger className="text-yellow-600" />,
  <FaIceCream className="text-pink-400" />,
  <GiFrenchFries className="text-yellow-400" />,
  <FaHotdog className="text-red-500" />,
  <GiScooter className="text-green-500" />,
  // <FaCoffee className="text-amber-700" />,
  <GiSandwich className="text-amber-600" />,
];

const FloatingIcons = ({ count = 25 }) => {
  const particles = Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * 10,
    size: 24 + Math.random() * 40,
    icon: icons[Math.floor(Math.random() * icons.length)],
    type: Math.random() > 0.5 ? "floatUp" : "drift",
    yOffset: Math.random() * 20 - 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute ${
            p.type === "floatUp" ? "animate-floatUp" : "animate-drift"
          }`}
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--y": `${p.yOffset}vh`,
          }}
        >
          {p.icon}
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
