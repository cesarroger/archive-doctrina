"use client";

import { motion } from "framer-motion";

type IntroScreenProps = {
  onEnter: () => void;
};

export function IntroScreen({ onEnter }: IntroScreenProps) {
  return (
    <motion.section
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(16px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="void-sheen absolute inset-0 z-30 flex items-center justify-center"
    >
      <div className="px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[15vw] leading-none tracking-[0.16em] text-stone-950 sm:text-[7rem]"
        >
          ARCHIVE DOCTRINA
        </motion.p>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          onClick={onEnter}
          className="editorial-kicker mt-8 border-b border-sky-950/15 pb-2 text-[11px] text-sky-950/56 transition-colors duration-300 hover:text-sky-950"
        >
          Press Enter
        </motion.button>
      </div>
    </motion.section>
  );
}
