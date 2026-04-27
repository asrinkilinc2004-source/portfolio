const mobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const dur = mobile ? 0.25 : 0.6;
const dy  = mobile ? 10   : 30;

export const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: dy },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-20px" },
  transition:  { duration: dur, delay: mobile ? delay * 0.4 : delay },
});

export const fadeLeft = (delay = 0) => ({
  initial:     { opacity: 0, x: mobile ? -8 : -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true, margin: "-20px" },
  transition:  { duration: dur, delay: mobile ? delay * 0.4 : delay },
});

export const fadeIn = (delay = 0) => ({
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true },
  transition:  { duration: mobile ? 0.2 : 0.5, delay: mobile ? delay * 0.4 : delay },
});
