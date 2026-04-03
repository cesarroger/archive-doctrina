"use client";

import { IntroScreen } from "@/components/intro-screen";
import { ProjectOverlay } from "@/components/project-overlay";
import { VoidScene } from "@/components/void-scene";
import { projects } from "@/data/projects";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function ArchiveDoctrinaExperience() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [isMobileFallback, setIsMobileFallback] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [gazeProjectId, setGazeProjectId] = useState<string | null>(null);
  const [gazeProgress, setGazeProgress] = useState(0);

  const handleEnter = useCallback(async () => {
    setEntered(true);

    const element = rootRef.current ?? document.documentElement;
    if (document.fullscreenElement || !element.requestFullscreen) {
      return;
    }

    try {
      await element.requestFullscreen();
    } catch {
      // Graceful fallback when fullscreen is blocked by the browser.
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      setIsMobileFallback(coarse || window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") {
        return;
      }

      if (!entered) {
        void handleEnter();
        return;
      }

      const activeProject = projects.find((project) => project.id === activeProjectId);
      if (activeProject) {
        router.push(`/projects/${activeProject.slug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProjectId, entered, handleEnter, router]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId],
  );

  return (
    <main
      ref={rootRef}
      className="grain relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <AnimatePresence>
        {!entered && <IntroScreen key="intro" onEnter={handleEnter} />}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: entered ? 1 : 0, scale: entered ? 1 : 1.02 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-screen"
      >
        {isMobileFallback ? (
          <section className="void-sheen relative flex min-h-screen items-center px-6 py-20 sm:px-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
              <div className="max-w-2xl">
                <p className="editorial-kicker text-[11px] text-[var(--muted)]">
                  Archive Doctrina
                </p>
                <h1 className="mt-4 font-display text-5xl leading-none tracking-[0.03em] text-sky-950 sm:text-7xl">
                  A sky world built for slower looking.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  The full experience is tuned for desktop movement and gaze-based
                  interaction. This fallback keeps the project structure intact while
                  preserving the editorial tone on smaller or touch devices.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group rounded-[2rem] border border-black/6 bg-white/60 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1"
                  >
                    <div
                      className="aspect-[4/5] rounded-[1.5rem]"
                      style={{
                        background: `linear-gradient(180deg, ${project.posterAccent} 0%, white 48%, ${project.frameTone} 100%)`,
                      }}
                    />
                    <p className="editorial-kicker mt-5 text-[11px] text-[var(--muted)]">
                      {project.category}
                    </p>
                    <h2 className="mt-2 font-display text-3xl leading-none text-stone-950">
                      {project.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {project.shortDescription}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            <VoidScene
              projects={projects}
              activeProjectId={activeProjectId}
              gazeProjectId={gazeProjectId}
              gazeProgress={gazeProgress}
              onOpenProject={(slug) => router.push(`/projects/${slug}`)}
              onGazeChange={(projectId, progress, activated) => {
                setGazeProjectId(projectId);
                setGazeProgress(progress);

                if (activated && projectId) {
                  setActiveProjectId(projectId);
                }
              }}
              onFrameActivate={(projectId) => setActiveProjectId(projectId)}
            />
            <ProjectOverlay
              activeProject={activeProject}
              gazeProjectId={gazeProjectId}
              gazeProgress={gazeProgress}
              onOpen={() => {
                if (activeProject) {
                  router.push(`/projects/${activeProject.slug}`);
                }
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-between px-8 pb-8 text-[11px] tracking-[0.28em] text-sky-950/35 uppercase"
            >
              <span>Move with WASD or arrows</span>
              <span>Look to activate, enter to open</span>
            </motion.div>
          </>
        )}
      </motion.div>
    </main>
  );
}
