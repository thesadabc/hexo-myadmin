<template>
  <el-container
    class="page"
    @keydown.ctrl.s.prevent.stop="handleSave"
    @keydown.meta.s.prevent.stop="handleSave"
  >
    <el-container class="page-body">
      <el-main>
        <codemirror
          :model-value="modelValue"
          placeholder="input something"
          :extensions="yamlExtensions"
          @update:model-value="$emit('update:modelValue',$event)"
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
import {yamlExtensions} from "../helper/codemirror";

const emit = defineEmits(["update:modelValue", "save"]);
defineProps(["modelValue"]);

async function handleSave() {
    emit("save");
}
</script>
<style scoped>
  .page-footer {text-align: right;}
  .v-codemirror :deep(.cm-editor) {min-height: 100%;}
</style>
