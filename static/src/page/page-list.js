module.exports = Vue.extend({
    template: require("../template/post-list.html"),
    components: {
        "m-table": require("../components/table"),
    },
    data: function() {
        return { pages: [], total: 0 }
    },
    // render config
    computed: {
        headerConfig: function() {
            return {
                title: "PAGE LIST",
                action: { to: { name: "page-new" }, text: "NEW PAGE" }
            }
        },
        tableConfig: function() {
            return {
                header: ["title", "date", "updated", "action"],
                data: this.pages.map(function(page) {
                    var action = [
                        { to: { name: "page-edit", params: { id: page._id } }, text: "edit" },
                        { event: "delete", text: "delete" },
                        { href: page.link, text: "view" }
                    ];
                    return {
                        rowId: page._id,
                        items: [
                            page.title, Vue.tools.formatTime(page.date), Vue.tools.formatTime(page.updated), action
                        ],
                    }
                }),
                total: this.total
            }
        },
    },
    beforeRouteEnter: function(to, from, next) {
        Vue.service.page.list(to.query).then(function(data) {
            next(function(vm) {
                vm.pages = data.list;
                vm.total = data.total;
            });
        });
    },
    watch: {
        $route: function(r) {
            var self = this;
            if (r.name === "page-list") {
                Vue.service.page.list(r.query).then(function(data) {
                    self.pages = data.list;
                    self.total = data.total;
                });
            }
        }
    },
    methods: {
        delete: function(id) {
            Vue.service.page.delete(id).then(this.refresh);
        },
        refresh: function() {
            var self = this;
            Vue.service.page.list(this.$route.query).then(function(data) {
                self.pages = data.list;;
                self.total = data.total;
            });

        }
    },
    created: function () {
        this.$nextTick(function () {
            this.$refs.table.$on("delete", this.delete);
        })
    }
});
