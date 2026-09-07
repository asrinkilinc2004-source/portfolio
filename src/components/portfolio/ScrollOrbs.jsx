import { useEffect, useRef } from "react";

// Each orb has a page-position (multiple of viewport height) and a parallax speed.
// position: fixed per orb, top recalculated every scroll frame.
const ORBS = [
  { pageFactor: 1.4, left: "-10%", size: 500, speed: 0.25, opacity: 0.30 },
  { pageFactor: 2.2, left:  "65%", size: 420, speed: 0.38, opacity: 0.26 },
  { pageFactor: 3.2, left: "-8%",  size: 540, speed: 0.20, opacity: 0.28 },
  { pageFactor: 4.4, left:  "68%", size: 460, speed: 0.32, opacity: 0.24 },
  { pageFactor: 5.5, left: "-12%", size: 480, speed: 0.22, opacity: 0.28 },
  { pageFactor: 6.6, left:  "70%", size: 380, speed: 0.42, opacity: 0.25 },
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
        const vh = window.innerHeight;
        refs.current.forEach((el, i) => {
          if (!el) return;
          const pageTop = ORBS[i].pageFactor * vh;
          // Parallax: orb moves slower than the page so it drifts
          const top = pageTop - sy * (1 - ORBS[i].speed);
          el.style.top = `${top}px`;
        });
        ticking = false;
      });
    };
    // Set initial positions
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {ORBS.map((o, i) => (
        <div
          key={i}
          ref={el => refs.current[i] = el}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: o.left,
            top: 0,
            width: o.size,
            height: o.size,
            borderRadius: "50%",
            background: "#00A1DE",
            opacity: o.opacity,
            filter: "blur(72px)",
            pointerEvents: "none",
            willChange: "top",
            zIndex: 12,
          }}
        />
      ))}
    </>
  );
}
