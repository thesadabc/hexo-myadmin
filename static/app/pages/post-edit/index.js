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
    async beforeRouteEnter(to, from, next) {
        if (to.name !== "post-edit") {
            const now = Vue.tools.formatTime(Date.now());
            next((vm) => {
                vm.post = {
                    "meta": "title: \ncategories:\ntags:\ndate: " + now + "\nupdated: " + now + "\n",
                    "content": "",
                };
            });
        } else {
            const post = await postService.raw(to.params.id);
            next((vm) => { vm.post = post; });
        }
    },
    "methods": {
        async submit() {
            const newPost = {
                "meta": this.$refs.meta.getValue(),
                "content": this.$refs.content.getValue(),
            };
            if (this.$route.name === "post-edit") {
                await postService.update(this.$route.params.id, newPost);
                this.$router.push({"name": "post-list"});
            } else if (this.$route.name === "post-new") {
                await postService.create(newPost);
                this.$router.push({"name": "post-list"});
            }
        },
    },
});
