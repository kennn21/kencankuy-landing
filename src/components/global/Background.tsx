"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

type Heart = {
  id: number;
  x: number;
  size: number;
  opacity: number;
  animationDuration: number;
  animationDelay?: number;
  swayAmount: number;
  swayDuration: number;
  blur: number;
};

// A single, self-animating heart component
const RainingHeart = ({ heart }: { heart: Heart }) => {
  return (
    <motion.div
      className="absolute text-brand-pink"
      style={{
        left: `${heart.x}vw`,
        top: "-10%",
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: "110vh",
        opacity: [0, heart.opacity, heart.opacity, 0],
      }}
      transition={{
        duration: heart.animationDuration,
        delay: heart.animationDelay,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <motion.div
        animate={{
          x: [0, heart.swayAmount, 0, -heart.swayAmount, 0],
        }}
        transition={{
          duration: heart.swayDuration,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <svg
          width={heart.size}
          height={heart.size}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ filter: `blur(${heart.blur}px)` }} // Add blur for depth
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// Generate random heart properties with depth
const generateRainingHearts = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 24 + 6; // Range from 6px to 18px
    const isInBackground = size < 10; // Anything smaller than 10px is "in the back"

    return {
      id: i,
      x: Math.random() * 100,
      size: size,
      // Far away hearts are more transparent and fall slower
      opacity: isInBackground
        ? Math.random() * 0.3 + 0.1
        : Math.random() * 0.4 + 0.3,
      animationDuration: isInBackground
        ? Math.random() * 10 + 15
        : Math.random() * 8 + 7,
      // Far away hearts sway less
      swayAmount: isInBackground
        ? Math.random() * 15 - 7.5
        : Math.random() * 25 - 12.5,
      swayDuration: Math.random() * 5 + 4,
      // Add a blur effect to background hearts
      blur: isInBackground ? Math.random() * 1.5 + 0.5 : 0,
    };
  });
};

const INITIAL_HEART_COUNT = 80;
const REDUCED_HEART_COUNT = 30;

export function Background({ opacity }: { opacity?: number }) {
  const [isClient, setIsClient] = useState(false);
  const [heartCount, setHeartCount] = useState(INITIAL_HEART_COUNT);

  const reduceHeartCount = useCallback(() => {
    console.warn("Poor performance detected. Reducing heart count.");
    setHeartCount(REDUCED_HEART_COUNT);
  }, []);

  usePerformanceMonitor(reduceHeartCount);

  const hearts = React.useMemo(
    () => generateRainingHearts(heartCount),
    [heartCount]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none",
        opacity ? `opacity-${opacity}` : "opacity-100"
      )}
    >
      {/* Softer, slower, and more subtle mist animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/20 via-transparent to-brand-pink/20 animate-[mist-flow_1s_ease-in-out_infinite]" />

      {/* Render the raining hearts */}
      {hearts.map((heart) => (
        <RainingHeart key={heart.id} heart={heart} />
      ))}
    </div>
  );
}
