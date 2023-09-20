"use strict";

module.exports = {
    list(type) {
        const name = this.req.query.name?.trim();
        const tagList = this.service[type].getTags(name);
        const list = tagList.map(c => c.name);
        this.res.send({list});
    },
};
