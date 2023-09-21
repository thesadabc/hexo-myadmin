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
    const {code} = await configApi.updateConfig(configData.value);
    if (!code) {
        ElMessage.success("config update success");
    }
}

onMounted(async () => {
    const {data} = await configApi.getConfig();
    if (data){
        configData.value = data.config;
    }
});
</script>
