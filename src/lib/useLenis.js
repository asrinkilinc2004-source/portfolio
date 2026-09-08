import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export function useLenis() {
  useEffect(() => {
    // Skip on touch devices — native momentum scroll is already smooth
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
    });

    window.__lenis = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
}
