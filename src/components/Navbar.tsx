"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useApiHealth } from "@/lib/use-api-health";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";

export function Navbar() {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const status = useApiHealth(15000, Boolean(token));

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

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
          {user ? (
            <>
              <span className="hidden max-w-[180px] truncate font-mono text-xs text-muted md:inline">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
