"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, MonitorSmartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface InstallState {
  canInstall: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  browserName: string;
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  // Brave detection: check for navigator.brave ( Brave exposes this property)
  if ((navigator as any).brave) return "brave";
  // Fallback: some Brave versions include "Brave" in the UA
  if (ua.includes("Brave")) return "brave";
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Chrome/")) return "chrome";
  if (ua.includes("Firefox/")) return "firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome")) return "safari";
  return "unknown";
}

function detectIOS(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
}

function detectStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Hook that checks for the PWA install prompt.
 * Works with the early-captured event from the inline script in layout.tsx.
 */
export function useInstallPrompt() {
  const [state, setState] = React.useState<InstallState>({
    canInstall: false,
    isStandalone: false,
    isIOS: false,
    browserName: "unknown",
  });

  React.useEffect(() => {
    const isStandalone = detectStandalone();
    const isIOS = detectIOS();
    const browserName = detectBrowser();

    // Check if the event was already captured by the inline script
    const canInstall = !!(window as any).__deferredPrompt;

    setState({ canInstall, isStandalone, isIOS, browserName });

    // Listen for the event if it hasn't fired yet
    const onAvailable = () => setState((s) => ({ ...s, canInstall: true }));
    const onInstalled = () =>
      setState((s) => ({ ...s, canInstall: false, isStandalone: true }));

    window.addEventListener("pwa-install-available", onAvailable);
    window.addEventListener("pwa-installed", onInstalled);

    return () => {
      window.removeEventListener("pwa-install-available", onAvailable);
      window.removeEventListener("pwa-installed", onInstalled);
    };
  }, []);

  const promptInstall = React.useCallback(async () => {
    const deferred = (window as any).__deferredPrompt as BeforeInstallPromptEvent | null;
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    (window as any).__deferredPrompt = null;
    setState((s) => ({ ...s, canInstall: false }));
  }, []);

  return { ...state, promptInstall };
}

/**
 * Install button that ALWAYS renders.
 * - If already installed: shows "App installed" (if showWhenInstalled)
 * - If native prompt available: shows "Install" button
 * - If not available: shows browser-specific instructions toggle
 */
export function InstallAppButton({
  variant = "default",
  size = "sm",
  className = "w-full",
  label = "Install as desktop app",
  installedLabel = "App installed",
  showWhenInstalled = false,
}: {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  installedLabel?: string;
  showWhenInstalled?: boolean;
}) {
  const { canInstall, isStandalone, isIOS, browserName, promptInstall } = useInstallPrompt();

  // Already installed
  if (isStandalone) {
    if (!showWhenInstalled) return null;
    return (
      <div className="space-y-2">
        <Button variant="outline" size={size} className={className} disabled>
          <Check className="h-3.5 w-3.5 mr-1.5" />
          {installedLabel}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center">
          Running in app mode — find it in your Start menu
        </p>
      </div>
    );
  }

  // Native install prompt is available — show the button
  if (canInstall) {
    return (
      <Button variant={variant} size={size} className={className} onClick={promptInstall}>
        <Download className="h-3.5 w-3.5 mr-1.5" />
        {label}
      </Button>
    );
  }

  // No native prompt — show browser-specific instructions
  return (
    <InstallInstructions
      isIOS={isIOS}
      browserName={browserName}
      variant={variant}
      size={size}
      className={className}
    />
  );
}

function InstallInstructions({
  isIOS,
  browserName,
  variant,
  size,
  className,
}: {
  isIOS: boolean;
  browserName: string;
  variant: "default" | "outline";
  size: "default" | "sm" | "lg" | "icon";
  className: string;
}) {
  const [showSteps, setShowSteps] = React.useState(false);

  let browserLabel = "your browser";
  let steps: React.ReactNode;

  if (isIOS) {
    browserLabel = "iOS";
    steps = (
      <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
        <li>Tap the <strong>Share</strong> button (square with up arrow)</li>
        <li>Tap <strong>&quot;Add to Home Screen&quot;</strong></li>
        <li>Tap <strong>&quot;Add&quot;</strong></li>
      </ol>
    );
  } else if (browserName === "brave") {
    browserLabel = "Brave";
    steps = (
      <div className="space-y-2">
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-2 text-[11px]">
          <strong>Brave Shields can block PWA install.</strong> If the &quot;Install as desktop app&quot; button
          above doesn&apos;t appear, try one of these:
        </div>
        <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
          <li>
            <strong>Lower Shields for this site:</strong> Click the Brave lion icon in the address bar →
            toggle <strong>&quot;Shields down for this site&quot;</strong> → refresh the page → reopen Settings
          </li>
          <li>
            <strong>Install via menu:</strong> Click the <strong>three-dot menu</strong> (⋮) top-right →
            look for <strong>&quot;Install DBT Skills Reference...&quot;</strong> (or &quot;Install page as app&quot;)
          </li>
          <li>
            <strong>Use Chrome or Edge instead:</strong> Open this site in Chrome or Edge for the most
            reliable PWA install experience
          </li>
        </ol>
      </div>
    );
  } else if (browserName === "edge") {
    browserLabel = "Edge";
    steps = (
      <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
        <li>Click the <strong>three-dot menu</strong> (⋯) in the top-right corner</li>
        <li>Click <strong>&quot;Apps&quot;</strong> → <strong>&quot;Install this site as an app&quot;</strong></li>
        <li>Click <strong>&quot;Install&quot;</strong> in the dialog</li>
      </ol>
    );
  } else if (browserName === "chrome") {
    browserLabel = "Chrome";
    steps = (
      <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
        <li>Click the <strong>three-dot menu</strong> (⋮) in the top-right corner</li>
        <li>Click <strong>&quot;Cast, save, and share&quot;</strong> → <strong>&quot;Install page as app...&quot;</strong></li>
        <li>Click <strong>&quot;Install&quot;</strong> in the dialog</li>
      </ol>
    );
  } else if (browserName === "firefox") {
    browserLabel = "Firefox";
    steps = (
      <div className="text-[11px] text-muted-foreground space-y-1.5">
        <p>Firefox doesn&apos;t support installing web apps as desktop apps.</p>
        <p>For the install feature, open this site in <strong>Chrome</strong> or <strong>Edge</strong>.</p>
      </div>
    );
  } else if (browserName === "safari") {
    browserLabel = "Safari";
    steps = (
      <div className="text-[11px] text-muted-foreground space-y-1.5">
        <p>Safari doesn&apos;t support installing web apps as desktop apps on Mac.</p>
        <p>For the install feature, open this site in <strong>Chrome</strong> or <strong>Edge</strong>.</p>
      </div>
    );
  } else {
    browserLabel = "your browser";
    steps = (
      <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
        <li>Open your browser menu (usually three dots, top-right)</li>
        <li>Look for <strong>&quot;Install this site as an app&quot;</strong></li>
        <li>For best results, use <strong>Chrome</strong> or <strong>Edge</strong></li>
      </ol>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size={size}
        className={className}
        onClick={() => setShowSteps(!showSteps)}
      >
        <MonitorSmartphone className="h-3.5 w-3.5 mr-1.5" />
        {showSteps ? "Hide steps" : `Install instructions (${browserLabel})`}
      </Button>
      {showSteps && (
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="text-[11px] font-semibold mb-2">
            How to install in {browserLabel}:
          </p>
          {steps}
        </div>
      )}
    </div>
  );
}
