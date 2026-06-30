"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, Rocket } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { Deployment, Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { DeploymentStepper } from "@/components/DeploymentStepper";
import { deployedAppUrl } from "@/lib/deployed-app-url";

const ACTIVE_STATUSES = new Set(["queued", "running"]);

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [deployments, setDeployments] = useState<Deployment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadProject = async () => {
    try {
      const p = await api.getProject(projectId);
      setProject(p);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the API. Check that the backend is running."
      );
    }
  };

  const loadDeployments = async () => {
    try {
      const all = await api.listDeployments();
      const mine = all
        .filter((d) => d.ProjectID === projectId)
        .sort((a, b) => b.ID - a.ID);
      setDeployments(mine);
      return mine;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the API. Check that the backend is running."
      );
      return [];
    }
  };

  // Poll while the latest deployment is still in flight, stop once it
  // resolves to success/failed.
  const pollUntilSettled = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const mine = await loadDeployments();
      const latest = mine[0];
      if (!latest || !ACTIVE_STATUSES.has(latest.Status)) {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 2500);
  };

  useEffect(() => {
    if (!projectId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount; data comes from an external API, not derivable from existing state
    loadProject();
    loadDeployments().then((mine) => {
      if (mine[0] && ACTIVE_STATUSES.has(mine[0].Status)) {
        pollUntilSettled();
      }
    });
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleDeploy = async () => {
    setDeploying(true);
    setError(null);
    try {
      await api.deploy(projectId);
      await loadDeployments();
      pollUntilSettled();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Couldn't start the deployment: ${err.message}`
          : "Couldn't reach the API. Check that the backend is running."
      );
    } finally {
      setDeploying(false);
    }
  };

  const latest = deployments?.[0];
  const latestActive = latest ? ACTIVE_STATUSES.has(latest.Status) : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Projects
      </Link>

      {error && (
        <p className="mb-6 rounded-md border border-error/30 bg-error-bg px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      {project && (
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-foreground">
              {project.Name}
            </h1>
            <a
              href={project.RepoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              <GitBranch size={12} />
              {project.RepoUrl}
            </a>
          </div>
          <button
            onClick={handleDeploy}
            disabled={deploying || latestActive}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Rocket size={15} />
            {latestActive ? "Deploying…" : "Deploy"}
          </button>
        </div>
      )}

      {latest && (
        <div className="mb-8 rounded-lg border border-border bg-surface p-5">
          <p className="mb-4 text-xs font-medium text-muted">
            Latest deployment
          </p>
          <DeploymentStepper status={latest.Status} />
          {latest.Status === "success" && latest.Port && (
            <a
              href={deployedAppUrl(latest.Port)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent-hover"
            >
              {deployedAppUrl(latest.Port)}
              <ExternalLink size={12} />
            </a>
          )}
          {latest.Status === "failed" && (
            <p className="mt-5 text-xs text-error">
              The deployment failed. Check that the repository is public (or
              accessible) and contains a valid Dockerfile.
            </p>
          )}
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-medium text-muted">
          Deployment history
        </p>

        {deployments === null && (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-md border border-border bg-surface"
              />
            ))}
          </div>
        )}

        {deployments !== null && deployments.length === 0 && (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            No deployments yet. Click Deploy to build and run this repository.
          </p>
        )}

        {deployments !== null && deployments.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border">
            {deployments.map((d, i) => (
              <div
                key={d.ID}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== deployments.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{d.ID}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {new Date(d.CreatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {d.Status === "success" && d.Port && (
                    <a
                      href={deployedAppUrl(d.Port)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-accent hover:text-accent-hover"
                    >
                      :{d.Port}
                    </a>
                  )}
                  <StatusBadge status={d.Status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
