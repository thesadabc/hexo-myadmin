<template>
  <article-detail
    article-type="page"
    :article-id="route.params.pageId"
  />
</template>

<script setup>
import articleDetail from "../components/ArticleEditorCom.vue";
import {useRoute} from "vue-router";
const route = useRoute();
</script>
