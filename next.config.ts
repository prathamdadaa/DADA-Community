import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", <-- Ise yahan se hata dena hai
  images: {
    unoptimized: true, // Ise aap rakh sakte hain, isse koi dikkat nahi hogi
  },
};

export default nextConfig;
