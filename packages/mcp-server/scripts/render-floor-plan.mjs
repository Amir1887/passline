// Renders data/<tenant>/floor-plan.svg to floor-plan.png.
// Run after editing the SVG:  npm run render:floor-plan -w passline-mcp
// The PNG is committed so users and tests never need a native renderer.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const tenant = process.argv[2] ?? "thymewick";
const dir = fileURLToPath(new URL(`../../../data/${tenant}/`, import.meta.url));
const svg = readFileSync(`${dir}floor-plan.svg`, "utf8");

const png = new Resvg(svg, {
  fitTo: { mode: "width", value: 1280 },
  background: "#FFFFFF",
  font: { loadSystemFonts: true, defaultFontFamily: "Arial" },
}).render().asPng();

writeFileSync(`${dir}floor-plan.png`, png);
process.stderr.write(`Wrote ${dir}floor-plan.png (${png.length} bytes)\n`);
