var pageService = require("services/page");

module.exports = Vue.extend({
    template: require("./index.html"),
    components: {
        "m-page": require("../base-page"),
        "m-mde": require("components/editor/markdown"),
        "m-ymle": require("components/editor/yml"),
    },
    data: function() {
        return { page: {} }
    },
    computed: {
        pageDetail: function() {
            var page = this.page || {};
            return {
                "meta": page.meta || "",
                "content": page.content || ""
            }

        },
    },
    beforeRouteEnter: function(to, from, next) {
        if (to.name !== "page-edit") return next(function(vm) {
            var now = Vue.tools.formatTime(Date.now(), "YYYY-MM-DD HH:mm:ss")
            vm.page = {
                meta: "title: \ndate: " + now + "\nupdated: " + now + "\n",
                content: ""
            };
        });

        pageService.raw(to.params.id).then(function(page) {
            next(function(vm) {
                vm.page = page;
            });
        });
    },
    methods: {
        submit: function() {
            var self = this;
            var newPage = {
                meta: self.$refs.meta.getValue(),
                content: self.$refs.content.getValue(),
            };

            if (self.$route.name === "page-edit") {
                pageService.update(self.$route.params.id, newPage).then(function(p) {
                    self.$router.push({ name: "page-list" });
                });
                return;
            } else if (self.$route.name === "page-new") {
                pageService.create(newPage).then(function() {
                    self.$router.push({ name: "page-list" });
                });
            }
        }
    }
});
