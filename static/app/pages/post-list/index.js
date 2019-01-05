const postService = require("services/post");

module.exports = Vue.extend({
    "template": require("./index.html"),
    "components": {
        "m-page": require("../base-page"),
        "m-table": require("components/table"),
    },
    "mixins": [Vue.routeRefreshMixin],
    data() {
        return {"posts": [], "total": 0};
    },
    // render config
    "computed": {
        tableConfig() {
            return {
                "header": ["title", "categories", "tags", "date", "updated", "status", "action"],
                "data": this.posts.map(function (post) {
                    const status = ~post.source.indexOf("_draft") ? "unpublish" : "publish";
                    const action = [
                        {"to": {"name": "post-edit", "params": {"id": post._id}}, "text": "edit"},
                    ];
                    if (status === "publish") {
                        action.push({"event": "unpublish", "text": "unpublish"});
                        action.push({"href": post.link, "text": "view"});
                    } else {
                        action.push({"event": "publish", "text": "publish"});
                    }
                    action.push({"event": "delete", "text": "delete"});
                    return {
                        "rowItem": post,
                        "items": [
                            post.title, post.categories.join(", "), post.tags.join(", "),
                            Vue.tools.formatTime(post.date), Vue.tools.formatTime(post.updated), status, action,
                        ],
                    };
                }),
                "total": this.total,
            };
        },
    },
    routerRefresh(route) {
        this.refresh();
    },
    "methods": {
        async publish(post) {
            await postService.publish(post._id);
            await this.refresh();
        },
        async unpublish(post) {
            await postService.unpublish(post._id);
            await this.refresh();
        },
        async delete(post) {
            const confirm = await this.$confirm("确认删除？");
            if (!confirm) return;
            await postService.delete(post._id);
            await this.refresh();
        },
        async refresh() {
            const data = await postService.list(this.$route.query);
            this.posts = data.list;
            this.total = data.total;
        },
    },
    created() {
        this.$nextTick(function () {
            this.$refs.table.$on("publish", this.publish);
            this.$refs.table.$on("unpublish", this.unpublish);
            this.$refs.table.$on("delete", this.delete);
        });
    },
});
