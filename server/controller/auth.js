"use strict";

const bcrypt = require("bcryptjs");
module.exports = {
    login() {
        const body = this.req.body;

        if (!body.u || !body.p) throw new Error("data cant be null");

        const username = this.hexo.config.admin.username;
        const passwordHash = this.hexo.config.admin.password_hash;

        if (body.u !== username || !bcrypt.compareSync(body.p, passwordHash))
            throw new Error("login error");

        this.req.session.login = true;
    },
};
