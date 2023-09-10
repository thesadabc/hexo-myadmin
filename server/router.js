"use strict";

const {"http":{Router, methods}} = require("director");
const ArticleService = require("./service/article");
const articleController = require("./controller/article");
const authController = require("./controller/auth");

const router = new Router();
router.configure({"async": true, "recurse": false, "strict": false});

// rewite methods for async controller
methods.forEach((m) => {
    const _method = router[m];
    router[m] = function (path, asyncHandler){
        _method.call(router, path, async function (...args) {
            // keep `this`
            const params = args.slice(0, -1);
            const nextFn = args[args.length - 1];
            try{
                await asyncHandler.apply(this, params);
                nextFn();
            } catch(e) {
                nextFn(e);
            }
        });
    };
});

module.exports = function (hexo) {
    router.attach(function () {
        this.hexo = hexo;
        this.service = {
            "post": new ArticleService(hexo, "Post"),
            "page": new ArticleService(hexo, "Page"),
        };
    });

    router.param("type", /(post|page)/);
    router.post("/login", authController.login);
    router.get("/:type", articleController.list);
    router.get("/:type/:id", articleController.detail);
    router.get("/:type/:id/raw", articleController.raw);
    router.post("/:type", articleController.create);
    router.put("/:type/:id", articleController.update);
    router.delete("/:type/:id", articleController.delete);
    router.post("/post/:id/publish", articleController.publishPost);
    router.post("/post/:id/unpublish", articleController.unpublishPost);

    return router.dispatch.bind(router);
};
