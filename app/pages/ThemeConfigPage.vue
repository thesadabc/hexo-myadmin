<template>
  <config-editor
    v-model="configData"
    @save="handleSave"
  />
</template>

<script setup>
import {ref, onMounted} from "vue";
import {ElMessage} from "element-plus";
import ConfigEditor from "../components/ConfigEditorCom.vue";
import configApi from "../service/config";

const configData = ref("");
async function handleSave(){
    const {code} = await configApi.updateThemeConfig(configData.value);
    if (!code) {
        ElMessage.success("themeconfig update success");
    }
}

onMounted(async () => {
    const {data} = await configApi.getThemeConfig();
    if (data){
        configData.value = data.config;
    }
});
</script>
