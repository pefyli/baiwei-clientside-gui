<template>
  <el-form v-model="loginForm" status-icon label-width="120px">
    <el-form-item label="帳號">
      <el-input v-model="loginForm.account" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="密碼">
      <el-input v-model="loginForm.password" class="el-input-custom" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit"> 送出 </el-button>
      <el-button @click="onReset"> 重設 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { authentication } from "~/server/services/memberService";

const router = useRouter();

// todo: add the validation here to prevent any undefined values sent to backend.
const loginForm = reactive({
  account: "",
  password: "",
});

const onSubmit = async () => {
  await authentication(JSON.stringify(loginForm));
  router.push("/");
};

const onReset = () => {
  loginForm.account = "";
  loginForm.password = "";
};
</script>

<style scoped>
.el-input-custom {
  width: 300px;
}
</style>
