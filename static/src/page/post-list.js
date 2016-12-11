module.exports = Vue.extend({
    template: require("../template/post-list.html"),
    components: {
        "m-table": require("../components/table"),
    },
    data: function() {
        return { posts: [], total: 0 }
    },
    // render config
    computed: {
        headerConfig: function() {
            return {
                title: "POST LIST",
                action: { to: { name: "post-new" }, text: "NEW POST" }
            }
        },
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
                        rowId: post._id,
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
    beforeRouteEnter: function(to, from, next) {
        Vue.service.post.list(to.query).then(function(data) {
            next(function(vm) {
                vm.posts = data.list;
                vm.total = data.total;
            });
        });
    },
    watch: {
        $route: function(r) {
            var self = this;
            if (r.name === "post-list") {
                Vue.service.post.list(r.query).then(function(data) {
                    self.posts = data.list;
                    self.total = data.total;
                });
            }
        }
    },
    methods: {
        publish: function(id) {
            Vue.service.post.publish(id).then(this.refresh);
        },
        unpublish: function(id) {
            Vue.service.post.unpublish(id).then(this.refresh);
        },
        delete: function(id) {
            Vue.service.post.delete(id).then(this.refresh);
        },
        refresh: function() {
            var self = this;
            Vue.service.post.list(this.$route.query).then(function(data) {
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
