import {fileURLToPath, URL} from "node:url";
import {defineConfig} from "vite";
import {resolve} from "node:path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    "plugins": [vue()],
    "base": "/admin/",
    "clearScreen": false,
    "server": {
        "proxy": {
            "/admin/api": {
                "target": "http://127.0.0.1:4000",
                "changeOrigin": true,
            },
        },
    },
    "build": {
        "outDir": "../dist",
        "rollupOptions": {
            "input": {
                "main": resolve(__dirname, "./index.html"),
                "login": resolve(__dirname, "./login.html"),
            },
        },
    },

    "resolve": {
        "alias": {
            "@": fileURLToPath(new URL("./", import.meta.url)),
        },
    },
});
