"use client";

// UserMenu — sidebar footer account widget.
//
// When signed out:
//   - Renders a "Sign in" button that opens the AuthDialog.
// When signed in:
//   - Renders the user's avatar + email + sync status, and a dropdown with
//     "Sync now" and "Sign out" actions.

import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  CloudCheck,
  CloudOff,
  CloudUpload,
  Loader2,
  LogIn,
  LogOut,
  RefreshCw,
} from "lucide-react";
import type { SyncState } from "@/lib/sync";

interface UserMenuProps {
  onOpenAuth: () => void;
  sync: SyncState;
  onSyncNow: () => void;
}

export function UserMenu({ onOpenAuth, sync, onSyncNow }: UserMenuProps) {
  const { data: session, status } = useSession();

  // useSession() returns "loading" on the server but immediately resolves
  // to "authenticated" or "unauthenticated" on the client. This causes a
  // hydration mismatch (server renders "Loading…", client renders the user
  // or sign-in button). Fix: render a stable placeholder until mounted,
  // so server HTML and first client render match.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render the same placeholder the server would render.
  // After mount, show the actual session state.
  if (!mounted || status === "loading") {
    return (
      <div className="h-9 flex items-center gap-2 px-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading…
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={onOpenAuth}
      >
        <LogIn className="h-3.5 w-3.5" />
        Sign in to sync
      </Button>
    );
  }

  const email = session.user.email ?? "";
  const initials = getInitials(session.user.name ?? email);
  const name = session.user.name ?? email.split("@")[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-background/60 transition-colors text-left">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{name}</div>
            <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
              <SyncBadge sync={sync} />
              {sync.lastSyncedAt
                ? `Synced ${formatRelative(sync.lastSyncedAt)}`
                : sync.status === "syncing"
                  ? "Syncing…"
                  : sync.status === "error"
                    ? "Sync failed"
                    : "Signed in"}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium leading-none">{name}</span>
            <span className="text-xs text-muted-foreground leading-none truncate">
              {email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSyncNow} disabled={sync.status === "syncing"}>
          <RefreshCw
            className={
              sync.status === "syncing"
                ? "h-4 w-4 animate-spin mr-2"
                : "h-4 w-4 mr-2"
            }
          />
          Sync now
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SyncBadge({ sync }: { sync: SyncState }) {
  if (sync.status === "syncing") {
    return <Loader2 className="h-2.5 w-2.5 animate-spin text-amber-500" />;
  }
  if (sync.status === "error") {
    return <CloudOff className="h-2.5 w-2.5 text-destructive" />;
  }
  if (sync.status === "synced") {
    return <CloudCheck className="h-2.5 w-2.5 text-emerald-500" />;
  }
  return <CloudUpload className="h-2.5 w-2.5 text-muted-foreground" />;
}

function getInitials(input: string): string {
  if (!input) return "?";
  const parts = input.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelative(date: Date): string {
  const now = Date.now();
  const then = date.getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
