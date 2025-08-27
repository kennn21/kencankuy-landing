import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    // Exclude source maps from being processed by loaders
    config.module?.rules?.push({
      test: /\.js\.map$/,
      loader: "ignore-loader",
    });

    return config;
  },

  // ... your other Next.js configurations
};

export default nextConfig;
