import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        "path": "/",
        "name": "home",
        "redirect": { "name": 'postList' } 
        // "component": () => import("./pages/HomePage.vue"),
    },
    {
        "path": "/post",
        "name": "postList",
        "component": () => import("./pages/ArticleListPage.vue"),
    },
    {
        "path": "/page",
        "name": "pageList",
        "component": () => import("./pages/ArticleListPage.vue"),
    },
    {
        "path": "/post/:articleId",
        "name": "postDetail",
        "component": () => import("./pages/ArticleDetailPage.vue"),
        "props": true,
    },
    {
        "path": "/page/:articleId",
        "name": "pageDetail",
        "component": () => import("./pages/ArticleDetailPage.vue"),
        "props": true,
    },
    {"path": "/*", "component": () => import("./pages/ErrorPage.vue")},
];

const router = createRouter({"history": createWebHashHistory(), routes});
export default router;
