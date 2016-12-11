var bcrypt = require("bcrypt-nodejs");

module.exports = function(hexo) {

    return {
        login() {
            var body = this.req.body;

            if (!body.u || !body.p) return Promise.reject("data cant be null");

            var username = hexo.config.admin.username;
            var passwordHash = hexo.config.admin.password_hash;
            
            if (body.u !== username || !bcrypt.compareSync(body.p, passwordHash))
                return Promise.reject("login error");

            this.req.session.login = true;
            return Promise.resolve({});
        },
    }

}
