import React, { useRef } from "react";

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export default function MagneticButton({ children, className = "", strength = 0.35 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transition = "transform 0.15s ease";
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </div>
  );
}
