"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

export type ApiStatus = "checking" | "online" | "offline";

export function useApiHealth(pollMs = 15000) {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    let failures = 0;

    const check = async () => {
      try {
        await api.listProjects();
        failures = 0;
        if (!cancelled) {
          setStatus("online");
        }
      } catch {
        failures += 1;
        if (!cancelled && failures >= 2) {
          setStatus("offline");
        }
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
