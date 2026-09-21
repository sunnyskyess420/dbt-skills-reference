// Generates public/og-image.png (1200x630) for social/link previews.
//   node tools/make-og-image.mjs
// Uses sharp (already a project dependency) to rasterise an SVG. Re-run after
// changing the title, subtitle, or module colours.

import sharp from "sharp";
import { mkdirSync } from "node:fs";

const W = 1200;
const H = 630;

// Module accent colours, taken from the app's Tailwind module palette.
const accents = [
  ["#94a3b8", "General"],
  ["#10b981", "Mindfulness"],
  ["#f59e0b", "Interpersonal"],
  ["#f43f5e", "Emotion Reg."],
  ["#0ea5e9", "Distress Tol."],
];

const dots = accents
  .map(([c], i) => `<circle cx="${132 + i * 34}" cy="470" r="9" fill="${c}" />`)
  .join("\n      ");

const legend = accents
  .map(
    ([, label], i) =>
      `<text x="${132 + i * 34}" y="510" font-size="15" fill="#94a3b8" text-anchor="middle">${label}</text>`
  )
  .join("\n      ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0ea5e9" />
      <stop offset="1" stop-color="#10b981" />
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#ffffff" />
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)" />

  <g font-family="Helvetica, Arial, sans-serif">
    <text x="80" y="150" font-size="20" letter-spacing="4" fill="#64748b">DBT SKILLS REFERENCE</text>

    <text x="80" y="268" font-size="76" font-weight="700" fill="#0f172a">A searchable DBT</text>
    <text x="80" y="352" font-size="76" font-weight="700" fill="#0f172a">skills library</text>

    <text x="80" y="418" font-size="27" fill="#475569">53 skills · 52 fillable worksheets · 5 modules · works offline</text>

    <g>
      ${dots}
    </g>
    <g>
      ${legend}
    </g>

    <text x="80" y="575" font-size="20" fill="#94a3b8">Find any skill by name — or by page number. Based on Linehan (2014).</text>
  </g>
</svg>`;

mkdirSync("public", { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og-image.png");
console.log("wrote public/og-image.png");
