"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";

// Augment the BeforeInstallPromptEvent type — it's not in the standard TS DOM lib.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptState {
  // The deferred prompt event captured from beforeinstallprompt
  deferredPrompt: BeforeInstallPromptEvent | null;
  // Whether the app is already running in standalone (installed) mode
  isStandalone: boolean;
  // Whether the user has dismissed the install button this session
  dismissed: boolean;
}

export function useInstallPrompt(): InstallPromptState & {
  promptInstall: () => Promise<void>;
  dismiss: () => void;
} {
  const [state, setState] = React.useState<InstallPromptState>({
    deferredPrompt: null,
    isStandalone: false,
    dismissed: false,
  });

  React.useEffect(() => {
    // Detect standalone mode (app is already installed and running in its own window)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as any).standalone === true;

    if (standalone) {
      setState({ deferredPrompt: null, isStandalone: true, dismissed: false });
      return;
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from showing on mobile Chrome
      e.preventDefault();
      setState((prev) => ({ ...prev, deferredPrompt: e as BeforeInstallPromptEvent }));
    };

    const installedHandler = () => {
      setState({ deferredPrompt: null, isStandalone: true, dismissed: false });
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const promptInstall = React.useCallback(async () => {
    if (!state.deferredPrompt) return;
    await state.deferredPrompt.prompt();
    const choice = await state.deferredPrompt.userChoice;
    if (choice.outcome === "dismissed") {
      setState((prev) => ({ ...prev, dismissed: true }));
    }
    // Clear the deferred prompt regardless — it can only be used once
    setState((prev) => ({ ...prev, deferredPrompt: null }));
  }, [state.deferredPrompt]);

  const dismiss = React.useCallback(() => {
    setState((prev) => ({ ...prev, dismissed: true }));
  }, []);

  return {
    ...state,
    promptInstall,
    dismiss,
  };
}

/**
 * Button that triggers the native PWA install prompt when clicked.
 * Only renders when:
 * - The app is NOT already running in standalone mode (i.e., not installed yet)
 * - The browser has fired beforeinstallprompt (i.e., install is supported and available)
 * - The user hasn't dismissed the button this session
 *
 * If the browser doesn't support PWA install (e.g., Firefox, Safari desktop),
 * the button simply doesn't render — no error, no confusing UI.
 */
export function InstallAppButton({
  variant = "outline",
  size = "sm",
  className,
  label = "Install app",
  installedLabel = "App installed",
  showWhenInstalled = false,
}: {
  variant?: "default" | "outline" | "ghost" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  installedLabel?: string;
  showWhenInstalled?: boolean;
}) {
  const { deferredPrompt, isStandalone, dismissed, promptInstall } = useInstallPrompt();

  // Already installed and caller doesn't want to show the "installed" state
  if (isStandalone && !showWhenInstalled) return null;

  // Already installed — show confirmation badge
  if (isStandalone && showWhenInstalled) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Check className="h-3.5 w-3.5 mr-1" />
        {installedLabel}
      </Button>
    );
  }

  // Install not available in this browser, or user dismissed
  if (!deferredPrompt || dismissed) return null;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={promptInstall}
    >
      <Download className="h-3.5 w-3.5 mr-1" />
      {label}
    </Button>
  );
}
