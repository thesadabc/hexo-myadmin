var director = require("director");

var postControllerFac = require("./controller/post");
var authControllerFac = require("./controller/auth");

var router = new director.http.Router().configure({ async: true, recurse: false, strict: false });


["get", "post", "put", "delete"].map(function(method) {
    var _method = router[method].bind(router);

    router[method] = function(path, ...fns) {
        var fn = fns.pop();
        return _method(path, [...fns, function(...args) {
            var next = args.pop();
            fn.apply(this, args).then((d) => this.res.send(d)).catch(next);
        }]);
    };
});


function middlewareEmpty(...args) {
    args[args.length - 1]();
}

function middlewareLogin(...args) {
    var next = args.pop();
    if (this.req.session && this.req.session.login) return next();
    return next(401);
}

module.exports = function(hexo) {
    var loginRequire = hexo.config.admin ? middlewareLogin : middlewareEmpty;

    var postController = postControllerFac(hexo, "Post");
    router.get("/posts", loginRequire, postController.list);
    router.get("/posts/:id", loginRequire, postController.detail);
    router.get("/posts/:id/raw", loginRequire, postController.raw);
    router.post("/posts", loginRequire, postController.create);
    router.put("/posts/:id", loginRequire, postController.update);
    router.delete("/posts/:id", loginRequire, postController.delete);
    router.post("/posts/:id/publish", loginRequire, postController.publish);
    router.post("/posts/:id/unpublish", loginRequire, postController.unpublish);

    var pageController = postControllerFac(hexo, "Page");
    router.get("/pages", loginRequire, pageController.list);
    router.get("/pages/:id", loginRequire, pageController.detail);
    router.get("/pages/:id/raw", loginRequire, pageController.raw);
    router.post("/pages", loginRequire, pageController.create);
    router.put("/pages/:id", loginRequire, pageController.update);
    router.delete("/pages/:id", loginRequire, pageController.delete);

    if (hexo.config.admin) {
        var authController = authControllerFac(hexo);
        router.post("/login", authController.login);
    }

    return router.dispatch.bind(router);
}
