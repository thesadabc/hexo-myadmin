module.exports = Vue.extend({
    "template": require("./index.html"),
    "props": ["menus"],
    "methods": {
        "toggleMenu"(e) {
            const _submenu = e.target.nextElementSibling;

            const show = e.target.parentElement.classList.toggle("active");
            _submenu.style.height = show ? (_submenu.scrollHeight + "px") : "";
        },

        "_initMenu"() {
            if (this.$refs.menu.querySelector(".router-link-active")) {
                const _submenu = this.$refs.menu.querySelector(".router-link-active").parentElement.parentElement;
                if (_submenu.classList.contains("nav-second-level")) {
                    _submenu.parentElement.classList.add("active");
                    _submenu.style.height = _submenu.scrollHeight + "px";
                }
            }
        },
    },
    "mounted"() {
        this.$nextTick(this._initMenu);
    },
});
