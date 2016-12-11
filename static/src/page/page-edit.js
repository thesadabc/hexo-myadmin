module.exports = Vue.extend({
    template: require("../template/post-edit.html"),
    components: {
        "m-mde": require("../components/markdown-editor"),
    },
    data: function() {
        return { page: {} }
    },
    computed: {
        postDetail: function() {
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

        Vue.service.page.raw(to.params.id).then(function(page) {
            next(function(vm) {
                vm.page = page;
            });
        });
    },
    methods: {
        submit: function() {
            var self = this;
            var newPage = {
                meta: self.$refs.meta.value,
                content: self.$refs.content.getValue(),
            };

            if (self.$route.name === "page-edit") {
                Vue.service.page.update(self.$route.params.id, newPage).then(function(p) {
                    self.$router.push({ name: "page-list" });
                });
                return;
            } else if (self.$route.name === "page-new") {
                Vue.service.page.create(newPage).then(function() {
                    self.$router.push({ name: "page-list" });
                });
            }
        }
    }
});
