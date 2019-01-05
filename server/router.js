"use strict";

const director = require("director");
const middleware = require("./middleware");
const postControllerFac = require("./controller/post");
const authControllerFac = require("./controller/auth");
const router = new director.http.Router().configure({"async": true, "recurse": false, "strict": false});

function wrapMidfn(midfn) {
    return function (...args) {
        const nextfn = args.pop();
        return midfn(this.req, this.res, nextfn);
    };
}

function wrapCtrfn(ctrfn) {
    return async function (...args) {
        const nextfn = args.pop();
        try {
            const data = await ctrfn.apply(this, args);
            this.res.send(data);
        } catch (e) {
            nextfn(e);
        }
    };
}

["get", "post", "put", "delete"].forEach(function (method) {
    const _method = router[method].bind(router);
    router[method] = function (path, ...fns) {
        const ctrfn = wrapCtrfn(fns.pop());
        const midfns = fns.map(wrapMidfn);
        return _method(path, [...midfns, ctrfn]);
    };
});

module.exports = function (hexo) {
    const loginRequire = hexo.config.admin ? middleware.auth : middleware.noop;

    const postController = postControllerFac(hexo, "Post");
    router.get("/posts", loginRequire, postController.list);
    router.get("/posts/:id", loginRequire, postController.detail);
    router.get("/posts/:id/raw", loginRequire, postController.raw);
    router.post("/posts", loginRequire, postController.create);
    router.put("/posts/:id", loginRequire, postController.update);
    router.delete("/posts/:id", loginRequire, postController.delete);
    router.post("/posts/:id/publish", loginRequire, postController.publish);
    router.post("/posts/:id/unpublish", loginRequire, postController.unpublish);

    const pageController = postControllerFac(hexo, "Page");
    router.get("/pages", loginRequire, pageController.list);
    router.get("/pages/:id", loginRequire, pageController.detail);
    router.get("/pages/:id/raw", loginRequire, pageController.raw);
    router.post("/pages", loginRequire, pageController.create);
    router.put("/pages/:id", loginRequire, pageController.update);
    router.delete("/pages/:id", loginRequire, pageController.delete);

    if (hexo.config.admin) {
        const authController = authControllerFac(hexo);
        router.post("/login", authController.login);
    }

    return router.dispatch.bind(router);
};
