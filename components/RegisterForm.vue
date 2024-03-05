<template>
  <el-form v-model="registrationForm" status-icon label-width="120px">
    <el-form-item label="帳號">
      <el-input v-model="registrationForm.account" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="密碼">
      <el-input v-model="registrationForm.password" class="el-input-custom" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="會員名稱">
      <el-input v-model="registrationForm.member_name" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="手機">
      <el-input v-model="registrationForm.phone" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="registrationForm.address" class="el-input-custom" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit"> 送出 </el-button>
      <el-button @click="onReset"> 重設 </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { register } from "~/server/services/memberService";

const router = useRouter();

// todo: add the validation here to prevent any undefined values sent to backend.
const registrationForm = reactive({
  account: "",
  password: "",
  member_name: "",
  phone: "",
  address: "",
});

const onSubmit = async () => {
  const res = await register(JSON.stringify(registrationForm));
  if (res) {
    router.push("/login");
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
