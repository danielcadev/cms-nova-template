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
    // Configuración para deployment
    output: 'standalone',
    serverExternalPackages: ['@prisma/client', 'bcrypt'],
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;