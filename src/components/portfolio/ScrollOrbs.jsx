import { useEffect, useRef } from "react";

// Large blurred KLM-blue orbs that drift at different parallax speeds on scroll.
// Positioned outside the hero (which has its own orbs) so they appear mid-page.
const ORBS = [
  { top: 110,  left: -12, size: 480, speed: 0.22, opacity: 0.13 },
  { top: 200,  left:  72, size: 380, speed: 0.36, opacity: 0.10 },
  { top: 320,  left: -8,  size: 520, speed: 0.18, opacity: 0.12 },
  { top: 450,  left:  68, size: 420, speed: 0.30, opacity: 0.11 },
  { top: 580,  left: -15, size: 460, speed: 0.24, opacity: 0.13 },
  { top: 720,  left:  75, size: 340, speed: 0.40, opacity: 0.10 },
];

export default function ScrollOrbs() {
  const refs = useRef([]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        refs.current.forEach((el, i) => {
          if (!el) return;
          el.style.transform = `translateY(${sy * ORBS[i].speed}px)`;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {ORBS.map((o, i) => (
        <div
          key={i}
          ref={el => refs.current[i] = el}
          style={{
            position: "absolute",
            top: `${o.top}vh`,
            left: `${o.left}%`,
            width: o.size,
            height: o.size,
            borderRadius: "50%",
            background: "#00A1DE",
            opacity: o.opacity,
            filter: "blur(90px)",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
