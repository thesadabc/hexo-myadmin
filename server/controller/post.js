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
            const page = (+this.req.query.page || 1) - 1;
            const limit = 15;
            const skip = page * limit;
            const list = postService.list().slice(skip, skip + limit)
                .map(post2Api).map((p) => {
                    delete (p.content);
                    return p;
                });

            return {list, "total": list.length};
        },

        detail(id) {
            const post = postService.detail(id);
            if (!post) throw new Error("resource " + id + " not found");
            return post2Api(post);
        },
        raw(id) {
            const post = postService.raw(id);
            if (!post) throw new Error("resource " + id + " not found");
            return {"meta": post.data, "content": post.content};
        },
        async create() {
            const body = this.req.body;
            const post = {
                "meta": body.meta,
                "content": body.content,
            };
            const source = await postService.create(post);
            const postDetail = await postService.detail({source});
            return post2Api(postDetail);
        },

        async update(id) {
            const body = this.req.body;
            const post = {
                "meta": body.meta,
                "content": body.content,
            };

            if (!postService.detail(id)) throw new Error("resource " + id + " not found");

            const source = await postService.update(id, post);
            const postDetail = await postService.detail({source});
            return post2Api(postDetail);
        },

        delete(id) {
            if (!postService.detail(id)) throw new Error("resource " + id + " not found");
            return postService.delete(id);
        },

        publish(id) {
            if (!postService.detail(id)) throw new Error("resource " + id + " not found");
            return postService.publish(id);
        },

        unpublish(id) {
            if (!postService.detail(id)) throw new Error("resource " + id + " not found");
            return postService.unpublish(id);
        },

    };
};
