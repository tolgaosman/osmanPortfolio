"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { projects } from "@/data/projects";
import ProjectModal from "./ProjectModal";

/**
 * The open project lives above both the sections that can open one.
 *
 * The projects grid is the obvious opener, but the hero's third laptop shows
 * rotating screenshots and each one is a shortcut into that project — so the
 * modal state cannot belong to ProjectsSection. Rather than lifting it into
 * app/page.tsx (a Server Component, which cannot hold state) or threading a
 * callback through the hero's four layers, it lives here and both call sites
 * ask for it by id.
 *
 * The modal itself renders at provider level, which also means exactly one is
 * mounted no matter how many things can open it.
 */
interface ProjectModalValue {
  openProject: (id: string) => void;
  closeProject: () => void;
  openId: string | null;
}

const Ctx = createContext<ProjectModalValue | null>(null);

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const openProject = useCallback((id: string) => setOpenId(id), []);
  const closeProject = useCallback(() => setOpenId(null), []);

  const value = useMemo(
    () => ({ openProject, closeProject, openId }),
    [openProject, closeProject, openId],
  );

  const project = openId ? projects.find((p) => p.id === openId) ?? null : null;

  return (
    <Ctx.Provider value={value}>
      {children}
      <ProjectModal project={project} onClose={closeProject} />
    </Ctx.Provider>
  );
}

export function useProjectModal() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useProjectModal must be used within a ProjectModalProvider");
  }
  return ctx;
}
