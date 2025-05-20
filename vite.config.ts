import basicSSL from "@vitejs/plugin-basic-ssl";

import { sveltekit } from "@sveltejs/kit/vite";
import { createSitemap } from "svelte-sitemap/src/index";
import { defineConfig, type PluginOption } from "vite";
import tailwindcss from '@tailwindcss/vite';

const generateSitemap: PluginOption = {
    name: "generate-sitemap",
    async writeBundle() {
        await createSitemap(`https://nexara.club/`, {
            changeFreq: 'monthly',
            outDir: '.svelte-kit/output/prerendered/pages',
            resetTime: true
        });
    }
}

export default defineConfig({
    plugins: [
        tailwindcss(),
        basicSSL(),
        sveltekit(),
        generateSitemap
    ],
    build: {
        sourcemap: true,
    },
    server: {
        proxy: {}
    },
});
