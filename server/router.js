"use strict";

const {Router} = require("director/http");
const ArticleService = require("../service/article");
const articleController = require("./controller/article");
const authController = require("./controller/auth");

module.exports = function (hexo) {
    const router = new Router();
    router.configure({"async": true, "recurse": false, "strict": false});

    const service = {
        posts: new ArticleService(hexo, "Post");
        pages: new ArticleService(hexo, "Page");
    };
    router.attach(function () {
        this.hexo = hexo;
        this.service = service;
    });

    router.post("/login", authController.login);
    router.get("/:type", articleController.list);
    router.get("/:type/:id", articleController.detail);
    router.get("/:type/:id/raw", articleController.raw);
    router.post("/:type", articleController.create);
    router.put("/:type/:id", articleController.update);
    router.delete("/:type/:id", articleController.delete);
    router.post("/posts/:id/publish", articleController.publishPost);
    router.post("/posts/:id/unpublish", articleController.unpublishPost);

    return router.dispatch.bind(router);
};
