"use client";

import { motion } from "framer-motion";

export function LocationLoader() {
  return (
    <div className="flex flex-col items-center space-y-4 text-gray-600">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pulsing background circles */}
        <motion.circle
          cx="40"
          cy="40"
          r="30"
          fill="rgba(236, 72, 153, 0.1)"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="40"
          cy="40"
          r="20"
          fill="rgba(236, 72, 153, 0.15)"
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        {/* Central Map Pin */}
        <path
          d="M40 25 C33.37 25 28 30.37 28 37 C28 45.25 40 58 40 58 C40 58 52 45.25 52 37 C52 30.37 46.63 25 40 25 Z M40 41 C37.79 41 36 39.21 36 37 C36 34.79 37.79 33 40 33 C42.21 33 44 34.79 44 37 C44 39.21 42.21 41 40 41 Z"
          fill="#EC4899" // brand-pink
        />
      </svg>
      <p className="font-semibold">Finding your location...</p>
    </div>
  );
}
