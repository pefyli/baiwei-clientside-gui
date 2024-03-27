<template>
  <el-form ref="loginFormValidation" :model="loginForm" :rules="formRules" status-icon label-width="120px">
    <el-form-item label="帳號" prop="account">
      <el-input v-model="loginForm.account" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="密碼" prop="password">
      <el-input v-model="loginForm.password" class="el-input-custom" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit"> 送出 </el-button>
      <el-button @click="onReset"> 重設 </el-button>
    </el-form-item>
  </el-form>
  <ErrorModal />
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { authentication } from "~/server/services/memberService";

const router = useRouter();

const loginFormValidation = ref();
const loginForm = reactive({
  account: "",
  password: "",
});

const formRules = {
  account: [{ required: true, message: "請填入帳號", trigger: "blur" }],
  password: [{ required: true, message: "請填入密碼", trigger: "blur" }],
};

const onSubmit = async () => {
  try {
    const isValid = await loginFormValidation.value?.validate();
    if (isValid) {
      await authentication(JSON.stringify(loginForm));
      router.push("/");
    } else {
      return false;
    }
  } catch (error: any) {
    if (error.message !== undefined) {
      alert(error.message);
    }
  }
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
