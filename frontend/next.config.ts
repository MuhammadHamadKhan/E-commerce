import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
  images: {
    // next/image may load photos from these hosts:
    // - Cloudinary: where bakery product images are uploaded
    // - lh3.googleusercontent.com: placeholder art used by the design reference
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
