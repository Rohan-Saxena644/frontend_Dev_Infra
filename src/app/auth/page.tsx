"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserRound } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, demoLogin } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const title = mode === "login" ? "Login" : "Create account";

  const runAuth = async (fn: () => Promise<void>) => {
    setSubmitting(true);
    setError(null);

    try {
      await fn();
      router.push("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the API. Check that the backend is running."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are both required.");
      return;
    }

    runAuth(() =>
      mode === "login"
        ? login(email.trim(), password)
        : signup(email.trim(), password)
    );
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-6">
          <p className="font-mono text-xs text-accent">~/devinfra</p>
          <h1 className="mt-2 text-xl font-medium text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted">
            Use your account to manage projects and deployments.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-md border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              mode === "login"
                ? "bg-surface text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              mode === "signup"
                ? "bg-surface text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-muted">
              Gmail address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="test123"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent"
            />
          </div>

          {error && (
            <p className="rounded-md border border-error/30 bg-error-bg px-3 py-2 text-xs text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            <LogIn size={15} />
            {submitting ? "Please wait..." : title}
          </button>
        </form>

        <button
          type="button"
          onClick={() => runAuth(demoLogin)}
          disabled={submitting}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-50"
        >
          <UserRound size={15} />
          Continue as demo
        </button>

        <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-muted">
          demo@gmail.com / demo123
        </p>
      </div>
    </div>
  );
}
