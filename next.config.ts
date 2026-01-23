import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better bundle optimization
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@supabase/supabase-js'],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Use webpack instead of Turbopack for better control over bundle optimization
  webpack: (config, { isServer, webpack }) => {
    // Tree shaking optimizations
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };
    
    if (!isServer) {
      // Better code splitting for client-side
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Separate large dependencies into their own chunks
          framerMotion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          supabase: {
            name: 'supabase',
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          react: {
            name: 'react-vendor',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Add empty turbopack config to silence the error (we're using webpack)
  turbopack: {},
};

export default nextConfig;
