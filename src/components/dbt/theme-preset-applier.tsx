"use client";

import * as React from "react";

/**
 * Applies the saved theme preset on mount and re-applies when dark mode toggles.
 * This is a client component that runs after hydration.
 *
 * For the very first paint, we rely on the inline script in layout.tsx
 * to prevent flash. This component handles subsequent updates and
 * keeps things in sync when the user toggles dark mode.
 */
export function ThemePresetApplier() {
  React.useEffect(() => {
    let mounted = true;

    const apply = async () => {
      try {
        const { getSavedPresetId, applyThemePreset, clearThemePreset } = await import(
          "@/lib/theme-presets"
        );
        if (!mounted) return;
        const id = getSavedPresetId();
        if (id !== "default") {
          applyThemePreset(id);
        } else {
          clearThemePreset();
        }
      } catch {
        // ignore
      }
    };

    apply();

    // Re-apply when dark mode toggles (next-themes adds/removes 'dark' class)
    const observer = new MutationObserver(() => {
      apply();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  return null;
}
