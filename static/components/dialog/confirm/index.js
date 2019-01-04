module.exports = Vue.extend({
    "template": require("./index.html"),
    "data"() {
        return {
            "title": "Notice",
            "content": "Notice",
        };
    },
    "methods": {
        "show"() {
            this.$el.classList.add("in");
        },

        // btn click
        "confirm"() {
            this.$emit("confirm", true);
            this.close();
        },
        "cancel"() {
            this.$emit("confirm", false);
            this.close();
        },
        "close"() {
            this.$emit("close");
            this._hide();
            this.$el.remove();
            this.$destroy();
        },

        // inner fn
        "_hide"() {
            this.$el.classList.remove("in");
        },
    },
    "created"() {
        document.body.appendChild(this.$mount().$el);
    },
});
