import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Keep nodemailer out of the server bundle; it loads transports dynamically.
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;
