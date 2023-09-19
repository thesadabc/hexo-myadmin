"use strict";

const bcrypt = require("bcryptjs");
module.exports = {
    login() {
        const body = this.req.body;

        if (!body.username || !body.password) throw new Error("data cant be null");

        const username = this.hexo.config.admin.username;
        const passwordHash = this.hexo.config.admin.password_hash;

        if (body.username !== username || !bcrypt.compareSync(body.password, passwordHash))
            throw new Error("login error");

        this.req.session.login = true;
        this.res.send();
    },
};
