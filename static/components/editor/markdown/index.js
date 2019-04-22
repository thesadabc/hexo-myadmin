module.exports = Vue.extend({
    "template": require("./index.html"),
    "props": ["value"],
    "methods": {
        getValue() {
            return this.mdEditor.value();
        },
    },
    updated() {
        this.mdEditor.value(this.value);
    },
    created() {
        this.$nextTick(function () {
            const insertMore = {
                "name": "more",
                action(editor) {
                    const moreTag = "<!--more-->\n";
                    editor.codemirror.replaceSelection(moreTag);
                    editor.codemirror.focus();
                },
                "className": "fa fa-ellipsis-h",
                "title": "Insert More Split",
            };
            this.mdEditor = new SimpleMDE({
                "element": this.$refs.editor,
                "indentWithTabs": false,
                "tabSize": 4,
                "spellChecker": false,
                "toolbar": ["bold", "italic", "strikethrough", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "code", "table", "link", "image", "horizontal-rule", insertMore, "|", "fullscreen", "|", "preview"],
                "autoDownloadFontAwesome": false,
            });
        });
    },
});
