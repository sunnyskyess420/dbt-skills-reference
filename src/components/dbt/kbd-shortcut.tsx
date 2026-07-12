"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a keyboard shortcut hint that adapts to the user's platform.
 * Mac: shows ⌘K, Windows/Linux: shows Ctrl K.
 *
 * Usage: <KbdShortcut combo="k" /> → ⌘K on Mac, Ctrl K on Windows
 *        <KbdShortcut combo="k" showPlus /> → ⌘+K / Ctrl+K
 */
export function KbdShortcut({
  combo,
  className,
  showPlus = false,
}: {
  combo: string;
  className?: string;
  showPlus?: boolean;
}) {
  const [modifier, setModifier] = React.useState<string>("Ctrl");

  React.useEffect(() => {
    if (typeof navigator !== "undefined") {
      const platform =
        navigator.platform ||
        (navigator as any).userAgentData?.platform ||
        "";
      const isMac =
        platform.toLowerCase().includes("mac") ||
        platform.toLowerCase().includes("iphone") ||
        platform.toLowerCase().includes("ipad");
      setModifier(isMac ? "⌘" : "Ctrl");
    }
  }, []);

  return (
    <kbd
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border",
        className
      )}
    >
      {modifier}
      {showPlus && "+"}
      {combo}
    </kbd>
  );
}
