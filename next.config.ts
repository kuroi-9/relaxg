import type { NextConfig } from "next";
import { hostname } from "os";

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
            }
        ],
    },
}

export default nextConfig;
