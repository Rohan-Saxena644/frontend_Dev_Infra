import { cn } from "@/lib/cn";
import type { DeploymentStatus } from "@/lib/types";

const STYLES: Record<DeploymentStatus, string> = {
  queued: "text-muted bg-surface-hover border-border",
  running: "text-warning bg-warning-bg border-warning/30",
  success: "text-success bg-success-bg border-success/30",
  failed: "text-error bg-error-bg border-error/30",
  expired: "text-muted bg-surface-hover border-border",
};

export function StatusBadge({ status }: { status: DeploymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs",
        STYLES[status]
      )}
    >
      {status === "running" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
      )}
      {status}
    </span>
  );
}
