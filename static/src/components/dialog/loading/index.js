module.exports = Vue.extend({
    template: require("./index.html"),
    methods: {
        start: function() {
            this.stack++;
            this.$el.classList.add("in");
            this.$el.style.visibility = "visible";
            if (this.timeOutHander) {
                clearTimeout(this.timeOutHander);
                this.timeOutHander = null;
            }
        },
        stop: function() {
            var self = this;
            this.stack--;
            if (this.stack <= 0) {
                this.$el.classList.remove("in");
                this.timeOutHander = setTimeout(function() {
                    self.$el.style.visibility = "hidden";
                }, 50);
                this.stack = 0;
            }
        },
    },
    created: function() {
        this.stack = 0;
        this.$nextTick(function() {
            document.body.appendChild(this.$mount().$el);
        });
    }
});
