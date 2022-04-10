Vue.use(require("common/plugins"));
Vue.use(window.zPagenav);

axios.interceptors.request.use(function (config) {
    if (config.url.slice(-1) !== "/") config.url += "/";
    config.loadingHandler = Vue.loading();
    config.url = "api/" + config.url;
    return config;
});

axios.interceptors.response.use(function (resp) {
    if (resp.config.loadingHandler) resp.config.loadingHandler();
    const data = resp.data;
    if (data.code) {
        if (data.code === 401) {
            window.location.href = "./login.html";
            return;
        }
        Vue.alert(data.msg);
        throw new Error(data.msg);
    }
    return data.data;
}, function (error) {
    if (error.config.loadingHandler) error.config.loadingHandler();
    Vue.alert(error.toString());
    throw error;
});

const App = require("./app");
const app = new App(); // happy for eslint no-new
app.$mount("#app");
