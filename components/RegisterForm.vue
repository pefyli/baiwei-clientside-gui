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
import { register } from "~/server/services/memberService";

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
  account: [{ required: true, message: "請填入帳號", trigger: "blur" }],
  password: [{ required: true, message: "請填入密碼", trigger: "blur" }],
  member_name: [{ required: true, message: "請填入會員姓名", trigger: "blur" }],
  phone: [{ required: true, message: "請填入電話", trigger: "blur" }],
  address: [{ required: true, message: "請填入地址", trigger: "blur" }],
};

const onSubmit = async () => {
  const isValid = await registerFormValidation.value?.validate();
  if (isValid) {
    const res = await register(JSON.stringify(registrationForm));
    if (res) {
      router.push("/login");
    }
  } else {
    return false;
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
