import "dotenv/config";
import adapter from "@sveltejs/adapter-node";

import { sveltePreprocess } from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte"],
    preprocess: [
        {
            name: "strip-announcer",
            markup: ({ content: code }) => {
                code = code.replace(
                    /<div id="svelte-announcer" [\s\S]*?<\/div>/,
                    "{null}"
                );

                return { code };
            },
        },
        sveltePreprocess(),
    ],
    compilerOptions: {
        warningFilter: (warning) => !warning.code.startsWith("a11y_"),
    },
    kit: {
        adapter: adapter({
            pages: "build",
            assets: "build",
            fallback: "404.html",
            precompress: false,
            strict: true,
        }),
        csp: {
            mode: "hash",
            directives: {
                "connect-src": ["*"],
                "default-src": ["none"],

                "font-src": ["self"],
                "style-src": ["self", "unsafe-inline"],
                "img-src": ["*", "data:"],
                "manifest-src": ["self"],
                "worker-src": ["self"],

                "object-src": ["none"],
                "frame-src": ["self"],

                "script-src": ["self", "wasm-unsafe-eval"],

                "script-src-attr": ["unsafe-hashes"],

                "frame-ancestors": ["none"],
            },
        },
        version: {
            pollInterval: 60000,
        },
        paths: {
            relative: false,
        },
        alias: {
            $components: "src/components",
        },
    },
};

export default config;
