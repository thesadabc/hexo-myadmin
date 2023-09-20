<template>
  <article-detail
    :article-api="pageApi"
    @save="handleSave"
  />
</template>

<script setup>
import articleDetail from "../components/ArticleEditorCom.vue";
import pageApi from "../service/page";
import router from "../router";

function handleSave(data){
    router.replace({"name":"PageDetail", "params":{"pageId": data._id}});
}
</script>
