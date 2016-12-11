module.exports = Vue.extend({
    template: require("./index.html"),
    props: ["menus"],
    watch: { "menus": "_initMenu" },

    methods: {
        toggleMenu: function(e) {
            var _submenu = e.target.nextElementSibling;

            var show = e.target.parentElement.classList.toggle("active");
            _submenu.style.height = show ? (_submenu.scrollHeight + "px") : "";

        },

        _initMenu: function() {
            if (this.$refs.menu.querySelector(".v-link-active")) {
                var _submenu = this.$refs.menu.querySelector(".v-link-active").parentElement.parentElement;
                if (_submenu.classList.contains("nav-second-level")) {
                    _submenu.parentElement.classList.add("active");
                    _submenu.style.height = _submenu.scrollHeight + "px";
                }
            }
        },
    },
    mounted: function() {
        this.$nextTick(this._initMenu)
    }
});
