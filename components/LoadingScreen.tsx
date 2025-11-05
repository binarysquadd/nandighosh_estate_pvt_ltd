"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const messages = [
    "Fetching live project data...",
    "Analyzing dashboard insights...",
    "Optimizing your view...",
    "Almost ready..."
  ];

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % messages.length),
      2000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-indigo-50 to-blue-100 relative overflow-hidden">
      {/* ✨ Soft moving gradient orb in background */}
      <motion.div
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-64 h-64 bg-gradient-to-tr from-indigo-300 to-blue-300 rounded-full blur-3xl"
      />

      {/* 🌀 Animated ring spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        className="relative w-16 h-16 rounded-full border-[3px] border-indigo-200 border-t-indigo-600 shadow-lg"
      >
        {/* Inner pulse */}
        <motion.span
          className="absolute inset-2 bg-indigo-500/10 rounded-full"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Animated message */}
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 text-base sm:text-lg font-medium text-gray-600 text-center"
      >
        {messages[index]}
      </motion.p>

      {/* Subtle brand footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-10 text-xs text-gray-400 tracking-wide"
      >
        Nandighosh Real Estate Manager
      </motion.div>
    </div>
  );
}