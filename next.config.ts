import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/job-manager', // Remplace par ta page cible
                permanent: true, // Utilise "true" si c'est une redirection permanente
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
        ],
    },
}

export default nextConfig;
