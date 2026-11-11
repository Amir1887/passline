// Copies images that live once in the repo into public/assets/ for the site.
// public/assets/ is gitignored, so the floor plan and screenshot have one source.
import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const out = fileURLToPath(new URL("../public/assets/", import.meta.url));

mkdirSync(out, { recursive: true });
copyFileSync(`${root}data/thymewick/floor-plan.png`, `${out}floor-plan.png`);
copyFileSync(`${root}docs/images/claude-code-passline.png`, `${out}claude-code-passline.png`);
process.stderr.write(`copy-assets: copied 2 images into ${out}\n`);
