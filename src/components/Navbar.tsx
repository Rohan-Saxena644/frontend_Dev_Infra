"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useApiHealth } from "@/lib/use-api-health";
import { cn } from "@/lib/cn";

export function Navbar() {
  const status = useApiHealth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-[15px] font-medium tracking-tight text-foreground">
            <span className="text-accent">~/</span>devinfra
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted"
            title={
              status === "online"
                ? "API reachable"
                : status === "offline"
                  ? "API unreachable"
                  : "Checking API status"
            }
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                status === "online" && "bg-success",
                status === "offline" && "bg-error",
                status === "checking" && "animate-pulse bg-warning"
              )}
            />
            <span className="hidden font-mono sm:inline">
              {status === "online"
                ? "online"
                : status === "offline"
                  ? "offline"
                  : "checking"}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
