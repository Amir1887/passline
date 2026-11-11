import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// The repo root, so Next traces files across the npm workspace (passline-mcp).
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  turbopack: { root: repoRoot },
  poweredByHeader: false,
};

export default nextConfig;
