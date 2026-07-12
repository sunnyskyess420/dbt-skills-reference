"use client";

import * as React from "react";

/**
 * Detects whether the user is on macOS.
 * On the server (SSR), defaults to false.
 */
export function useIsMac(): boolean {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    if (typeof navigator !== "undefined") {
      const platform =
        navigator.platform ||
        (navigator as any).userAgentData?.platform ||
        "";
      setIsMac(
        platform.toLowerCase().includes("mac") ||
          platform.toLowerCase().includes("iphone") ||
          platform.toLowerCase().includes("ipad")
      );
    }
  }, []);

  return isMac;
}

/**
 * Returns the modifier key label for the current platform.
 * Mac: "⌘" (Command symbol)
 * Windows/Linux: "Ctrl"
 */
export function useModifierKey(): string {
  const isMac = useIsMac();
  return isMac ? "⌘" : "Ctrl";
}
