// Verification harness for the worksheet persistence trail
// (src/lib/worksheet-storage.ts) — the "record saved / read / traced" loop.
//
//   node --experimental-strip-types scripts/verify-worksheet-store.ts
//
// Node has no localStorage, so we install a tiny in-memory shim that mirrors
// the browser Storage API the module uses. The app's contract is
// "save on first edit": createEntry() returns an unpersisted draft and
// updateEntry() upserts it into localStorage. This test walks that exact path.

const memory = new Map<string, string>();
const localStorageShim = {
  getItem: (k: string) => (memory.has(k) ? memory.get(k)! : null),
  setItem: (k: string, v: string) => void memory.set(k, String(v)),
  removeItem: (k: string) => void memory.delete(k),
  key: (i: number) => Array.from(memory.keys())[i] ?? null,
  get length() {
    return memory.size;
  },
  clear: () => memory.clear(),
};
(globalThis as any).localStorage = localStorageShim;

const {
  createEntry,
  listEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  listTombstoneIds,
  getWorksheetTypeMeta,
} = await import("../../src/lib/worksheet-storage.ts");

let passed = 0;
const failures: string[] = [];
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log("== draft (createEntry does not persist by design) ==");
const before = listEntries().length;
const draft = createEntry("dear-man-script");
check("draft has an id", typeof draft.id === "string" && draft.id.length > 10);
check("draft type is dear-man-script", draft.type === "dear-man-script");
check("draft title is auto-dated", /^DEAR MAN — /.test(draft.title), draft.title);
check("draft is not yet in storage", listEntries().length === before);

console.log("== save on first edit (updateEntry upsert) ==");
const saved = updateEntry(draft.id, { title: "DEAR MAN — verification run", data: { relationship: "test" } }, draft);
check("upsert returns the saved record", !!saved && saved.id === draft.id);
check("listEntries grew by 1", listEntries().length === before + 1);

console.log("== trace in the backing store ==");
const keys = Array.from(memory.keys());
console.log(`   storage keys: ${keys.join(", ")}`);
const raw = memory.get(keys[0]) ?? "";
check("backing store holds the entry id", raw.includes(draft.id));
check("backing store holds the type", raw.includes("dear-man-script"));
check("backing store holds the edited title", raw.includes("verification run"));

console.log("== read ==");
const reread = getEntry(draft.id);
check("getEntry returns the record", !!reread && reread.id === draft.id);
check("edited data survived the round-trip", reread?.data?.relationship === "test");
check("worksheet meta resolves a book page", getWorksheetTypeMeta(draft.type).pages === "p. 174");

console.log("== update again ==");
const updated = updateEntry(draft.id, { title: "DEAR MAN — second save" });
check("second update returns record", !!updated && updated.title === "DEAR MAN — second save");
check("getEntry reflects the second update", getEntry(draft.id)?.title === "DEAR MAN — second save");
check("still exactly one record", listEntries().length === before + 1);

console.log("== delete (tombstone ledger) ==");
deleteEntry(draft.id);
check("getEntry returns null after delete", getEntry(draft.id) === null);
check("tombstone recorded", listTombstoneIds().has(draft.id));

console.log(`\n${failures.length === 0 ? "ALL PASSED" : "FAILURES"}: ${passed} checks passed, ${failures.length} failed`);
if (failures.length) {
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}
