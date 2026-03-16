/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.unsplash.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Optimize output (only for production builds)
  // output: 'standalone', // Commented out for dev mode - uncomment for production
  // Enable static optimization
  staticPageGenerationTimeout: 60,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    // optimizeCss can cause 500 in some setups - disable if you see asset 500s
    optimizeCss: false,
    optimizePackageImports: ['@heroicons/react', 'framer-motion', 'date-fns', 'chart.js', 'react-chartjs-2'],
    // optimizeServerReact can be unstable - disabled to avoid 500s
    // optimizeServerReact: true,
    // serverComponentsExternalPackages: ['chart.js', 'react-chartjs-2'],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 4,
  },
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  // Optimize production builds
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
