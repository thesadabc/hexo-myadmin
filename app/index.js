import {createApp} from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import {basicSetup, EditorView} from "codemirror";
import VueCodemirror from "vue-codemirror";


import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(ElementPlus, {"size": "small", "zIndex": 3000, "locale": zhCn});
app.use(router);

app.use(VueCodemirror, {
    "autofocus": false,
    "disabled": false,
    "indentWithTab": true,
    "tabSize": 4,
    "extensions": [basicSetup, EditorView.lineWrapping],
});

app.mount("body");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
