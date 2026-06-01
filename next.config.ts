import type { NextConfig } from "next";

// Deployed to GitHub Pages at https://tolgaosman.github.io/osmanPortfolio2/
// → static export + a basePath matching the repo name.
const repo = "osmanPortfolio2";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? `/${repo}` : "",
  assetPrefix: process.env.NODE_ENV === "production" ? `/${repo}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
