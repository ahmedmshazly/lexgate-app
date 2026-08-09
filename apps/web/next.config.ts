import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lexgate/brand", "@lexgate/localization", "@lexgate/ui"],
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
};

export default nextConfig;
