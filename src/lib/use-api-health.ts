"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

export type ApiStatus = "checking" | "online" | "offline";

export function useApiHealth(pollMs = 15000) {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        await api.listProjects();
        if (!cancelled) setStatus("online");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    };

    check();
    const interval = setInterval(check, pollMs);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollMs]);

  return status;
}
