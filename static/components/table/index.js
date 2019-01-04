module.exports = Vue.extend({
    "template": require("./index.html"),
    /**
     * for table
     * @param header , ["h1", "h2", "h3", "act"]
     * @param data , [{rowId:"ididid", items:["a", "b", c", [{event:"onDel", text:"delete"}]]}]
     *
     * for zpagenav
     * @url https://github.com/zxdong262/vue-pagenav
     * @param total
     */
    "props": ["header", "data", "action", "total"],
    "computed": {
        page() {
            return +this.$route.query.page || 1;
        },
    },
    "methods": {
        pageHandler(page) {
            const query = Object.assign({}, this.$route.query, {page});
            this.$router.push({query});
        },
    },
});
