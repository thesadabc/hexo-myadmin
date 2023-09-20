<template>
  <article-detail
    :article-api="pageApi"
    :article-id="route.params.pageId"
  />
</template>

<script setup>
import {useRoute} from "vue-router";
import articleDetail from "../components/ArticleEditorCom.vue";
import pageApi from "../service/page";
const route = useRoute();
</script>
