const pageService = require("services/page");

module.exports = Vue.extend({
    "template": require("./index.html"),
    "components": {
        "m-page": require("../base-page"),
        "m-table": require("components/table"),
    },
    "mixins": [Vue.routeRefreshMixin],
    data() {
        return {"pages": [], "total": 0};
    },
    // render config
    "computed": {
        tableConfig() {
            return {
                "header": ["title", "date", "updated", "action"],
                "data": this.pages.map(function (page) {
                    const action = [
                        {"to": {"name": "page-edit", "params": {"id": page._id}}, "text": "edit"},
                        {"event": "delete", "text": "delete"},
                        {"href": page.link, "text": "view"},
                    ];
                    return {
                        "rowItem": page,
                        "items": [
                            page.title, Vue.tools.formatTime(page.date), Vue.tools.formatTime(page.updated), action,
                        ],
                    };
                }),
                "total": this.total,
            };
        },
    },
    routerRefresh() {
        this.refresh();
    },
    "methods": {
        async delete(page) {
            const confirm = await this.$confirm("确认删除？");
            if (!confirm) return;
            await pageService.delete(page._id);
            await this.refresh();
        },
        async refresh() {
            const data = await pageService.list(this.$route.query);
            this.pages = data.list;
            this.total = data.total;
        },
    },
    created() {
        this.$nextTick(function () {
            this.$refs.table.$on("delete", this.delete);
        });
    },
});
