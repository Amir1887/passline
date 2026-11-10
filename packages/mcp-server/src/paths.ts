import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Where the tenant data lives, first match wins:
 * 1. PASSLINE_DATA_DIR (any folder with the same files)
 * 2. <package>/data/<tenant>: the copy shipped in the npm package
 * 3. <repo>/data/<tenant>: when running from this repository
 */
export function resolveDataDir(tenant = "thymewick", env: NodeJS.ProcessEnv = process.env): string {
  const candidates = [
    env.PASSLINE_DATA_DIR,
    fileURLToPath(new URL(`../data/${tenant}/`, import.meta.url)),
    fileURLToPath(new URL(`../../../data/${tenant}/`, import.meta.url)),
  ].filter((dir): dir is string => Boolean(dir));

  const found = candidates.find((dir) => existsSync(dir));
  if (!found) throw new Error(`Tenant data not found. Looked in:\n${candidates.map((c) => `  - ${c}`).join("\n")}`);
  return found;
}
