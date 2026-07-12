"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Keyboard, Search, FileText, Settings, Moon, Bookmark } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const SHORTCUT_GROUPS: { title: string; shortcuts: Shortcut[] }[] = [
  {
    title: "Search & navigation",
    shortcuts: [
      {
        keys: ["Ctrl", "K"],
        description: "Open the skill search palette (⌘K on Mac)",
        icon: Search,
      },
      {
        keys: ["/"],
        description: "Open search (alternative shortcut)",
        icon: Search,
      },
      {
        keys: ["Esc"],
        description: "Close any open dialog or palette",
      },
      {
        keys: ["↑", "↓"],
        description: "Navigate results in the search palette",
      },
      {
        keys: ["Enter"],
        description: "Select the highlighted search result",
      },
    ],
  },
  {
    title: "Help & settings",
    shortcuts: [
      {
        keys: ["?"],
        description: "Open this keyboard shortcuts help",
        icon: Keyboard,
      },
      {
        keys: ["Click"],
        description: "Settings gear in the top bar (backup, theme, data)",
        icon: Settings,
      },
      {
        keys: ["Click"],
        description: "Moon/Sun icon to toggle dark mode",
        icon: Moon,
      },
    ],
  },
  {
    title: "Skills reference",
    shortcuts: [
      {
        keys: ["Click"],
        description: "Sidebar items to filter by module (All, Bookmarks, Worksheets, or a specific module)",
        icon: FileText,
      },
      {
        keys: ["Click"],
        description: "Bookmark icon on any skill to save it for quick access",
        icon: Bookmark,
      },
    ],
  },
];

export function HelpDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Keyboard shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick reference for all keyboard shortcuts and key interactions.
            The search shortcut uses{" "}
            <kbd className="font-mono bg-muted px-1 rounded text-[11px]">Ctrl+K</kbd>{" "}
            on Windows/Linux and{" "}
            <kbd className="font-mono bg-muted px-1 rounded text-[11px]">⌘K</kbd>{" "}
            on Mac.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {SHORTCUT_GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {group.title}
              </h3>
              <ul className="space-y-1.5">
                {group.shortcuts.map((shortcut, idx) => {
                  const Icon = shortcut.icon;
                  return (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-3 py-1"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {Icon && (
                          <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-sm text-foreground/90 truncate">
                          {shortcut.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {shortcut.keys.map((key, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-1.5 rounded border bg-muted font-mono text-[11px] font-semibold"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="border-t pt-3 mt-2 text-[11px] text-muted-foreground space-y-1">
          <p>
            <strong>Tip:</strong> Press <kbd className="font-mono bg-muted px-1 rounded">?</kbd> from
            anywhere in the app to reopen this dialog.
          </p>
          <p>
            <strong>Install as an app:</strong> In your browser&apos;s menu, look for
            &quot;Install DBT Skills Reference&quot; or &quot;Install this site as an app&quot;
            to open it in its own window like a native app.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
