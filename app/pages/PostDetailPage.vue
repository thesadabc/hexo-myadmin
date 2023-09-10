<template>
  <el-container
    class="page" 
    @keydown.ctrl.s.prevent.stop="handleSave"
    @keydown.meta.s.prevent.stop="handleSave"
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
        @click="handleSave"
      >
        Save (⌃/⌘+S)
      </el-button>
    </el-footer>
  </el-container>
</template>

<script setup>
import {yamlExtensions, markdownExtensions} from "../helper/codemirror";

import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import api from "../service/post";

const route = useRoute();
const postDetail = ref({});
onMounted(async () => {
    const {data} = await api.raw(route.params.postId);
    postDetail.value = data;
});

async function handleSave() {
    const {code} = await api.update(route.params.postId, postDetail.value);
    if (!code) {
        ElMessage.success("保存成功");
    }
}
</script>
<style scoped>
  .page-footer {text-align: right;}
  .v-codemirror :deep(.cm-editor) {min-height: 100%;}
</style>
