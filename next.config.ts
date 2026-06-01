import type { NextConfig } from "next";

// Deployed to GitHub Pages at https://tolgaosman.github.io/osmanPortfolio/
// → static export + a basePath matching the repo name.
const repo = "osmanPortfolio";
const basePath = process.env.NODE_ENV === "production" ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: process.env.NODE_ENV === "production" ? `/${repo}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
