"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * RouteWatcher detects navigation changes and updates the physical robot's mode
 * to match the current page.
 */
export default function RouteWatcher() {
  const pathname = usePathname();
  const lastPathname = useRef("");

  useEffect(() => {
    // Avoid double-triggering or triggering when the path hasn't truly changed
    if (pathname === lastPathname.current) return;
    lastPathname.current = pathname;

    // 1. Determine Mode from Pathname
    let mode = "";
    
    // Exact mapping for top-level pages
    if (pathname.includes("/General_mode")) {
      mode = "GENERAL";
    } else if (pathname.includes("/study_mode") || pathname.includes("/revise_page") || pathname.includes("/study_session")) {
      mode = "STUDY";
    } else if (pathname.includes("/Game_mode")) {
      mode = "GAME";
    } else if (pathname.includes("/Music_mode")) {
      mode = "MUSIC";
    }

    // SPECIAL CASE: Ignore Settings / Login / Home pages
    // The user explicitly requested to skip the setting page.
    if (!mode || pathname.includes("/setting") || pathname === "/") {
      return;
    }

    // 2. Call the Robot Mode API
    const updateRobotMode = async (targetMode: string) => {
      try {
        console.log(`🤖 Syncing Robot Mode with Navigation: ${targetMode}`);
        await fetch("/api/robot/mode", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: targetMode }),
        });
      } catch (error) {
        console.error("❌ Failed to sync robot mode:", error);
      }
    };

    updateRobotMode(mode);
  }, [pathname]);

  return null; // This component has no UI
}
