import type { NextConfig } from "next";

// The Express API runs on its own host (Render in production). Proxying through
// this app keeps the browser on one origin, so the httpOnly auth cookie is first-party.
const API_ORIGIN = (process.env.API_ORIGIN || "http://localhost:5000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` },
      { source: "/uploads/:path*", destination: `${API_ORIGIN}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
