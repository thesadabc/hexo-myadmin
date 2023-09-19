
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import {createApp} from "vue";

import LoginApp from "./LoginApp.vue";
const app = createApp(LoginApp);
app.use(ElementPlus, {"zIndex": 3000, "locale": zhCn});
app.mount("body");
