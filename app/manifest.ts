import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'RelaxG',
        short_name: 'RelaxG',
        description: 'A tool to help with manga upscaling',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '../public/globe.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
            },
            {
                src: '../public/globe.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
            },
        ],
    }
}