Vue.use(window.zPagenav);
Vue.use(require("./plugin"));
Vue.use(require("./service"));

axios.interceptors.request.use(function(config) {
    if(config.url.slice(-1) !== "/") config.url += "/";
    config.loadingHandler = Vue.loading();
    return config;
});

axios.interceptors.response.use(function(response) {
    if (response.config.loadingHandler) response.config.loadingHandler();
    if (response.data.code) {
        if(response.data.code === 401){
            window.location.href = "./login.html";
            return;
        }
        return Vue.alert(response.data.msg).then(function() {
            return Promise.reject(response.data)
        });
    }
    return response.data.data;
}, function(error) {
    if (error.config.loadingHandler) error.config.loadingHandler();
    return Vue.alert(error.toString()).then(function() {
        return Promise.reject(error)
    });
});


new Vue({
    name: "Root",
    el: "#app",
    components: {
        "m-nav": require("./components/navbar"),
        "m-side": require("./components/sidebar"),
    },
    data: {
        sideMenus: [
            { text: "POST LIST", href: { name: "post-list" } },
            { text: "PAGE LIST", href: { name: "page-list" } },
        ],
        navMenus: [
            { text: "HOME", href: "#/" },
            { text: "BLOG", href: "/" },
        ]
    },
    router: new VueRouter({
        routes: [{
            path: '/posts',
            name: "post-list",
            component: require("./page/post-list"),
            alias: '/'
        }, {
            path: '/posts/new',
            name: "post-new",
            component: require("./page/post-edit")
        }, {
            path: '/posts/:id/edit',
            name: "post-edit",
            component: require("./page/post-edit")
        }, {
            path: '/pages',
            name: "page-list",
            component: require("./page/page-list"),
            alias: '/'
        }, {
            path: '/pages/new',
            name: "page-new",
            component: require("./page/page-edit")
        }, {
            path: '/pages/:id/edit',
            name: "page-edit",
            component: require("./page/page-edit")
        }]
    }),
});
