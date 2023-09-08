import {fileURLToPath, URL} from "node:url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    "plugins": [vue()],
    "clearScreen": false,
    "server": {
        "proxy": {
            "/admin/api": {
                "target": "http://127.0.0.1:4000",
                "changeOrigin": true,
            },
        },
    },
    "resolve": {
        "alias": {
            "@": fileURLToPath(new URL("./", import.meta.url)),
        },
    },
});
