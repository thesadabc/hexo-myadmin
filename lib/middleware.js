module.exports.send = function(req, resp, next) {
    resp.send = function(data) {
        let ret = { msg: "unknow error", code: -1 };

        switch (typeof(data)) {
            case "string":
                ret.code = 1;
                ret.msg = data;
                break;
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
    }
    next();
};
