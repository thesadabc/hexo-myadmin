/* global hexo */
"use strict";

const path = require("path");
const session = require("express-session");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const connectQuery = require("connect-query");

const createRouter = require("./router");
const middleware = require("./middleware");

if (hexo.config.admin) {
    if (!hexo.config.admin.username) {
        throw new Error("admin username config error");
    }
    if (!hexo.config.admin.password_hash || hexo.config.admin.password_hash.length <= 32) {
        throw new Error("admin password_hash config error");
    }
    if (!hexo.config.admin.secret) {
        throw new Error("admin secret config error");
    }
}


hexo.extend.filter.register("server_middleware", function (app) {
    const adminRoot = hexo.config.root + "admin";
    const apiRoot = adminRoot + "/api";

    // main route
    app.use(adminRoot, serveStatic(path.join(__dirname, "../dist")));

    // params
    app.use(apiRoot, connectQuery());
    app.use(apiRoot, bodyParser.json({"limit": "50mb"}));

    // helper
    app.use(apiRoot, middleware.helper);

    // auth
    if (hexo.config.admin) {
        app.use(apiRoot, session({
            "resave": false,
            "saveUninitialized": false,
            "secret": hexo.config.admin.secret,
        }));
        app.use(apiRoot, middleware.auth);
    }

    // api router
    app.use(apiRoot, createRouter(hexo));

    // error handler
    app.use(apiRoot, middleware.errorHandler);
});
