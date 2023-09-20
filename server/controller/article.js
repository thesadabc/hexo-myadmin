"use strict";

function articleMapping(article, isDetail = true) {
    if (article instanceof Array) return article.map(articleMapping);
    const retPost = {
        "_id": article._id,
        "title": article.title,
        "date": article.date.valueOf(),
        "updated": article.updated.valueOf(),
        "link": article.permalink,
        "isDraft": article.source.includes("_draft"),
    };
    if (isDetail) {
        retPost["content"] = article._content;
    }

    if (article.layout === "post") {
        retPost.tags = article.tags.map(t => t.name);
        retPost.categories = article.categories.map(t => t.name);
    }
    return retPost;
}

module.exports = {
    list(type) {
        const page = (+this.req.query.page || 1) - 1;
        const title = this.req.query.title?.trim();
        const category = this.req.query.category?.trim();
        const tag = this.req.query.tag?.trim();
        const pageSize = 15;
        const postList = this.service[type].list({category, title, tag});

        const total = postList.length;
        const list = postList
            .skip(page * pageSize)
            .limit(pageSize)
            .map(p => articleMapping(p, false));
        this.res.send({list, total});
    },

    detail(type, id) {
        const article = this.service[type].detail(id);
        if (!article) throw new Error("resource " + id + " not found");
        this.res.send(articleMapping(article));
    },
    raw(type, id) {
        const article = this.service[type].raw(id);
        if (!article) throw new Error("resource " + id + " not found");
        this.res.send({"meta": article.data, "content": article.content});
    },
    async create(type) {
        const {meta, content} = this.req.body;
        const article = await this.service[type].create({meta, content});
        this.res.send(articleMapping(article));
    },

    async update(type, id) {
        const {meta, content} = this.req.body;
        if (!this.service[type].detail(id))
            throw new Error("resource " + id + " not found");

        const article = await this.service[type].update(id, {meta, content});
        this.res.send(articleMapping(article));
    },

    async delete(type, id) {
        if (!this.service[type].detail(id))
            throw new Error("resource " + id + " not found");
        await this.service[type].delete(id);
        this.res.send();
    },

    async publishPost(id) {
        if (!this.service.post.detail(id))
            throw new Error("resource " + id + " not found");
        const {_id} = await this.service.post.publish(id);
        this.res.send({_id});
    },

    async unpublishPost(id) {
        if (!this.service.post.detail(id))
            throw new Error("resource " + id + " not found");
        const {_id} = await this.service.post.unpublish(id);
        this.res.send({_id});
    },
};
