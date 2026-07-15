"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export function EnvironmentVariables({ projectId }: { projectId: number }) {
  const [keys, setKeys] = useState<string[] | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  const loadKeys = async () => {
    try {
      const response = await api.getProjectEnvironment(projectId);
      setKeys(response.keys);
    } catch (err) {
      setKeys([]);
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load environment variables."
      );
    }
  };

  useEffect(() => {
    let active = true;

    api.getProjectEnvironment(projectId).then(
      (response) => {
        if (active) setKeys(response.keys);
      },
      (err) => {
        if (!active) return;
        setKeys([]);
        setError(
          err instanceof ApiError
            ? err.message
            : "Couldn't load environment variables."
        );
      }
    );

    return () => {
      active = false;
    };
  }, [projectId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const variableName = name.trim();
    if (!variableName || !value) {
      setError("Name and value are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await api.setProjectEnvironmentVariable(projectId, variableName, value);
      setName("");
      setValue("");
      await loadKeys();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't save this variable."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (variableName: string) => {
    setDeleting(variableName);
    setError(null);
    try {
      await api.deleteProjectEnvironmentVariable(projectId, variableName);
      setKeys((current) => current?.filter((key) => key !== variableName) ?? []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't delete this variable."
      );
    } finally {
      setDeleting(null);
    }
  };

  const selectKey = (key: string) => {
    setName(key);
    setValue("");
    nameInput.current?.focus();
  };

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <KeyRound size={14} className="text-muted" />
        <h2 className="text-sm font-medium text-foreground">
          Environment variables
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]"
      >
        <input
          ref={nameInput}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="VARIABLE_NAME"
          aria-label="Variable name"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent"
        />
        <input
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Value"
          aria-label="Variable value"
          autoComplete="new-password"
          className="min-w-0 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          <Plus size={14} />
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-error">{error}</p>}

      {keys === null ? (
        <div className="mt-3 h-10 animate-pulse rounded-md border border-border bg-surface" />
      ) : keys.length > 0 ? (
        <div className="mt-3 overflow-hidden rounded-md border border-border">
          {keys.map((key, index) => (
            <div
              key={key}
              className={`flex h-10 items-center justify-between px-3 ${
                index !== keys.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="truncate font-mono text-xs text-foreground">
                {key}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => selectKey(key)}
                  aria-label={`Update ${key}`}
                  title={`Update ${key}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-foreground"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(key)}
                  disabled={deleting === key}
                  aria-label={`Delete ${key}`}
                  title={`Delete ${key}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-error-bg hover:text-error disabled:opacity-50"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
