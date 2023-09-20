"use strict";

module.exports = class TagService {
    /**
     *  @param  hexo hexo instance
     *  @param  type [Tag, Category]
     */
    constructor(hexo, type) {
        if (type !== "Tag" && type !== "Category") {
            throw new Error("Modle Type should be Tag or Category!");
        }
        this.hexo = hexo;
        this.model = this.hexo.model(type);
    }

    /**
     *  @return doc model
     */
    getTags(name, limit = 10) {
        return this.model.filter(i =>
            !name || i.name.includes(name),
        ).limit(limit);
    }
};
