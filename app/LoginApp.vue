<template>
  <el-form
    ref="loginFormEl"
    :model="loginForm"
    @keydown.enter="handelLogin"
  >
    <el-form-item
      required
      prop="username"
    >
      <el-input
        v-model="loginForm.username"
        placeholder="username"
      />
    </el-form-item>
    <el-form-item
      required
      prop="password"
    >
      <el-input
        v-model="loginForm.password"
        placeholder="password"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handelLogin"
      >
        LOGIN
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {ref, reactive} from "vue";
import accountApi from "@/service/account";
const loginFormEl = ref(null);
const loginForm = reactive({});

async function handelLogin() {
    try{
        await loginFormEl.value.validate();
    }catch(e){
        return;
    }
    const {code} = await accountApi.login(loginForm);
    if (!code){
        location.href = "./index.html";
    }
}

</script>

<style scoped>
    .el-form {margin: 15% auto 0; width: 200px;}
    .el-button{width: 100%;}
</style>

<style>
    html, body {padding: 0; margin: 0; height: 100%; background-color: var(--el-bg-color-page)}
</style>

