// Manual rAF-driven smooth scroll — some mobile browsers (notably older
// iOS Safari) don't support `window.scrollTo({ behavior: "smooth" })` and
// silently no-op instead of jumping, so we animate it ourselves instead
// of relying on native smooth-scroll support.
export function smoothScrollTo(top, duration = 600) {
  const startY = window.scrollY;
  const diff = top - startY;
  if (Math.abs(diff) < 1) return;

  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
