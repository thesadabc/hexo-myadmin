const postService = require("services/post");

module.exports = Vue.extend({
    "template": require("./index.html"),
    "components": {
        "m-page": require("../base-page"),
        "m-mde": require("components/editor/markdown"),
        "m-ymle": require("components/editor/yml"),
    },
    data() {
        return {"post": {}};
    },
    "computed": {
        postDetail() {
            const post = this.post || {};
            return {
                "meta": post.meta || "",
                "content": post.content || "",
            };
        },
    },
    beforeRouteEnter(to, from, next) {
        if (to.name !== "post-edit") {
            return next(function (vm) {
                const now = Vue.tools.formatTime(Date.now(), "YYYY-MM-DD HH:mm:ss");
                vm.post = {
                    "meta": "title: \ncategories:\ntags:\ndate: " + now + "\nupdated: " + now + "\n",
                    "content": "",
                };
            });
        }

        postService.raw(to.params.id).then(function (post) {
            next(function (vm) {
                vm.post = post;
            });
        });
    },
    "methods": {
        submit() {
            const self = this;
            const newPost = {
                "meta": self.$refs.meta.getValue(),
                "content": self.$refs.content.getValue(),
            };

            if (self.$route.name === "post-edit") {
                postService.update(self.$route.params.id, newPost).then(function (p) {
                    self.$router.push({"name": "post-list"});
                });
            } else if (self.$route.name === "post-new") {
                postService.create(newPost).then(function () {
                    self.$router.push({"name": "post-list"});
                });
            }
        },
    },
});
