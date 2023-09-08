"use strict";

function articleMapping(article) {
    if (article instanceof Array) return article.map(articleMapping);
    const retPost = {
        "_id": article._id,
        "source": article.source,
        "title": article.title,
        "content": article._content,
        "date": article.date.valueOf(),
        "updated": article.updated.valueOf(),
        "link": article.permalink,
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
            this.resp.send({list, "total": postList.length});
        },

        detail(type, id) {
            const article = this.service[type].detail(id);
            if (!article) throw new Error("resource " + id + " not found");
            this.resp.send(articleMapping(article));
        },
        raw(type, id) {
            const article = this.service[type].raw(id);
            if (!article) throw new Error("resource " + id + " not found");
            this.resp.send({"meta": article.data, "content": article.content});
        },
        async create(type) {
            const {meta, content} = this.req.body;
            const article = {meta, content};
            const source = await this.service[type].create(article);
            const article = await this.service[type].detail({source});
            this.resp.send(articleMapping(article));
        },

        async update(type, id) {
            const body = this.req.body;
            const article = {
                "meta": body.meta,
                "content": body.content,
            };

            if (!this.service[type].detail(id))
                throw new Error("resource " + id + " not found");

            const source = await this.service[type].update(id, article);
            const article = await this.service[type].detail({source});
            this.resp.send(articleMapping(article));
        },

        delete(type, id) {
            if (!this.service[type].detail(id))
                throw new Error("resource " + id + " not found");
            this.resp.send(this.service[type].delete(id));
        },

        publishPost(id) {
            if (!this.service.posts.detail(id))
                throw new Error("resource " + id + " not found");
            this.resp.send(this.service.posts.publish(id));
        },

        unpublishPost(id) {
            if (!this.service.posts.detail(id))
                throw new Error("resource " + id + " not found");
            this.resp.send(this.service.posts.unpublish(id));
        },
};
