import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        "path": "/",
        "name": "home",
        "redirect": {"name": "postList"}, 
    },
    {
        "path": "/post",
        "name": "postList",
        "component": () => import("./pages/PostListPage.vue"),
    },
    {
        "path": "/post/add",
        "name": "postAdd",
        "component": () => import("./pages/PostAddPage.vue"),
    },
    {
        "path": "/post/:postId",
        "name": "postDetail",
        "component": () => import("./pages/PostDetailPage.vue"),
        "props": true,
    },
    {
        "path": "/:pathMatch(.*)*",
        "component": () => import("./pages/ErrorPage.vue"),
    },
];

const router = createRouter({"history": createWebHashHistory(), routes});
export default router;
