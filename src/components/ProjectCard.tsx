import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";
import type { Project } from "@/lib/types";

function repoSlug(url: string) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\//, "").replace(/\.git$/, "");
  } catch {
    return url;
  }
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.ID}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-hover"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-[15px] font-medium text-foreground">
          {project.Name}
        </h3>
        <ArrowUpRight
          size={16}
          className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </div>
      <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
        <GitBranch size={12} />
        <span className="truncate">{repoSlug(project.RepoUrl)}</span>
      </div>
    </Link>
  );
}
