import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Keep nodemailer out of the server bundle; it loads transports dynamically.
  serverExternalPackages: ["nodemailer"],
  // Hosts the <Image /> component is allowed to optimize. Everything else is
  // served same-origin (public/ files and the /api/r2/[...key] proxy).
  images: {
    // Same-origin sources the <Image /> component may optimize. Defining
    // localPatterns turns the list into an allowlist, so every local file fed
    // to <Image /> has to be listed here.
    localPatterns: [
      // Gallery images and cache-busted landing images
      // (/api/r2/<slug>/landing-image?v=<updatedAt>, see src/lib/home.ts).
      // `search` is deliberately omitted: the landing image appends a
      // timestamp query so a freshly uploaded image bypasses the optimizer
      // cache, and the value changes on every upload, so it cannot be pinned
      // to one exact string.
      { pathname: "/api/r2/**" },
      // Static /public files, all referenced without a query string.
      { pathname: "/aboutus.jpg", search: "" },
      { pathname: "/awards.jpg", search: "" },
      { pathname: "/members.jpg", search: "" },
      { pathname: "/PBCA-logo.png", search: "" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
