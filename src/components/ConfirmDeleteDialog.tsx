"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmDeleteDialog({
  projectName,
  onClose,
  onConfirm,
}: {
  projectName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [input, setInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = input === projectName;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!matches) return;
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch {
      setError("Couldn't delete the project. Try again.");
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-error/30 bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle size={18} />
            <h2 className="text-[15px] font-medium">Delete project</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted transition-colors hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm text-muted">
          This permanently removes{" "}
          <span className="font-medium text-foreground">{projectName}</span>,
          every deployment, and every container and image built for it.
          This can&apos;t be undone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">
              Type <span className="font-mono text-foreground">{projectName}</span> to confirm
            </label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-error"
            />
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!matches || deleting}
              className="rounded-md bg-error px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleting ? "Deleting…" : "Delete project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
