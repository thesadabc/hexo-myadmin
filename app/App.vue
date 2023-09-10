<template>
  <el-container id="app">
    <el-header class="page-header">
      <el-menu
        mode="horizontal"
        :ellipsis="false"
        router
        :default-active="route.path"
      >
        <span class="el-menu-item">HEXO MYADMIN</span>
        <el-sub-menu index="Posts">
          <template #title>
            Posts
          </template>
          <el-menu-item :index="menus.PostList.path">
            PostList
          </el-menu-item>
          <el-menu-item :index="menus.AddPost.path">
            AddPost
          </el-menu-item>
        </el-sub-menu>
        <div class="flex-grow" />
        <a
          href="../"
          class="el-menu-item"
        >Site</a>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
const router = useRouter();
const route = useRoute();

const menus = {
    "PostList": router.getRoutes().find(r => r.name === "postList"),
    "AddPost": router.getRoutes().find(r => r.name === "postAdd"),
};
</script>

<style>
* {box-sizing: border-box;}
html, body, #app, .page, .page-body{width: 100%; height: 100%; margin: 0; padding: 0;}
.page > .page-body {overflow: hidden;}
.page-footer {padding: 10px 20px; height: auto;}
.flex-grow {flex-grow: 1; }
a{text-decoration: none;}
.el-main { --el-main-padding: 0;}
</style>

<style scoped>
  .el-header {border-bottom: solid 1px var(--el-menu-border-color);}
  .el-menu { border-bottom: 0; }
  .el-main {height: 100%;}
</style>
