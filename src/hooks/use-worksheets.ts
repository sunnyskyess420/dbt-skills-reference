"use client";

import * as React from "react";
import {
  type WorksheetEntry,
  type WorksheetType,
  listEntries,
  createEntry as createEntryStorage,
  updateEntry as updateEntryStorage,
  deleteEntry as deleteEntryStorage,
} from "@/lib/worksheet-storage";

export function useWorksheets() {
  const [entries, setEntries] = React.useState<WorksheetEntry[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  // Track draft entries not yet persisted to localStorage
  const draftsRef = React.useRef<Map<string, WorksheetEntry>>(new Map());

  // Load from localStorage on mount
  React.useEffect(() => {
    setEntries(listEntries());
    setLoaded(true);
  }, []);

  // Re-sync from storage on window focus (in case of multi-tab edits)
  React.useEffect(() => {
    const handler = () => setEntries(listEntries());
    window.addEventListener("focus", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("focus", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const createEntry = React.useCallback((type: WorksheetType) => {
    const entry = createEntryStorage(type);
    // Store as draft — NOT added to the saved entries list
    draftsRef.current.set(entry.id, entry);
    return entry;
  }, []);

  const updateEntry = React.useCallback(
    (id: string, updates: Partial<Pick<WorksheetEntry, "title" | "data">>) => {
      const draft = draftsRef.current.get(id);
      const updated = updateEntryStorage(id, updates, draft ?? undefined);
      if (updated) {
        // Once persisted, remove from drafts
        draftsRef.current.delete(id);
        setEntries((prev) => {
          const exists = prev.some((e) => e.id === id);
          const next = exists
            ? prev.map((e) => (e.id === id ? updated : e))
            : [updated, ...prev];
          return [...next].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      }
    },
    []
  );

  const deleteEntry = React.useCallback((id: string) => {
    draftsRef.current.delete(id);
    deleteEntryStorage(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Find an entry by ID — checks both persisted entries and unsaved drafts
  const findEntry = React.useCallback(
    (id: string): WorksheetEntry | null => {
      const persisted = entries.find((e) => e.id === id);
      if (persisted) return persisted;
      return draftsRef.current.get(id) ?? null;
    },
    [entries]
  );

  const refresh = React.useCallback(() => {
    setEntries(listEntries());
  }, []);

  return {
    entries,
    loaded,
    createEntry,
    updateEntry,
    deleteEntry,
    findEntry,
    refresh,
  };
}
