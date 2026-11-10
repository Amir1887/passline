// Copies what the published package needs from the repo root into this package,
// and removes it again after packing, so the repo keeps ONE source of truth:
//   node scripts/pack-assets.mjs copy    (prepack)
//   node scripts/pack-assets.mjs clean   (postpack)
import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const pkg = fileURLToPath(new URL("../", import.meta.url));
const root = fileURLToPath(new URL("../../../", import.meta.url));

const assets = [
  { from: `${root}data/thymewick`, to: `${pkg}data/thymewick`, dir: true },
  { from: `${root}LICENSE`, to: `${pkg}LICENSE`, dir: false },
];

const mode = process.argv[2];
if (mode === "copy") {
  for (const a of assets) {
    if (!existsSync(a.from)) throw new Error(`Missing ${a.from}`);
    cpSync(a.from, a.to, { recursive: a.dir });
  }
  // Ship only the runtime files: the SVG source stays in the repo.
  rmSync(`${pkg}data/thymewick/floor-plan.svg`, { force: true });
  process.stderr.write("pack-assets: copied data/thymewick and LICENSE into the package\n");
} else if (mode === "clean") {
  rmSync(`${pkg}data`, { recursive: true, force: true });
  rmSync(`${pkg}LICENSE`, { force: true });
  process.stderr.write("pack-assets: removed the packed copies\n");
} else {
  throw new Error('Usage: node scripts/pack-assets.mjs copy|clean');
}
