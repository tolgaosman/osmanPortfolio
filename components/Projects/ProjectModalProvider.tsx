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
 * Scoped to wherever it's mounted — currently just the all-projects grid,
 * where clicking a card opens this project's detail. The homepage showcase
 * (ProjectCard) renders that same detail inline instead, so it does not sit
 * under this provider and has no modal to open.
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
