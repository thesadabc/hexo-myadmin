var postService = require("services/post");

module.exports = Vue.extend({
    template: require("./index.html"),
    components: {
        "m-page": require("../base-page"),
        "m-table": require("components/table"),
    },
    mixins: [Vue.routeRefreshMixin],
    data: function() {
        return { posts: [], total: 0 }
    },
    // render config
    computed: {
        tableConfig: function() {
            return {
                header: ["title", "categories", "tags", "date", "updated", "status", "action"],
                data: this.posts.map(function(post) {
                    var status = ~post.source.indexOf('_draft') ? "unpublish" : "publish";
                    var action = [
                        { to: { name: "post-edit", params: { id: post._id } }, text: "edit" }
                    ];
                    if (status === "publish") {
                        action.push({ event: "unpublish", text: "unpublish" });
                        action.push({ href: post.link, text: "view" });
                    } else {
                        action.push({ event: "publish", text: "publish" });
                    }
                    action.push({ event: "delete", text: "delete" });
                    return {
                        rowItem: post,
                        items: [
                            post.title, post.categories.join(), post.tags.join(),
                            Vue.tools.formatTime(post.date), Vue.tools.formatTime(post.updated), status, action
                        ],
                    }
                }),
                total: this.total
            }
        },
    },
    routerRefresh: function(route) {
        this.refresh();
    },
    methods: {
        publish: function(post) {
            postService.publish(post._id).then(this.refresh);
        },
        unpublish: function(post) {
            postService.unpublish(post._id).then(this.refresh);
        },
        delete: function(post) {
            this.$confirm("确认删除？").then(function() {
                return postService.delete(post._id);
            }).then(this.refresh);
        },
        refresh: function() {
            var self = this;
            postService.list(this.$route.query).then(function(data) {
                self.posts = data.list;
                self.total = data.total;
            });
        }
    },
    created: function() {
        this.$nextTick(function() {
            this.$refs.table.$on("publish", this.publish);
            this.$refs.table.$on("unpublish", this.unpublish);
            this.$refs.table.$on("delete", this.delete);
        })
    }
});
