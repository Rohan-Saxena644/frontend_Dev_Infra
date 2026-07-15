"use client";

import { useState } from "react";
import { ExternalLink, RotateCw, Square, Terminal } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { DeploymentLogsDialog } from "./DeploymentLogsDialog";
import { api } from "@/lib/api";
import { deployedAppUrl } from "@/lib/deployed-app-url";
import type { Deployment } from "@/lib/types";

export function DeploymentRow({
  deployment,
  onChanged,
}: {
  deployment: Deployment;
  onChanged: () => void;
}) {
  const [restarting, setRestarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canRestart =
    deployment.Status === "success" && !deployment.ContainerRunning;

  const handleRestart = async () => {
    setRestarting(true);
    setError(null);
    try {
      await api.restartDeployment(deployment.ID);
      onChanged();
    } catch {
      setError("Couldn't restart — it may have been permanently removed.");
    } finally {
      setRestarting(false);
    }
  };

  const handleStop = async () => {
    setStopping(true);
    setError(null);
    try {
      await api.stopDeployment(deployment.ID);
      onChanged();
    } catch {
      setError("Couldn't stop this deployment.");
    } finally {
      setStopping(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            #{deployment.ID}
          </span>
          <span className="font-mono text-xs text-muted">
            {new Date(deployment.CreatedAt).toLocaleString()}
          </span>
          {error && <span className="text-xs text-error">{error}</span>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          {deployment.Status === "success" && deployment.ContainerRunning && (
            <button
              onClick={handleStop}
              disabled={stopping}
              className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-50"
            >
              <Square size={10} fill="currentColor" />
              {stopping ? "Stopping..." : "Stop"}
            </button>
          )}

          {deployment.Status === "success" && (
            <button
              onClick={() => setLogsOpen(true)}
              className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              <Terminal size={11} />
              Logs
            </button>
          )}

          <StatusBadge status={deployment.Status} />
        </div>
      </div>
      {logsOpen && (
        <DeploymentLogsDialog
          deploymentId={deployment.ID}
          onClose={() => setLogsOpen(false)}
        />
      )}
    </>
  );
}
