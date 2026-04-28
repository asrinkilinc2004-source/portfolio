import React, { useState, useEffect, useRef } from "react";

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export default function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      if (barRef.current) {
        barRef.current.style.width = `${pct}%`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
      <div
        ref={barRef}
        className="h-full bg-primary"
        style={{
          width: "0%",
          transition: isMobile ? "none" : "width 0.05s linear",
          willChange: "width",
        }}
      />
    </div>
  );
}
