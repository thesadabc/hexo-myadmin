<template>
  <el-container
    class="page"
    @keydown.ctrl.s.prevent.stop="handleSave"
    @keydown.meta.s.prevent.stop="handleSave"
  >
    <el-container class="page-body">
      <el-aside>
        <codemirror
          v-model="articleDetail.meta"
          placeholder="input something"
          :extensions="yamlExtensions"
        />
      </el-aside>
      <el-main>
        <codemirror
          v-model="articleDetail.content"
          placeholder="input something"
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
import {ElMessage} from "element-plus";

const emit = defineEmits(["save"]);
const props = defineProps(["articleId", "articleApi"]);
const api = props.articleApi;

const articleDetail = ref({});
onMounted(async () => {
    if (props.articleId){
        const {data} = await api.raw(props.articleId);
        articleDetail.value = data;
    } else {
        articleDetail.value = {
            "meta": "title: \"untitled\"\ncategories: \"uncategorized\"\ntags:\n  - \"tag1\"\n  - \"tag2\"\n",
            "content": "\n\n\n\n\n",
        };
    }
});

async function handleSave() {
    if (props.articleId){
        const {code} = await api.update(props.articleId, articleDetail.value);
        if (!code) ElMessage.success("success");
    } else {
        const {code, data} = await api.create(articleDetail.value);
        if (code) return;
        ElMessage.success("success");
        emit("save", data);
    }
}
</script>
<style scoped>
  .page-footer {text-align: right;}
  .v-codemirror :deep(.cm-editor) {min-height: 100%;}
</style>
