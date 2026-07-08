"use client";

import { useState } from "react";
import { ExternalLink, RotateCw } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { api } from "@/lib/api";
import { deployedAppUrl } from "@/lib/deployed-app-url";
import type { Deployment } from "@/lib/types";

export function DeploymentRow({
  deployment,
  onRestarted,
}: {
  deployment: Deployment;
  onRestarted: () => void;
}) {
  const [restarting, setRestarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canRestart =
    deployment.Status === "success" && !deployment.ContainerRunning;

  const handleRestart = async () => {
    setRestarting(true);
    setError(null);
    try {
      await api.restartDeployment(deployment.ID);
      onRestarted();
    } catch {
      setError("Couldn't restart — it may have been permanently removed.");
    } finally {
      setRestarting(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          #{deployment.ID}
        </span>
        <span className="font-mono text-xs text-muted">
          {new Date(deployment.CreatedAt).toLocaleString()}
        </span>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>

      <div className="flex items-center gap-3">
        {deployment.Status === "success" &&
          deployment.ContainerRunning &&
          deployment.Port && (
            <a
              href={deployedAppUrl(deployment.Port)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-mono text-xs text-accent hover:text-accent-hover"
            >
              :{deployment.Port}
              <ExternalLink size={11} />
            </a>
          )}

        {canRestart && (
          <button
            onClick={handleRestart}
            disabled={restarting}
            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-50"
          >
            <RotateCw size={11} className={restarting ? "animate-spin" : ""} />
            {restarting ? "Restarting…" : "Restart"}
          </button>
        )}

        <StatusBadge status={deployment.Status} />
      </div>
    </div>
  );
}
