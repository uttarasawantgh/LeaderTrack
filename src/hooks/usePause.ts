import { useState, useEffect, useCallback } from "react";

const PAUSE_KEY = "leadertrack_paused";

export function usePause() {
  const [paused, setPaused] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PAUSE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PAUSE_KEY, String(paused));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [paused]);

  const togglePause = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  return { paused, togglePause };
}