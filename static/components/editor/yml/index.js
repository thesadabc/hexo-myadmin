module.exports = Vue.extend({
    "template": require("./index.html"),
    "props": ["value"],
    "methods": {
        getValue() {
            return this.mCodeMirror.getValue();
        },
    },
    updated() {
        this.mCodeMirror.setValue(this.value);
    },
    created() {
        this.$nextTick(function () {
            this.mCodeMirror = CodeMirror.fromTextArea(this.$refs.editor, {"mode": "yaml"});
        });
    },
});
