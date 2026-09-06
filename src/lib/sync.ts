"use client";

// Client-side sync logic.
//
// This module is the bridge between localStorage (the source of truth for
// guest users) and the server (the source of truth for signed-in users).
//
// Lifecycle:
//   - Guest mode: never touches the network. Reads/writes only localStorage.
//   - Sign-in: `pullFromServer()` runs first. If the server has newer data,
//     it replaces the local state. Then a watcher pushes local changes to
//     the server with a debounce.
//   - Sign-out: the local cache stays intact so the user keeps their data
//     even after logging out.

import * as React from "react";

// All client-side localStorage keys for the DBT app start with this prefix.
// We sync any key that matches, which keeps the sync logic future-proof as
// new features add their own keys.
const DBT_PREFIX = "dbt-skills:";

// Keys that should NEVER be uploaded even if they match the prefix.
// These are device-specific (PWA install flags, theme overrides that depend
// on system, etc.) and would only confuse a fresh device on restore.
const EXCLUDE_KEYS = new Set<string>([
  "dbt-skills:pwa-install-dismissed",
  "dbt-skills:welcome-seen",
]);

export interface SyncState {
  status: "idle" | "syncing" | "synced" | "error" | "offline";
  lastSyncedAt: Date | null;
  error: string | null;
}

// Snapshot everything under the dbt-skills: prefix into one plain object.
export function snapshotLocalState(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(DBT_PREFIX)) continue;
      if (EXCLUDE_KEYS.has(key)) continue;
      const raw = localStorage.getItem(key);
      if (raw == null) continue;
      try {
        out[key] = JSON.parse(raw);
      } catch {
        // Not JSON — store as a string. (None of our current keys fall here,
        // but this keeps the sync lossless if a future one does.)
        out[key] = raw;
      }
    }
  } catch {
    // localStorage may throw in private-browsing modes; treat as empty.
  }
  return out;
}

// Replace every dbt-skills:* key in localStorage with the values in `payload`.
// Keys that exist locally but not in the payload are deleted, so the post-
// restore state matches the source machine exactly (modulo EXCLUDE_KEYS).
export function restoreLocalState(payload: Record<string, unknown>): void {
  // Wipe existing dbt-skills:* keys first so we don't leave stale data.
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(DBT_PREFIX) && !EXCLUDE_KEYS.has(key)) {
      toRemove.push(key);
    }
  }
  toRemove.forEach((k) => localStorage.removeItem(k));

  // Write the new values.
  for (const [key, value] of Object.entries(payload)) {
    if (!key.startsWith(DBT_PREFIX)) continue;
    if (EXCLUDE_KEYS.has(key)) continue;
    try {
      const serialized =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch {
      // localStorage quota / private mode — skip silently.
    }
  }
}

// Merge two payloads. Server wins for any key the server has; local keys
// that the server doesn't have are preserved. This is what we use when both
// sides have data on first sign-in.
export function mergePayloads(
  local: Record<string, unknown>,
  server: Record<string, unknown>
): Record<string, unknown> {
  // For per-key merge: server overrides local for the same key, but local
  // keeps keys the server doesn't have. For worksheet arrays we go further
  // — union by entry id, server wins on conflicts.
  const merged: Record<string, unknown> = { ...local };

  for (const [key, serverValue] of Object.entries(server)) {
    if (!(key in merged)) {
      merged[key] = serverValue;
      continue;
    }
    // Special-case worksheet arrays so users don't lose entries created
    // offline on the new device.
    if (key === "dbt-skills:worksheets") {
      const localArr = Array.isArray(local[key]) ? local[key] : [];
      const serverArr = Array.isArray(serverValue) ? serverValue : [];
      merged[key] = mergeWorksheetArrays(
        localArr as WorksheetEntryLike[],
        serverArr as WorksheetEntryLike[]
      );
      continue;
    }
    // For everything else (bookmarks, recent, settings, ...), server wins.
    merged[key] = serverValue;
  }

  return merged;
}

interface WorksheetEntryLike {
  id: string;
  updatedAt?: string;
}

function mergeWorksheetArrays(
  local: WorksheetEntryLike[],
  server: WorksheetEntryLike[]
): WorksheetEntryLike[] {
  const byId = new Map<string, WorksheetEntryLike>();
  for (const entry of server) byId.set(entry.id, entry);
  for (const entry of local) {
    const existing = byId.get(entry.id);
    if (!existing) {
      byId.set(entry.id, entry);
      continue;
    }
    // Keep whichever was updated more recently.
    const a = new Date(existing.updatedAt ?? 0).getTime();
    const b = new Date(entry.updatedAt ?? 0).getTime();
    if (b > a) byId.set(entry.id, entry);
  }
  // Sort by updatedAt desc to match the storage layer's convention.
  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
  );
}

// Push the current local state to the server.
// Throws on non-2xx so the caller can surface an error. For 401s we throw
// a tagged error so the React state setter can distinguish "session gone"
// (silent) from "server exploded" (loud).
export class AuthError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "AuthError";
  }
}

export async function pushToServer(): Promise<Date> {
  const payload = snapshotLocalState();
  // If localStorage is empty, don't push — this would wipe the server's
  // data. The empty state usually means the user cleared their browser
  // data or is on a fresh install; the server data should be preserved
  // until the user explicitly pulls it back down.
  if (Object.keys(payload).length === 0) {
    // Return a placeholder date so the caller doesn't fail.
    return new Date();
  }
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });
  if (res.status === 401) {
    throw new AuthError();
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `Sync failed (${res.status})`);
  }
  const data = (await res.json()) as { updatedAt: string };
  return new Date(data.updatedAt);
}

// Pull the server state. Returns `{ payload, updatedAt }` where `payload`
// may be `null` if the user has never pushed.
export async function pullFromServer(): Promise<{
  payload: Record<string, unknown> | null;
  updatedAt: Date | null;
}> {
  // Append a cache-busting query param. Next.js 16 with Turbopack can
  // aggressively cache GET route handlers even with `export const dynamic =
  // "force-dynamic"` and no-store headers, so we force a fresh request by
  // making the URL unique.
  const res = await fetch(`/api/sync?t=${Date.now()}`, { cache: "no-store" });
  if (res.status === 401) {
    throw new AuthError();
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch from server (${res.status})`);
  }
  const data = (await res.json()) as {
    payload: Record<string, unknown> | null;
    updatedAt: string | null;
  };
  return {
    payload: data.payload,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
  };
}

// React hook: gives the caller a `syncNow()` function and the current sync
// status. Also kicks off an initial pull when `enabled` flips to true OR
// when the signed-in user changes (so switching accounts re-pulls).
//
// `userKey` should be a stable identifier for the current user (email or id).
// It's used to detect account switches so we re-pull from the new account.
export function useSync(enabled: boolean, userKey?: string) {
  const [state, setState] = React.useState<SyncState>({
    status: "idle",
    lastSyncedAt: null,
    error: null,
  });

  // `syncNow` does a full pull-then-push cycle. Used by the manual "Sync now"
  // button so the user can recover from a missed pull (e.g. if they signed
  // in while the network was flaky).
  const syncNow = React.useCallback(async () => {
    if (!enabled) return null;
    setState((s) => ({ ...s, status: "syncing", error: null }));
    try {
      const { payload, updatedAt } = await pullFromServer();
      if (payload && Object.keys(payload).length > 0) {
        const local = snapshotLocalState();
        const hasLocal = Object.keys(local).length > 0;
        const merged = hasLocal ? mergePayloads(local, payload) : payload;
        restoreLocalState(merged);
        window.dispatchEvent(new CustomEvent("dbt-sync-restored"));
      }
      // Only push if we have local data — avoids wiping server data when
      // the local cache is empty (e.g. right after a pull restored nothing).
      const postRestore = snapshotLocalState();
      let pushedAt: Date | null = null;
      if (Object.keys(postRestore).length > 0) {
        pushedAt = await pushToServer();
      }
      setState({
        status: "synced",
        lastSyncedAt: pushedAt ?? updatedAt,
        error: null,
      });
      return pushedAt ?? updatedAt;
    } catch (e) {
      // Auth errors are expected during sign-in/out transitions — don't
      // surface them as "Sync failed" in the UI.
      if (e instanceof AuthError) {
        setState((s) => ({ ...s, status: "idle" }));
        return null;
      }
      setState((s) => ({
        ...s,
        status: "error",
        error: e instanceof Error ? e.message : "Sync failed",
      }));
      return null;
    }
  }, [enabled]);

  // On enable (sign-in) OR account switch, pull first so the local cache
  // matches the cloud. After the initial pull, the auto-push watcher
  // handles subsequent local changes.
  React.useEffect(() => {
    if (!enabled) {
      setState({
        status: "idle",
        lastSyncedAt: null,
        error: null,
      });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, status: "syncing", error: null }));
    (async () => {
      try {
        const { payload, updatedAt } = await pullFromServer();
        if (cancelled) return;
        if (payload && Object.keys(payload).length > 0) {
          const local = snapshotLocalState();
          const hasLocal = Object.keys(local).length > 0;
          const merged = hasLocal ? mergePayloads(local, payload) : payload;
          restoreLocalState(merged);
          window.dispatchEvent(new CustomEvent("dbt-sync-restored"));
        }
        // Only push if we actually have local data. This prevents wiping
        // the server's data when a fresh device signs in with empty
        // localStorage — the server data is the source of truth in that
        // case, and we just restored it above.
        const postRestore = snapshotLocalState();
        if (Object.keys(postRestore).length > 0) {
          const pushedAt = await pushToServer();
          if (cancelled) return;
          setState({
            status: "synced",
            lastSyncedAt: pushedAt ?? updatedAt,
            error: null,
          });
        } else {
          setState({
            status: "synced",
            lastSyncedAt: updatedAt,
            error: null,
          });
        }
      } catch (e) {
        if (cancelled) return;
        if (e instanceof AuthError) {
          // Session vanished mid-sync — just go idle, don't alarm the user.
          setState({ status: "idle", lastSyncedAt: null, error: null });
          return;
        }
        setState({
          status: "error",
          lastSyncedAt: null,
          error: e instanceof Error ? e.message : "Sync failed",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
    // Re-run when enabled flips OR when the signed-in user changes.
  }, [enabled, userKey]);

  return { state, syncNow };
}

// Convenience: watch localStorage writes and trigger a debounced push.
// Used by the page-level component when signed in.
//
// `enabled` should be true ONLY when the session is fully authenticated
// (status === "authenticated"), not during the "loading" transition. This
// prevents pushes from firing with a half-established session and getting
// 401s that surface as "Sync failed" in the UI.
export function useAutoPush(enabled: boolean, push: () => Promise<Date | null>) {
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    console.log('[useAutoPush] effect ran, enabled:', enabled);
    if (!enabled) return;
    const schedule = () => {
      console.log('[useAutoPush] schedule called, setting debounce timer');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        console.log('[useAutoPush] debounce fired, calling push');
        void push();
      }, 2500);
    };
    window.addEventListener("storage", schedule);
    window.addEventListener("dbt-local-changed", schedule);
    return () => {
      window.removeEventListener("storage", schedule);
      window.removeEventListener("dbt-local-changed", schedule);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [enabled, push]);
}
