import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    // The build runs inside a small container. Static generation forks one
    // worker per CPU and each holds its own heap, so on a many-core builder
    // with little RAM that is what runs it out of memory. One worker is
    // plenty for a handful of static pages.
    cpus: 1,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
};

export default nextConfig;
