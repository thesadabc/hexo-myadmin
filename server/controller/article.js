"use strict";

function articleMapping(article) {
    if (article instanceof Array) return article.map(articleMapping);
    const retPost = {
        "_id": article._id,
        "title": article.title,
        "content": article._content,
        "date": article.date.valueOf(),
        "updated": article.updated.valueOf(),
        "link": article.permalink,
        "isDraft": article.source.includes("_draft"),
    };

    if (article.layout === "post") {
        retPost.tags = article.tags.toArray().map(t => t.name);
        retPost.categories = article.categories.toArray().map(t => t.name);
    }
    return retPost;
}

module.exports = {
    list(type) {
        const page = (+this.req.query.page || 1) - 1;
        const limit = 15;
        const skip = page * limit;
        const postList = this.service[type].list();
        const list = postList.slice(skip, skip + limit)
            .map(articleMapping).map((p) => {
                delete (p.content);
                return p;
            });
        this.res.send({list, "total": postList.length});
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
