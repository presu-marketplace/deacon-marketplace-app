import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "payeutapaokdwxqxesyz.supabase.co" },
    ],
    qualities: [75, 100],
  },
};

export default nextConfig;
