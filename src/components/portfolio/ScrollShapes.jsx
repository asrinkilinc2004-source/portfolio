import { useEffect, useRef } from "react";

const SHAPES = [
  // { top%, left%, size, opacity, speed, type: "dot"|"ring"|"diamond" }
  { top: 12,  left: 6,   size: 8,  opacity: 0.18, speed: 0.18, type: "ring"    },
  { top: 18,  left: 91,  size: 5,  opacity: 0.22, speed: 0.32, type: "dot"     },
  { top: 28,  left: 4,   size: 10, opacity: 0.12, speed: 0.24, type: "diamond" },
  { top: 35,  left: 94,  size: 6,  opacity: 0.20, speed: 0.14, type: "ring"    },
  { top: 44,  left: 8,   size: 4,  opacity: 0.25, speed: 0.40, type: "dot"     },
  { top: 52,  left: 88,  size: 12, opacity: 0.10, speed: 0.22, type: "ring"    },
  { top: 58,  left: 3,   size: 6,  opacity: 0.18, speed: 0.30, type: "diamond" },
  { top: 65,  left: 95,  size: 5,  opacity: 0.22, speed: 0.16, type: "dot"     },
  { top: 72,  left: 7,   size: 9,  opacity: 0.13, speed: 0.28, type: "ring"    },
  { top: 80,  left: 92,  size: 7,  opacity: 0.18, speed: 0.36, type: "diamond" },
  { top: 88,  left: 5,   size: 4,  opacity: 0.24, speed: 0.20, type: "dot"     },
  { top: 94,  left: 89,  size: 10, opacity: 0.12, speed: 0.26, type: "ring"    },
];

export default function ScrollShapes() {
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
          const dy = sy * SHAPES[i].speed;
          el.style.transform = `translateY(${dy}px)`;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9 }}>
      {SHAPES.map((s, i) => {
        const base = {
          position: "absolute",
          top: `${s.top}%`,
          left: `${s.left}%`,
          willChange: "transform",
        };

        if (s.type === "dot") return (
          <div key={i} ref={el => refs.current[i] = el} style={{
            ...base,
            width: s.size, height: s.size,
            borderRadius: "50%",
            background: "hsl(var(--primary))",
            opacity: s.opacity,
          }} />
        );

        if (s.type === "ring") return (
          <div key={i} ref={el => refs.current[i] = el} style={{
            ...base,
            width: s.size * 2.2, height: s.size * 2.2,
            borderRadius: "50%",
            border: `1.5px solid hsl(var(--primary))`,
            opacity: s.opacity,
          }} />
        );

        // diamond
        return (
          <div key={i} ref={el => refs.current[i] = el} style={{
            ...base,
            width: s.size, height: s.size,
            background: "hsl(var(--primary))",
            opacity: s.opacity,
            transform: "rotate(45deg)",
          }} />
        );
      })}
    </div>
  );
}
