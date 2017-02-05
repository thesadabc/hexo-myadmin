module.exports = Vue.extend({
    template: require("./index.html"),
    data: function() {
        return {
            title: "Notice",
            content: "Notice",
        }
    },
    methods: {
        show: function() {
            this.$el.classList.add("in");
        },

        // btn click
        close: function() {
            this.$emit("close");
            this._hide();
            this.$el.remove();
            this.$destroy();
        },

        // inner cn
        _hide: function() {
            this.$el.classList.remove("in");
        }
    },
    created: function() {
        document.body.appendChild(this.$mount().$el);
    }
});
