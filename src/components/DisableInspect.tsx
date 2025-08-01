// components/DisableInspect.tsx

"use client";
import { useEffect } from "react";

export default function DisableInspect() {
  useEffect(() => {
    // Disable right-click
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    // Disable certain key events
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "F12" || // F12 for Developer Tools
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) || // Ctrl+Shift+I/C/J for Inspect
        (e.ctrlKey && e.key === "U") // Ctrl+U for View Source
      ) {
        e.preventDefault();
      }
    });
  }, []);

  return null; // This component does not render any UI
}
