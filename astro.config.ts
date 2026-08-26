import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import robots from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
    adapter: netlify(),
    build: {
        format: 'file',
    },
    devToolbar: {
        enabled: false,
    },
    fonts: [
        {
            cssVariable: '--font-jost',
            display: 'block',
            fallbacks: [],
            name: 'Jost',
            provider: fontProviders.fontsource(),
            styles: ['normal'],
            subsets: ['latin'],
            weights: [400, 500, 600],
        },
        {
            cssVariable: '--font-noto-sans-sc',
            display: 'block',
            name: 'Noto Sans SC',
            provider: fontProviders.fontsource(),
            styles: ['normal'],
            subsets: ['chinese-simplified', 'latin'],
            weights: [400, 500],
        },
        {
            cssVariable: '--font-noto-serif-sc',
            display: 'block',
            fallbacks: ['Georgia', 'serif'],
            name: 'Noto Serif SC',
            provider: fontProviders.fontsource(),
            styles: ['normal'],
            subsets: ['chinese-simplified', 'latin'],
            weights: [700],
        },
    ],
    integrations: [
        react(),
        robots(),
        sitemap({ lastmod: new Date() }),
    ],
    site: 'https://huizehealth.com',
    trailingSlash: 'never',
    vite: {
        plugins: [tailwind()],
    },
});
