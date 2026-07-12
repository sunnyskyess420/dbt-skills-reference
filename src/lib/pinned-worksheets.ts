// Pinned worksheet utilities — lets users pin frequently-used worksheets
// to the top of the worksheet list.

const STORAGE_KEY = "dbt-skills:pinned-worksheets";

export function getPinnedIds(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

export function isPinned(id: string): boolean {
  return getPinnedIds().has(id);
}

export function togglePin(id: string): boolean {
  const pinned = getPinnedIds();
  if (pinned.has(id)) {
    pinned.delete(id);
  } else {
    pinned.add(id);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(pinned)));
  } catch {
    // ignore
  }
  return pinned.has(id);
}
