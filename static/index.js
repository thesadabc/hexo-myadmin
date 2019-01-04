Vue.use(require("common/plugins"));

Vue.use(window.zPagenav);

axios.interceptors.request.use(function (config) {
    if (config.url.slice(-1) !== "/") config.url += "/";
    config.loadingHandler = Vue.loading();
    config.url = "/admin/api/" + config.url;
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
        return Vue.alert(data.message).then(function () {
            return Promise.reject(data.message);
        });
    }
    return data.data;
}, function (error) {
    if (error.config.loadingHandler) error.config.loadingHandler();
    return Vue.alert(error.toString()).then(function () {
        return Promise.reject(error);
    });
});

const App = require("./app");
const app = new App();
app.$mount("#app");
