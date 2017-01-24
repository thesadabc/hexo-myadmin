module.exports = Vue.extend({
    template: require("./index.html"),
    props: ["value"],
    methods: {
        getValue: function() {
            return this.mCodeMirror.getValue();
        }
    },
    updated: function() {
        this.mCodeMirror.setValue(this.value);
    },
    created: function() {
        this.$nextTick(function() {
            this.mCodeMirror = CodeMirror.fromTextArea(this.$refs.editor, { mode: "yaml" });
        });
    }
});
