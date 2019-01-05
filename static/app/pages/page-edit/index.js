const pageService = require("services/page");

module.exports = Vue.extend({
    "template": require("./index.html"),
    "components": {
        "m-page": require("../base-page"),
        "m-mde": require("components/editor/markdown"),
        "m-ymle": require("components/editor/yml"),
    },
    data() {
        return {"page": {}};
    },
    "computed": {
        pageDetail() {
            const page = this.page || {};
            return {
                "meta": page.meta || "",
                "content": page.content || "",
            };
        },
    },
    async beforeRouteEnter(to, from, next) {
        if (to.name !== "page-edit") {
            const now = Vue.tools.formatTime(Date.now());
            next((vm) => {
                vm.page = {
                    "meta": "title: \ndate: " + now + "\nupdated: " + now + "\n",
                    "content": "",
                };
            });
        } else {
            const page = await pageService.raw(to.params.id);
            next((vm) => { vm.page = page; });
        }
    },
    "methods": {
        async submit() {
            const newPage = {
                "meta": this.$refs.meta.getValue(),
                "content": this.$refs.content.getValue(),
            };

            if (this.$route.name === "page-edit") {
                await pageService.update(this.$route.params.id, newPage);
                this.$router.push({"name": "page-list"});
            } else if (this.$route.name === "page-new") {
                await pageService.create(newPage);
                this.$router.push({"name": "page-list"});
            }
        },
    },
});
