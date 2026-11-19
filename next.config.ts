import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    // Isolate dev server artifacts (.next-dev) from production builds (.next)
    // so running `npm run build` never corrupts a live `next dev` client manifest.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    images: {
      unoptimized: true,
    },
  };
}
