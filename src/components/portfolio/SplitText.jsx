import React from "react";
import { motion } from "framer-motion";

const isMobile =
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/**
 * Splits `text` into words and reveals them one by one on scroll.
 * Falls back to plain text on mobile (no animation cost).
 */
export default function SplitText({ text, delay = 0 }) {
  if (isMobile) return <>{text}</>;

  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: delay },
    },
  };

  const wordVariant = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              paddingBottom: "0.15em",
              marginBottom: "-0.15em",
            }}
          >
            <motion.span style={{ display: "inline-block" }} variants={wordVariant}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </motion.span>
  );
}
