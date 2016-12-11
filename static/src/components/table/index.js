module.exports = Vue.extend({
    template: require("./index.html"),
    /**
     * for table
     * @param header , ["h1", "h2", "h3"]
     * @param data , [{rowId:"ididid", items:["a", "b", c"]}]
     *
     * for zpagenav
     * @url https://github.com/zxdong262/vue-pagenav
     * @param total 
     */
    props: ["header", "data", "total"],
    computed: {
        page: function() {
            return +this.$route.query.page || 1;
        }
    },
    methods: {
        pageHandler: function(page) {
            var query = Object.assign({}, this.$route.query, { page: page });
            this.$router.push({ name: this.$route.name, query: query });
        },
    },
});
