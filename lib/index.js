let path = require("path"),
    session = require("express-session"),
    serveStatic = require("serve-static"),
    bodyParser = require("body-parser"),
    query = require("connect-query");

let apiRouter = require("./router");
let middleware = require("./middleware");

if (hexo.config.admin) {
    if (!hexo.config.admin.username) {
        throw new Error("admin username config error");
        hexo.config.admin = null;
    }
    if (!hexo.config.admin.password_hash || hexo.config.admin.password_hash.length <= 32) {
        throw new Error("admin password_hash config error");
        hexo.config.admin = null;
    }
    if (!hexo.config.admin.secret) {
        throw new Error("admin secret config error");
        hexo.config.admin = null;
    }
}

hexo.extend.filter.register("server_middleware", function(app) {
    let adminRoot = hexo.config.root + "admin";
    let apiRoot = adminRoot + "/api";

    // main route
    app.use(adminRoot, serveStatic(path.join(__dirname, "../dist")));

    if (hexo.config.admin) {
        app.use(apiRoot, session({
            resave: false,
            saveUninitialized: false,
            secret: hexo.config.admin.secret
        }));
    }
    // api router middleware
    app.use(apiRoot, query());
    app.use(apiRoot, bodyParser.json({ limit: "50mb" }));
    app.use(apiRoot, middleware.send);

    // api router
    app.use(apiRoot, apiRouter(hexo));

    app.use(function(err, req, resp, next) {
        console.log(err);
        if (typeof(err) !== "number") {
            err = err.toString();
        }
        resp.send(err);
    });
});
