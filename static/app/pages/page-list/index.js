var pageService = require("services/page");

module.exports = Vue.extend({
    template: require("./index.html"),
    components: {
        "m-page": require("../base-page"),
        "m-table": require("components/table"),
    },
    mixins: [Vue.routeRefreshMixin],
    data: function() {
        return { pages: [], total: 0 }
    },
    // render config
    computed: {
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
                        rowItem: page,
                        items: [
                            page.title, Vue.tools.formatTime(page.date), Vue.tools.formatTime(page.updated), action
                        ],
                    }
                }),
                total: this.total
            }
        },
    },
    routerRefresh: function() {
        this.refresh()
    },
    methods: {
        delete: function(page) {
            this.$confirm("确认删除？").then(function() {
                return pageService.delete(page._id);
            }).then(this.refresh);
        },
        refresh: function() {
            var self = this;
            pageService.list(this.$route.query).then(function(data) {
                self.pages = data.list;;
                self.total = data.total;
            });

        }
    },
    created: function() {
        this.$nextTick(function() {
            this.$refs.table.$on("delete", this.delete);
        })
    }
});
