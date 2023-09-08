import {createApp} from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";


import App from "./pages/homePage.vue";
import router from "./router";

const app = createApp(App);
app.use(ElementPlus, {"size": "small", "zIndex": 3000, "locale": zhCn});
app.use(router);
app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
