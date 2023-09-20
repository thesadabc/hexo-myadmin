<template>
  <article-detail
    :article-api="postApi"
    :article-id="route.params.postId"
  />
</template>

<script setup>
import {useRoute} from "vue-router";
import articleDetail from "../components/ArticleEditorCom.vue";
import postApi from "../service/post";
const route = useRoute();
</script>
