import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode:false

  // Fix geoip-country returning 404
  serverExternalPackages: ["geoip-country"],
  outputFileTracingIncludes: {
    "/": ["node_modules/geoip-country/data/*"],
  },
};

export default nextConfig;
