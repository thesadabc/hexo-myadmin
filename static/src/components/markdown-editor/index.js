module.exports = Vue.extend({
    template: require("./index.html"),
    props: ["value"],
    methods: {
        getValue: function() {
            return this.mdEditor.value();
        }
    },
    updated: function() {
        this.mdEditor.value(this.value);
    },
    created: function() {
        this.$nextTick(function() {
            this.mdEditor = new SimpleMDE({
                element: this.$refs.editor,
                indentWithTabs: false,
                tabSize: 4,
                spellChecker: false,
                toolbar: ["bold", "italic", "strikethrough", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "code", "table", "link", "image", "horizontal-rule", "|", "fullscreen"],
                autoDownloadFontAwesome: false
            });
        })
    }
});
