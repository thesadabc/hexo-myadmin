"use strict";

module.exports.send = function (req, resp, next) {
    resp.send = function (data) {
        const ret = {"msg": "unknow error", "code": -1};

        switch (typeof (data)) {
            case "string":
                ret.code = 1;
                ret.msg = data;
                break;
            case "undefined":
            case "object":
                ret.code = 0;
                ret.msg = "ok";
                ret.data = data;
                break;
            case "number":
                ret.code = data;
                ret.msg = "error: " + data;
                break;
        }
        resp.setHeader("Content-Type", "application/json");
        resp.end(JSON.stringify(ret));
    };
    next();
};

module.exports.noop = function (req, resp, next) {
    next();
};

module.exports.auth = function (req, resp, next) {
    if (req.session && req.session.login) return next();
    resp.send(401);
};

module.exports.errorHandler = function (err, req, resp, next) {
    console.error(err);
    if (typeof (err) !== "number") {
        err = err.toString();
    }
    resp.send(err);
};
