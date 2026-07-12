// Generate PWA PNG icons from SVG using sharp.
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const iconSvg = fs.readFileSync(path.join(PUBLIC_DIR, "icon.svg"));
const maskableSvg = fs.readFileSync(path.join(PUBLIC_DIR, "icon-maskable.svg"));

async function generate() {
  // Standard icons
  await sharp(iconSvg).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, "icon-192.png"));
  console.log("✓ icon-192.png");
  await sharp(iconSvg).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, "icon-512.png"));
  console.log("✓ icon-512.png");

  // Maskable icon (with safe zone padding built into the SVG)
  await sharp(maskableSvg).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, "icon-maskable-512.png"));
  console.log("✓ icon-maskable-512.png");

  // Apple touch icon (180x180, no transparency — iOS strips rounded corners itself)
  await sharp(iconSvg).resize(180, 180).png().toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png");

  // Favicon PNG (32x32) for browsers that don't support SVG
  await sharp(iconSvg).resize(32, 32).png().toFile(path.join(PUBLIC_DIR, "favicon-32.png"));
  console.log("✓ favicon-32.png");
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
