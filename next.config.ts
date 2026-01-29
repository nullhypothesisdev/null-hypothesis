import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Ensure we are using output: 'export' if deploying statically (e.g., to Vercel/GitHub Pages)
  // output: 'export', 

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // FIX: Add the Supabase hostname for dynamic image loading from storage
      {
        protocol: 'https',
        hostname: 'gefqshdrgozkxdiuligl.supabase.co',
      },
    ],
  },

  // Example for experimental features (if you use app router/server components)
  experimental: {
    // typedRoutes: true,
    // serverComponentsExternalPackages: ["@tremor/react"],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);