import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/jobs-manager',
                permanent: true,
            },
        ];
    },
};

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'backend',
                port: '8082',
            },
            {
                protocol: 'https',
                hostname: 'api.relaxg.app',
            },
            {
                protocol: 'https',
                hostname: 'api-dev.relaxg.app',
            }
        ],
    },
}

export default nextConfig;
