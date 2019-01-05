"use strict";

const bcrypt = require("bcrypt-nodejs");
module.exports = function (hexo) {
    return {
        login() {
            const body = this.req.body;

            if (!body.u || !body.p) throw new Error("data cant be null");

            const username = hexo.config.admin.username;
            const passwordHash = hexo.config.admin.password_hash;

            if (body.u !== username || !bcrypt.compareSync(body.p, passwordHash)) throw new Error("login error");

            this.req.session.login = true;
        },
    };
};
