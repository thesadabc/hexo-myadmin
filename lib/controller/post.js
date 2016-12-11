var PostService = require("../service/post");


function post2Api(post) {
    if (post instanceof Array) return post.map(post2Api);
    var retPost = {
        _id: post._id,
        source: post.source,
        title: post.title,
        content: post._content,
        date: post.date.valueOf(),
        updated: post.updated.valueOf(),
        link: post.permalink
    };

    if (post.layout === "post") {
        retPost.tags = post.tags.toArray().map(t => t.name);
        retPost.categories = post.categories.toArray().map(t => t.name);
    }
    return retPost;
}


module.exports = function(hexo, type) {

    var postService = new PostService(hexo, type);

    return {

        list() {
            var page = +this.req.query.page || 1;
            page--;
            var limit = 10;
            var skip = page * limit;
            var list = postService.list();

            return Promise.resolve({
                list: list.slice(skip, skip + limit).map(post2Api),
                total: list.length
            });
        },

        detail(id) {
            var post = postService.detail(id);
            if (!post) return Promise.reject("resource " + id + " not found");
            return Promise.resolve(post).then(post2Api);
        },
        raw(id) {
            var post = postService.raw(id);
            if (!post) return Promise.reject("resource " + id + " not found");
            return Promise.resolve(post).then((r) => ({ meta: r.data, content: r.content }));
        },
        create() {
            var body = this.req.body;
            var post = {
                meta: body.meta,
                content: body.content,
            };
            return postService.create(post).then(
                (source) => postService.detail({ source })
            ).then(post2Api);
        },

        update(id) {
            var body = this.req.body;
            var post = {
                meta: body.meta,
                content: body.content
            };

            if (!postService.detail(id))
                return Promise.reject("resource " + id + " not found");

            return postService.update(id, post).then(
                (source) => postService.detail({ source })
            ).then(post2Api);
        },

        delete(id) {
            if (!postService.detail(id))
                return Promise.reject("resource " + id + " not found");
            return postService.delete(id);
        },

        publish(id) {
            if (!postService.detail(id))
                return Promise.reject("resource " + id + " not found");

            return postService.publish(id);
        },

        unpublish(id) {
            if (!postService.detail(id))
                return Promise.reject("resource " + id + " not found");
            return postService.unpublish(id)
        },

    }

}
