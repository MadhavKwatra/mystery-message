import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode:false

  // Fix geoip-country returning 404
  serverExternalPackages: ["geoip-country"],
  // experimental: {
  //   serverComponentsExternalPackages: ["geoip-country"],
  // },
};

export default nextConfig;
