// Reader scale ("zoom") — one persisted text-size step for every view.
//
// This used to live inside the skill detail page only. It is now a global
// control: the top bar changes it, and the main content pane applies it, so
// worksheets, goals, the cheat sheet and the dashboard all zoom together.
//
// The stored key is unchanged, so anyone who already picked a size keeps it.

export const READER_SCALE_KEY = "dbt-skills:reader-scale";
export const READER_SCALE_CHANGED_EVENT = "dbt-skills:reader-scale-changed";

/** 100% → 112% → 125% (the steps the skill page already used). */
export const READER_SCALES: number[] = [1, 1.12, 1.25];

export function loadReaderScale(): number {
  try {
    const raw = localStorage.getItem(READER_SCALE_KEY);
    const n = Number(raw);
    if (READER_SCALES.includes(n)) return n;
  } catch {
    // private mode / storage disabled — fall through to 100%
  }
  return 1;
}

export function saveReaderScale(scale: number): void {
  try {
    localStorage.setItem(READER_SCALE_KEY, String(scale));
  } catch {
    // Best effort — the setting just won't persist.
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(READER_SCALE_CHANGED_EVENT));
  }
}

export function nextReaderScale(current: number): number {
  const idx = READER_SCALES.indexOf(current);
  return READER_SCALES[(idx + 1) % READER_SCALES.length];
}

export function readerScalePercent(scale: number): number {
  return Math.round(scale * 100);
}
