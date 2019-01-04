"use strict";

const PostService = require("../service/post");

function post2Api(post) {
    if (post instanceof Array) return post.map(post2Api);
    const retPost = {
        "_id": post._id,
        "source": post.source,
        "title": post.title,
        "content": post._content,
        "date": post.date.valueOf(),
        "updated": post.updated.valueOf(),
        "link": post.permalink,
    };

    if (post.layout === "post") {
        retPost.tags = post.tags.toArray().map(t => t.name);
        retPost.categories = post.categories.toArray().map(t => t.name);
    }
    return retPost;
}

module.exports = function (hexo, type) {
    const postService = new PostService(hexo, type);

    return {
        list() {
            let page = +this.req.query.page || 1;
            page--;
            const limit = 15;
            const skip = page * limit;
            const list = postService.list();

            return Promise.resolve({
                "list": list.slice(skip, skip + limit).map(post2Api).map((p) => {
                    delete (p.content);
                    return p;
                }),
                "total": list.length,
            });
        },

        detail(id) {
            const post = postService.detail(id);
            if (!post) return Promise.reject(new Error("resource " + id + " not found"));
            return Promise.resolve(post).then(post2Api);
        },
        raw(id) {
            const post = postService.raw(id);
            if (!post) return Promise.reject(new Error("resource " + id + " not found"));
            return Promise.resolve(post).then((r) => ({"meta": r.data, "content": r.content}));
        },
        create() {
            const body = this.req.body;
            const post = {
                "meta": body.meta,
                "content": body.content,
            };
            return postService.create(post).then(
                (source) => postService.detail({source})
            ).then(post2Api);
        },

        update(id) {
            const body = this.req.body;
            const post = {
                "meta": body.meta,
                "content": body.content,
            };

            if (!postService.detail(id)) { return Promise.reject(new Error("resource " + id + " not found")); }

            return postService.update(id, post).then(
                (source) => postService.detail({source})
            ).then(post2Api);
        },

        delete(id) {
            if (!postService.detail(id)) { return Promise.reject(new Error("resource " + id + " not found")); }
            return postService.delete(id);
        },

        publish(id) {
            if (!postService.detail(id)) { return Promise.reject(new Error("resource " + id + " not found")); }

            return postService.publish(id);
        },

        unpublish(id) {
            if (!postService.detail(id)) { return Promise.reject(new Error("resource " + id + " not found")); }
            return postService.unpublish(id);
        },

    };
};
