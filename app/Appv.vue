<template>
  <el-page-header icon="Expand" title=" ">
    <template #content>
      <h4 class="title">
        HEXO-MYADMIN
      </h4>
    </template>
  </el-page-header>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
