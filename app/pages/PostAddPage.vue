<template>
  <el-container
    class="page" 
    @keydown.ctrl.s.prevent.stop="handlePublish"
    @keydown.meta.s.prevent.stop="handlePublish"
  >
    <el-container class="page-body">
      <el-aside>
        <codemirror
          v-model="postDetail.meta"
          placeholder="输入内容"
          :extensions="yamlExtensions"
        />
      </el-aside>
      <el-main>
        <codemirror
          v-model="postDetail.content"
          placeholder="输入内容"
          :extensions="markdownExtensions"
        />
      </el-main>
    </el-container>
    <el-footer class="page-footer">
      <el-button
        type="primary"
        @click="handlePublish"
      >
        Publish (⌃/⌘+S)
      </el-button>
    </el-footer>
  </el-container>
</template>

<script setup>
import {yamlExtensions, markdownExtensions} from "../helper/codemirror";

import {ref} from "vue";
import {ElMessage} from "element-plus";
import router from "../router";
import api from "../service/post";

const postDetail = ref({
    "meta": "title: \"untitled\"\ncategories: \"uncategorized\"\ntags:\n  - \"tag1\"\n  - \"tag2\"\n",
    "content": "\n\n\n\n\n",
});
async function handlePublish() {
    const {data} = await api.create(postDetail.value);
    if (data._id) {
        ElMessage.success("保存成功");
        router.push({"name":"postDetail", "params":{"postId": data._id}});
    }
}
</script>
<style scoped>
  .page-footer {text-align: right;}
  .v-codemirror :deep(.cm-editor) {min-height: 100%;}
</style>
