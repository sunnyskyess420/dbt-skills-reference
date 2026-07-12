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
    setEntries(listEntries());
    return entry;
  }, []);

  const updateEntry = React.useCallback(
    (id: string, updates: Partial<Pick<WorksheetEntry, "title" | "data">>) => {
      const updated = updateEntryStorage(id, updates);
      if (updated) {
        setEntries((prev) => {
          const next = prev.map((e) => (e.id === id ? updated : e));
          // re-sort by updatedAt desc
          return [...next].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      }
    },
    []
  );

  const deleteEntry = React.useCallback((id: string) => {
    deleteEntryStorage(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const refresh = React.useCallback(() => {
    setEntries(listEntries());
  }, []);

  return {
    entries,
    loaded,
    createEntry,
    updateEntry,
    deleteEntry,
    refresh,
  };
}
