module.exports = Vue.extend({
    template: require("./index.html"),
    data: function() {
        return {
            title: "提示",
            content: "提示",
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
        this.$nextTick(function() {
            document.body.appendChild(this.$mount().$el);
        });
    }
});
