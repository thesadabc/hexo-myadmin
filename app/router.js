import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        "path": "/",
        "name": "home",
        "redirect": {"name": "PostList"},
    },
    {
        "path": "/post",
        "name": "PostList",
        "component": () => import("./pages/PostListPage.vue"),
    },
    {
        "path": "/post/add",
        "name": "PostAdd",
        "component": () => import("./pages/PostAddPage.vue"),
    },
    {
        "path": "/post/:postId",
        "name": "PostDetail",
        "component": () => import("./pages/PostDetailPage.vue"),
        "props": true,
    },
    {
        "path": "/page",
        "name": "PageList",
        "component": () => import("./pages/PageListPage.vue"),
    },
    {
        "path": "/page/add",
        "name": "PageAdd",
        "component": () => import("./pages/PageAddPage.vue"),
    },
    {
        "path": "/page/:pageId",
        "name": "PageDetail",
        "component": () => import("./pages/PageDetailPage.vue"),
        "props": true,
    },
    {
        "path": "/config",
        "name": "Config",
        "component": () => import("./pages/ConfigPage.vue"),
    },
    {
        "path": "/themeconfig",
        "name": "ThemeConfig",
        "component": () => import("./pages/ThemeConfigPage.vue"),
    },
    {
        "path": "/:pathMatch(.*)*",
        "component": () => import("./pages/ErrorPage.vue"),
    },
];

const router = createRouter({"history": createWebHashHistory(), routes});
export default router;
