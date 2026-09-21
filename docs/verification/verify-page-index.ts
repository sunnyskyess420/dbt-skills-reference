// Verification harness for src/lib/page-index.ts.
// Runs in plain Node (no bundler) via type stripping:
//   node --experimental-strip-types scripts/verify-page-index.ts
//
// It exercises the real app data (53 skills + all worksheet templates) and
// asserts the page -> content behaviour the "Search by page number" feature
// depends on. Exits non-zero on the first failure.

import { SKILLS } from "../../src/data/skills.ts";
import { WORKSHEET_TYPES } from "../../src/lib/worksheet-storage.ts";
import {
  buildPageIndex,
  parsePageRef,
  parsePageQuery,
  isPageQuery,
  formatPageRanges,
  findByReference,
  isReferenceQuery,
  moduleFromReference,
} from "../../src/lib/page-index.ts";

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

function eq(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  check(name, a === b, `expected ${b}, got ${a}`);
}

console.log("== parsePageRef ==");
eq("p. 9", parsePageRef("p. 9")?.start, 9);
eq("pp. 20-21 start", parsePageRef("pp. 20-21")?.start, 20);
eq("pp. 20-21 end", parsePageRef("pp. 20-21")?.end, 21);
eq("p. 53+ openEnded", parsePageRef("p. 53+")?.openEnded, true);
eq("p. 53+ start", parsePageRef("p. 53+")?.start, 53);
eq("unparseable", parsePageRef("see book"), null);
eq("empty", parsePageRef(""), null);

console.log("== parsePageQuery ==");
eq("42", parsePageQuery("42"), { start: 42, end: 42, label: "p. 42" });
eq("p. 42", parsePageQuery("p. 42")?.start, 42);
eq("page 42", parsePageQuery("page 42")?.start, 42);
eq("20-21", parsePageQuery("20-21"), { start: 20, end: 21, label: "pp. 20–21" });
eq("pp. 174-175", parsePageQuery("pp. 174-175"), { start: 174, end: 175, label: "pp. 174–175" });
eq("20 to 21", parsePageQuery("20 to 21")?.end, 21);
eq("word is not a page query", parsePageQuery("tipp"), null);
eq("isPageQuery('174')", isPageQuery("174"), true);
eq("isPageQuery('dear man')", isPageQuery("dear man"), false);

console.log("== formatPageRanges ==");
eq("compress", formatPageRanges([9, 10, 11, 14, 20, 21]), "9–11, 14, 20–21");
eq("single", formatPageRanges([9]), "9");

console.log("== moduleFromReference ==");
eq("DT worksheet", moduleFromReference("Distress Tolerance Worksheets 3, 3a (Handout 5)").module, "distress-tolerance");
eq("ER worksheet", moduleFromReference("Emotion Regulation Worksheets 15, 16").module, "emotion-regulation");
eq("unknown -> general", moduleFromReference("Standard DBT Diary Card format").module, "general");

console.log("== buildPageIndex ==");
const index = buildPageIndex(SKILLS, WORKSHEET_TYPES);
const skillHits = index.hits.filter((h) => h.kind === "skill");
const wsHits = index.hits.filter((h) => h.kind === "worksheet");
console.log(`  skills=${SKILLS.length} worksheets=${WORKSHEET_TYPES.length}`);
console.log(`  skill hits=${skillHits.length} worksheet hits=${wsHits.length} total=${index.hits.length}`);
console.log(`  distinct pages=${index.pages.length} range=${index.minPage}..${index.maxPage}`);

check("every parsed hit has start>=1", index.hits.every((h) => h.start >= 1));
check("hits sorted by page", index.hits.every((h, i) => i === 0 || index.hits[i - 1].start <= h.start));
check("more than 100 indexed page refs", index.hits.length >= 100, `got ${index.hits.length}`);
check("distinct pages > 80", index.pages.length > 80, `got ${index.pages.length}`);

console.log("== lookup(174) — expects skill + worksheet overlap ==");
const p174 = index.lookup(174);
p174.forEach((h) => console.log(`   p.174 -> [${h.kind}] ${h.name} (${h.pageRef})`));
check("page 174 has a worksheet", p174.some((h) => h.kind === "worksheet" && h.start === 174 && h.end === 174));
check("page 174 has skills (pp. 174-175)", p174.some((h) => h.kind === "skill" && h.start === 174 && h.end === 175));
check("page 175 caught inside range", index.lookup(175).some((h) => h.end === 175));

console.log("== lookup(295) — shared page (3 worksheet templates) ==");
const p295 = index.lookup(295);
console.log(`   p.295 -> ${p295.map((h) => h.name).join(" | ")}`);
check("page 295 matches 3+ items", p295.length >= 3, `got ${p295.length}`);

console.log("== open-ended ref (p. 230+) is anchored, not fanned out ==");
check("anchor page 230 matches", index.lookup(230).some((h) => h.start === 230 && h.openEnded));
check("later page 260 does NOT match p. 230+", !index.lookup(260).some((h) => h.start === 230));

console.log("== lookupRange(20,21) ==");
console.log(`   pp.20-21 -> ${index.lookupRange(20, 21).map((h) => h.name).join(" | ")}`);
check("range 20-21 non-empty", index.lookupRange(20, 21).length > 0);

console.log("== nearestPages for an unindexed page (42) ==");
const near = index.nearestPages(42);
console.log(`   lookup(42)=${index.lookup(42).length} items; nearest ${near.join(", ")}`);
check("page 42 has no direct content", index.lookup(42).length === 0);
check("nearest pages returned", near.length === 3);

console.log("== reference search ==");
const refHits = findByReference(index.hits, "worksheet 2");
console.log(`   'worksheet 2' -> ${refHits.map((h) => `${h.name} [${h.reference}]`).join(" | ")}`);
check("worksheet 2 found", refHits.length > 0);
check("handout 5 is a reference query", isReferenceQuery("handout 5"));

console.log(`\n${failures.length === 0 ? "ALL PASSED" : "FAILURES"}: ${passed} checks passed, ${failures.length} failed`);
if (failures.length) {
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}
