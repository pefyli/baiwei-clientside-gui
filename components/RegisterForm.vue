<template>
  <el-form ref="registerFormValidation" :rules="formRules" :model="registrationForm" status-icon label-width="120px">
    <el-form-item label="帳號" prop="account">
      <el-input v-model="registrationForm.account" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="密碼" prop="password">
      <el-input v-model="registrationForm.password" class="el-input-custom" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="會員名稱" prop="member_name">
      <el-input v-model="registrationForm.member_name" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="手機" prop="phone">
      <el-input v-model="registrationForm.phone" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="registrationForm.address" class="el-input-custom" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit"> 送出 </el-button>
      <el-button @click="onReset"> 重設 </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, type Action } from "element-plus";
import { GeneralMsg } from "~/models/GeneralMsg";
import { register } from "~/server/services/memberService";
import { ErrorMsg, ErrorStrToEum } from "~/models/ErrorMsg";

const router = useRouter();

const registerFormValidation = ref();
const registrationForm = reactive({
  account: "",
  password: "",
  member_name: "",
  phone: "",
  address: "",
});

const formRules = {
  account: [{ required: true, message: GeneralMsg.AccountFillIn, trigger: "blur" }],
  password: [{ required: true, message: GeneralMsg.PasswordFillIn, trigger: "blur" }],
  member_name: [{ required: true, message: GeneralMsg.MemberNameFillIn, trigger: "blur" }],
  phone: [{ required: true, message: GeneralMsg.PhoneFillIn, trigger: "blur" }],
  address: [{ required: true, message: GeneralMsg.AddressFillIn, trigger: "blur" }],
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

const onSubmit = async () => {
  try {
    const isValid = await registerFormValidation.value?.validate();
    if (isValid) {
      const res = await register(JSON.stringify(registrationForm));
      if (res) {
        open("註冊" + GeneralMsg.Success, undefined);
        router.push("/login");
      }
    } else {
      return false;
    }
  } catch (error: any) {
    if (error.message !== undefined) {
      open(ErrorStrToEum(error.message), ErrorMsg.Error);
    }
  }
};

const onReset = () => {
  registrationForm.account = "";
  registrationForm.password = "";
  registrationForm.member_name = "";
  registrationForm.phone = "";
  registrationForm.address = "";
};
</script>

<style scoped>
.el-input-custom {
  width: 300px;
}
</style>
