import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  // swcMinify: true, // Kaldırıldı, Next.js'in yeni sürümlerinde varsayılan olabilir
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
    // Server Actions configuration
    serverActions: {
      bodySizeLimit: '20mb', // PDF dosyaları için yeterli boyut sınırı
    },
    // turbo: { // Kaldırıldı, config.turbopack olarak taşınması veya farklı yapılandırılması gerekebilir
    //   rules: {
    //     '*.svg': ['@svgr/webpack']
    //   }
    // }
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
  },
  
  // Bundle analyzer - comment out in production
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
};

export default nextConfig;
