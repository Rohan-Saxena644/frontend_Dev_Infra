import { cn } from "@/lib/cn";
import type { DeploymentStatus } from "@/lib/types";

const STEPS: { key: DeploymentStatus; label: string }[] = [
  { key: "queued", label: "queued" },
  { key: "running", label: "running" },
  { key: "success", label: "deployed" },
];

const ORDER: Record<DeploymentStatus, number> = {
  queued: 0,
  running: 1,
  success: 2,
  failed: 2,
  expired: 2,
};

export function DeploymentStepper({ status }: { status: DeploymentStatus }) {
  const failed = status === "failed";
  const expired = status === "expired";
  const currentIndex = ORDER[status];

  return (
    <div className="flex items-center font-mono text-xs">
      {STEPS.map((step, i) => {
        const isFinal = i === STEPS.length - 1;
        const reached = i <= currentIndex;
        const isCurrent = i === currentIndex && status !== "success";
        const label = isFinal && (failed || expired) ? status : step.label;
        const dotColor =
          failed && isFinal
            ? "bg-error border-error"
            : expired && isFinal
              ? "bg-muted-foreground border-muted-foreground"
              : reached
                ? "bg-accent border-accent"
                : "bg-transparent border-border-strong";

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2 transition-colors",
                  dotColor,
                  isCurrent && status === "running" && "animate-pulse"
                )}
              />
              <span
                className={cn(
                  "transition-colors",
                  reached ? "text-foreground" : "text-muted-foreground",
                  failed && isFinal && "text-error",
                  expired && isFinal && "text-muted"
                )}
              >
                {label}
              </span>
            </div>
            {!isFinal && (
              <div
                className={cn(
                  "mx-2 mb-4 h-px w-10 transition-colors sm:w-16",
                  i < currentIndex ? "bg-accent" : "bg-border-strong"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
