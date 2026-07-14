// Pinned worksheet utilities — lets users pin frequently-used worksheets
// to the top of the worksheet list. Also tracks view counts for "Most Used" sorting.

const STORAGE_KEY = "dbt-skills:pinned-worksheets";
const VIEWS_KEY = "dbt-skills:worksheet-views";

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

// =================== View count tracking ===================

function getViewCounts(): Record<string, number> {
  try {
    const stored = localStorage.getItem(VIEWS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function getViewCount(id: string): number {
  return getViewCounts()[id] ?? 0;
}

export function incrementViewCount(id: string): void {
  const counts = getViewCounts();
  counts[id] = (counts[id] ?? 0) + 1;
  try {
    localStorage.setItem(VIEWS_KEY, JSON.stringify(counts));
  } catch {
    // ignore
  }
}

export function getViewCountsMap(): Record<string, number> {
  return getViewCounts();
}
