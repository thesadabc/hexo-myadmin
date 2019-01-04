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
    beforeRouteEnter(to, from, next) {
        if (to.name !== "page-edit") {
            return next(function (vm) {
                const now = Vue.tools.formatTime(Date.now(), "YYYY-MM-DD HH:mm:ss");
                vm.page = {
                    "meta": "title: \ndate: " + now + "\nupdated: " + now + "\n",
                    "content": "",
                };
            });
        }

        pageService.raw(to.params.id).then(function (page) {
            next(function (vm) {
                vm.page = page;
            });
        });
    },
    "methods": {
        submit() {
            const self = this;
            const newPage = {
                "meta": self.$refs.meta.getValue(),
                "content": self.$refs.content.getValue(),
            };

            if (self.$route.name === "page-edit") {
                pageService.update(self.$route.params.id, newPage).then(function (p) {
                    self.$router.push({"name": "page-list"});
                });
            } else if (self.$route.name === "page-new") {
                pageService.create(newPage).then(function () {
                    self.$router.push({"name": "page-list"});
                });
            }
        },
    },
});
