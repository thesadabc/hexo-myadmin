module.exports = Vue.extend({
    template: require("./index.html"),
    components: {
        "m-nav": require("components/navbar"),
        "m-sidebar": require("components/sidebar"),
    },
    router: require("./router"),
    computed: {
        navMenus: function() {
            return [
                { text: "HOME", href: "#/" },
                { text: "BLOG", href: "/" },
            ]
        },
        sideMenus: function() {
            return [{
                text: "POST",
                subMenu: [
                    { text: "POST LIST", href: { name: "post-list" } },
                    { text: "NEW POST", href: { name: "post-new" } },
                ]
            }, {
                text: "PAGE",
                subMenu: [
                    { text: "PAGE LIST", href: { name: "page-list" } },
                    { text: "NEW PAGE", href: { name: "page-new" } },
                ]
            }];
        }
    },
});
