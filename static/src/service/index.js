axios.defaults.baseURL = './api';

module.exports.install = function(Vue) {
    Vue.service = {
        post: require("./post"),
        page: require("./page"),
    }
}
