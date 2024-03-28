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
import { ElMessage, ElMessageBox, type Action } from "element-plus";
import { authentication } from "~/server/services/memberService";
import { ErrorMsg, ErrorStrToEum } from "~/models/ErrorMsg";
import { GeneralMsg } from "~/models/GeneralMsg";

const router = useRouter();

const loginFormValidation = ref();
const loginForm = reactive({
  account: "",
  password: "",
});

const formRules = {
  account: [{ required: true, message: GeneralMsg.AccountFillIn, trigger: "blur" }],
  password: [{ required: true, message: GeneralMsg.PasswordFillIn, trigger: "blur" }],
};

const onSubmit = async () => {
  try {
    const isValid = await loginFormValidation.value?.validate();
    if (isValid) {
      await authentication(JSON.stringify(loginForm));
      open("登入" + GeneralMsg.Success, undefined);
      router.push("/");
    }
  } catch (error: any) {
    if (error.message !== undefined) {
      open(ErrorStrToEum(error.message), ErrorMsg.Error);
    }
  }
};

const open = (message: string, title?: string) => {
  ElMessageBox.alert(message, title, {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "OK",
    callback: (action: Action) => {
      ElMessage({
        type: "info",
        message: `action: ${action}`,
      });
    },
  });
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
