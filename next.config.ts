import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static HTML Export enable karta hai GitHub Pages ke liye
  images: {
    unoptimized: true, // GitHub Pages par Next.js image optimization bypass karta hai
  },
};

export default nextConfig;
