"use strict";

const bcrypt = require("bcrypt-nodejs");

module.exports = function (hexo) {
    return {
        login() {
            const body = this.req.body;

            if (!body.u || !body.p) return Promise.reject(new Error("data cant be null"));

            const username = hexo.config.admin.username;
            const passwordHash = hexo.config.admin.password_hash;

            if (body.u !== username || !bcrypt.compareSync(body.p, passwordHash)) { return Promise.reject(new Error("login error")); }

            this.req.session.login = true;
            return Promise.resolve({});
        },
    };
};
