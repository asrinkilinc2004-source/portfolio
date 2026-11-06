import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({ src, alt, onClose }) {
  const [scale, setScale]   = useState(1);
  const [pos,   setPos]     = useState({ x: 0, y: 0 });
  const overlayRef          = useRef(null);
  const drag                = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false });
  const pinchDist           = useRef(null);

  // Reset zoom + pan whenever a new image opens
  useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [src]);

  // ESC to close
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  // Non-passive wheel → zoom without zooming the page
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !src) return;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setScale(s => Math.min(Math.max(s * factor, 1), 6));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [src]);

  // ── Mouse drag (pan when zoomed) ───────────────────────────────────
  const onMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    drag.current = { active: true, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
    setPos({ x: drag.current.ox + dx, y: drag.current.oy + dy });
  };
  const onMouseUp = () => { drag.current.active = false; };

  // Double-click resets zoom
  const onDblClick = (e) => {
    e.stopPropagation();
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  // ── Touch pinch-zoom (prevents browser pinch-zoom on page) ────────
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length !== 2 || !pinchDist.current) return;
    e.preventDefault();
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const factor = dist / pinchDist.current;
    setScale(s => Math.min(Math.max(s * factor, 1), 6));
    pinchDist.current = dist;
  };
  const onTouchEnd = () => { pinchDist.current = null; };

  // Close only when clicking the backdrop (not when dragging)
  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current && !drag.current.moved) onClose();
    drag.current.moved = false;
  };

  const cursorClass = scale > 1
    ? (drag.current.active ? "cursor-grabbing" : "cursor-grab")
    : "cursor-zoom-in";

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onBackdropClick}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", touchAction: "none" }}
        >
          <motion.div
            className="relative max-w-5xl w-full px-4 md:px-12 select-none"
            initial={{ scale: 0.86, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.90, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onMouseDown={onMouseDown}
              onDoubleClick={onDblClick}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className={`w-full max-h-[85vh] object-contain rounded-xl shadow-2xl ${cursorClass}`}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: drag.current.active ? "none" : "transform 0.12s ease",
                userSelect: "none",
              }}
            />
            {alt && (
              <p className="text-center text-xs text-white/60 font-mono italic mt-3"
                style={{ transform: `translateY(${pos.y > 0 ? pos.y * 0.1 : 0}px)` }}>
                {alt}
              </p>
            )}
          </motion.div>

          {/* Close + zoom hint */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span className="text-white/30 font-mono text-xs">scroll = zoom · dubbelklik = reset</span>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/80 transition-colors font-mono text-xs"
            >
              ✕ sluiten
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
