module.exports = new VueRouter({
    "routes": [{
        "path": "/",
        "redirect": "/posts",
    }, {
        "path": "/posts",
        "name": "post-list",
        "component": require("./pages/post-list"),
        "alias": "/",
    }, {
        "path": "/posts/new",
        "name": "post-new",
        "component": require("./pages/post-edit"),
    }, {
        "path": "/posts/:id/edit",
        "name": "post-edit",
        "component": require("./pages/post-edit"),
    }, {
        "path": "/pages",
        "name": "page-list",
        "component": require("./pages/page-list"),
    }, {
        "path": "/pages/new",
        "name": "page-new",
        "component": require("./pages/page-edit"),
    }, {
        "path": "/pages/:id/edit",
        "name": "page-edit",
        "component": require("./pages/page-edit"),
    }],
});
