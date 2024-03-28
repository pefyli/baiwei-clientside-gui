<template>
  <div>
    <el-menu mode="horizontal">
      <el-menu-item class="el-right"> 幫助中心 </el-menu-item>
      <el-menu-item v-if="isLoggedIn" class="el-right">
        <NuxtLink to="/membercenter"> 會員中心 </NuxtLink>
      </el-menu-item>
      <el-menu-item v-if="!isLoggedIn" class="el-right">
        <NuxtLink to="/register"> 註冊 </NuxtLink>
      </el-menu-item>
      <el-menu-item v-if="!isLoggedIn" class="el-right">
        <NuxtLink to="/login"> 登入 </NuxtLink>
      </el-menu-item>
      <el-menu-item class="el-right">
        <NuxtLink to="/"> 首頁 </NuxtLink>
      </el-menu-item>
      <el-menu-item class="el-right">
        <p v-if="isLoggedIn">{{ member?.member_name }}，您好</p>
      </el-menu-item>
      <el-menu-item class="el-right">
        <el-button v-if="isLoggedIn" round @click="logout"> 登出 </el-button>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMemberStore } from "~/store/memberStore";
const memberStore = useMemberStore();
const { member } = storeToRefs(memberStore);
const { isLoggedIn } = storeToRefs(memberStore);

const router = useRouter();

const logout = () => {
  memberStore.logout();
  router.push("/");
};
</script>
<style scoped>
.el-right {
  float: right;
}
</style>
