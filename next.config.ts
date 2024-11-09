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

export default nextConfig;
