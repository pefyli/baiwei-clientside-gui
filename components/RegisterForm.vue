<template>
  <el-form ref="registrationForm" :model="registrationForm" status-icon label-width="120px">
    <el-form-item label="帳號">
      <el-input v-model="registrationForm.account" class="el-input-custom" />
    </el-form-item>
    <el-form-item label="密碼">
      <el-input v-model="registrationForm.password" class="el-input-custom" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="會員名稱">
      <el-input v-model="registrationForm.memberName" class="el-input-custom" />
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
const registrationForm = {
  account: "",
  password: "",
  memberName: "",
  phone: "",
  address: "",
};
const onSubmit = () => {
  // Add your submission logic here
};
const onReset = () => {
  registrationForm.account = "";
  registrationForm.password = "";
  registrationForm.memberName = "";
  registrationForm.phone = "";
  registrationForm.address = "";
};
</script>
<style scoped>
.el-input-custom {
  width: 300px;
}
</style>
