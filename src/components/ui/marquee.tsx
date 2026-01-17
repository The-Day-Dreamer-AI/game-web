"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface MarqueeItemProps {
  children: React.ReactNode;
  speed: React.MutableRefObject<number>;
}

const MarqueeItem: React.FC<MarqueeItemProps> = ({ children, speed }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useRef(0);
  const rafRef = useRef<number>(0);

  const setX = useCallback(() => {
    if (!itemRef.current || !rectRef.current) return;

    const xPercentage = (x.current / rectRef.current.width) * 100;

    // Reset position for seamless loop
    if (xPercentage < -100) {
      x.current = 0;
    }
    if (xPercentage > 0) {
      x.current = -rectRef.current.width;
    }

    itemRef.current.style.transform = `translate3d(${xPercentage}%, 0, 0)`;
  }, []);

  useEffect(() => {
    if (itemRef.current) {
      rectRef.current = itemRef.current.getBoundingClientRect();
    }

    const handleResize = () => {
      if (itemRef.current) {
        rectRef.current = itemRef.current.getBoundingClientRect();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loop = () => {
      x.current -= speed.current;
      setX();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [setX, speed]);

  return (
    <div ref={itemRef} className="shrink-0 flex">
      {children}
    </div>
  );
};

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 0.5,
  className = "",
}) => {
  const speedRef = useRef(speed);

  // Update speed ref if prop changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex">
        <MarqueeItem speed={speedRef}>{children}</MarqueeItem>
        <MarqueeItem speed={speedRef}>{children}</MarqueeItem>
      </div>
    </div>
  );
};

export default Marquee;
