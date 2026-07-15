import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.206.173.255:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
