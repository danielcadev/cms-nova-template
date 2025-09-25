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
  // output: 'standalone', // Deshabilitado - causa problemas con archivos estáticos
  serverExternalPackages: ['@prisma/client'],
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Mejorar el manejo de errores en producción
  poweredByHeader: false,
  compress: true,
  // Headers CORS eliminados - Better Auth los maneja automáticamente con trustedOrigins
}

export default nextConfig
