"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState } from "@/components/EmptyState";
import { NewProjectDialog } from "@/components/NewProjectDialog";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    api
      .listProjects()
      .then(setProjects)
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? err.message
            : "Couldn't reach the API. Check that the backend is running."
        );
      });
  }, []);

  const handleCreated = (project: Project) => {
    setProjects((prev) => (prev ? [project, ...prev] : [project]));
    setDialogOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            Repositories DevInfra can build and deploy as containers.
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          <Plus size={16} />
          New project
        </button>
      </div>

      {error && (
        <p className="mb-6 rounded-md border border-error/30 bg-error-bg px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      {projects === null && !error && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[88px] animate-pulse rounded-lg border border-border bg-surface"
            />
          ))}
        </div>
      )}

      {projects !== null && projects.length === 0 && (
        <EmptyState
          title="No projects yet"
          description="Connect a GitHub repository to deploy your first container."
          action={
            <button
              onClick={() => setDialogOpen(true)}
              className="mt-2 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Create a project →
            </button>
          }
        />
      )}

      {projects !== null && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.ID} project={project} />
          ))}
        </div>
      )}

      {dialogOpen && (
        <NewProjectDialog
          onClose={() => setDialogOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
