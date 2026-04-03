"use client";

import type { Project } from "@/data/projects";
import { AnimatePresence, motion } from "framer-motion";

type ProjectOverlayProps = {
  activeProject: Project | null;
  gazeProjectId: string | null;
  gazeProgress: number;
  onOpen: () => void;
};

export function ProjectOverlay({
  activeProject,
  gazeProjectId,
  gazeProgress,
  onOpen,
}: ProjectOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-start px-10 pb-8">
      <AnimatePresence mode="wait">
        {activeProject ? (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, filter: "blur(10px)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-3xl items-end justify-between gap-10 px-1 py-2 opacity-85"
          >
            <div className="max-w-sm">
              <p className="editorial-kicker text-[11px] text-sky-950/38">
                {activeProject.category} · {activeProject.year}
              </p>
              <h2 className="mt-2 font-display text-[2rem] leading-none text-sky-950 sm:text-[2.35rem]">
                {activeProject.title}
              </h2>
              <p className="mt-2 max-w-[17rem] text-[13px] leading-6 text-sky-950/42">
                {activeProject.shortDescription}
              </p>
              <div className="mt-4 h-px w-full max-w-[7.5rem] overflow-hidden bg-sky-950/10">
                <motion.div
                  className="h-full bg-sky-950/44"
                  animate={{
                    width:
                      gazeProjectId === activeProject.id
                        ? `${Math.max(gazeProgress, 0.08) * 100}%`
                        : "100%",
                  }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onOpen}
              className="editorial-kicker shrink-0 border-b border-sky-950/14 pb-2 text-[11px] text-sky-950/54 transition-colors duration-300 hover:text-sky-950"
            >
              Enter Project
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
