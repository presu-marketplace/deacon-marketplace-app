import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "payeutapaokdwxqxesyz.supabase.co",
    ], // 👈 Allow Google avatars and Supabase storage
  },
};

export default nextConfig;
