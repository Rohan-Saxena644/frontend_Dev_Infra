"use client";

import { useEffect, useState } from "react";
import { Terminal, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export function DeploymentLogsDialog({
  deploymentId,
  onClose,
}: {
  deploymentId: number;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDeploymentLogs(deploymentId)
      .then((response) => setLogs(response.logs))
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "Couldn't load deployment logs."
        )
      )
      .finally(() => setLoading(false));
  }, [deploymentId]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Logs for deployment ${deploymentId}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-accent" />
            <span className="font-mono text-sm text-foreground">
              deployment-{deploymentId}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close logs"
            title="Close logs"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <p className="p-4 font-mono text-xs text-muted">Loading logs...</p>
        ) : error ? (
          <p className="m-4 rounded-md border border-error/30 bg-error-bg px-3 py-2 text-sm text-error">
            {error}
          </p>
        ) : logs ? (
          <pre className="overflow-auto p-4 font-mono text-xs leading-5 text-foreground">
            {logs}
          </pre>
        ) : (
          <p className="p-4 font-mono text-xs text-muted">No logs yet.</p>
        )}
      </div>
    </div>
  );
}
