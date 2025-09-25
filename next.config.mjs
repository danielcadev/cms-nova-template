/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuration for deployment
  output: 'standalone',
  serverExternalPackages: ['@prisma/client'],
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: true,
  },
  // Headers CORS eliminados - Better Auth los maneja automáticamente con trustedOrigins
}

export default nextConfig
