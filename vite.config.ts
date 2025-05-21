import basicSSL from "@vitejs/plugin-basic-ssl";

import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [tailwindcss(), basicSSL(), sveltekit()],
    server: {
        proxy: {},
    },
});
