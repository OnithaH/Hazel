"use client";

import { useEffect } from "react";

export default function UsageTracker() {
  useEffect(() => {
    // 1. Initial Resume
    const resumeSession = async () => {
      try {
        await fetch("/api/robot/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "resume", mode: "GENERAL" }),
        });
      } catch (error) {
        console.error("Failed to resume usage session", error);
      }
    };

    const pauseSession = async (useBeacon = false) => {
      const body = JSON.stringify({ action: "pause" });
      const url = "/api/robot/usage";
      
      try {
        if (useBeacon && navigator.sendBeacon) {
          navigator.sendBeacon(url, body);
        } else {
          await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          });
        }
      } catch (error) {
        console.error("Failed to pause usage session", error);
      }
    };

    resumeSession();

    // 2. Visibility Change (Pause/Resume)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseSession();
      } else {
        resumeSession();
      }
    };

    // 3. Before Unload (Final Pause)
    const handleBeforeUnload = () => {
      pauseSession(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      pauseSession();
    };
  }, []);

  return null;
}
