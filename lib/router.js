let director = require("director");

let postControllerFac = require("./controller/post");
let authControllerFac = require("./controller/auth");

let router = new director.http.Router().configure({ async: true, recurse: false, strict: false });


["get", "post", "put", "delete"].map(function(method) {
    let _method = router[method].bind(router);

    router[method] = function(path, ...fns) {
        let fn = fns.pop();
        return _method(path, [...fns, function(...args) {
            let next = args.pop();
            fn.apply(this, args).then((d) => this.res.send(d)).catch(next);
        }]);
    };
});


function middlewareEmpty(...args) {
    args[args.length - 1]();
}

function middlewareLogin(...args) {
    let next = args.pop();
    if (this.req.session && this.req.session.login) return next();
    return next(401);
}

module.exports = function(hexo) {
    let loginRequire = hexo.config.admin ? middlewareLogin : middlewareEmpty;

    let postController = postControllerFac(hexo, "Post");
    router.get("/posts", loginRequire, postController.list);
    router.get("/posts/:id", loginRequire, postController.detail);
    router.get("/posts/:id/raw", loginRequire, postController.raw);
    router.post("/posts", loginRequire, postController.create);
    router.put("/posts/:id", loginRequire, postController.update);
    router.delete("/posts/:id", loginRequire, postController.delete);
    router.post("/posts/:id/publish", loginRequire, postController.publish);
    router.post("/posts/:id/unpublish", loginRequire, postController.unpublish);

    let pageController = postControllerFac(hexo, "Page");
    router.get("/pages", loginRequire, pageController.list);
    router.get("/pages/:id", loginRequire, pageController.detail);
    router.get("/pages/:id/raw", loginRequire, pageController.raw);
    router.post("/pages", loginRequire, pageController.create);
    router.put("/pages/:id", loginRequire, pageController.update);
    router.delete("/pages/:id", loginRequire, pageController.delete);

    if (hexo.config.admin) {
        let authController = authControllerFac(hexo);
        router.post("/login", authController.login);
    }

    return router.dispatch.bind(router);
}
