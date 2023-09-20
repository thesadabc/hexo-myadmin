<template>
  <article-detail
    :article-api="postApi"
    @save="handleSave"
  />
</template>

<script setup>
import articleDetail from "../components/ArticleEditorCom.vue";
import postApi from "../service/post";
import router from "../router";

function handleSave(data){
    router.replace({"name":"PostDetail", "params":{"postId": data._id}});
}
</script>
