import {ElMessage} from "element-plus";
import router from "@/router";
import axios from "axios";

axios.defaults.headers["Content-Type"] = "application/json";
const service = axios.create({"baseURL": "./api", "timeout": 100000});

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        if (
            res.request.responseType === "blob" ||
            res.request.responseType === "arraybuffer"
        ) {
            return res.data;
        }
        const code = res.data.code ;
        if (!code) return res.data;

        const msg = res.data.data || res.data.msg || `系统未知错误: ${code}`;

        ElMessage.error(msg);

        if (code === 401) {
            router.replace({"path": "/login"});
            throw new Error("无效的会话，或者会话已过期，请重新登录。");
        }
        return res.data;
    }, ({message}) => {

        if (message == "Network Error") {
            ElMessage.error("网络错误，请检查网络后重试");
        } else if (message.includes("timeout")) {
            ElMessage.error("系统接口请求超时");
        } else if (message.includes("Request failed with status code")) {
            ElMessage.error("系统接口" + message.substr(message.length - 3) + "异常");
        } else {
            ElMessage.error(message);
        }
        return {"code": -1};
    },
);

export default service;
