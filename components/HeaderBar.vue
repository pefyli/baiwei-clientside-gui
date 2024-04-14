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
      <el-menu-item class="el-menu-custom">
        <p v-if="isLoggedIn">{{ member?.member_name }}，您好</p>
      </el-menu-item>
      <el-menu-item class="el-menu-custom">
        <el-button v-if="isLoggedIn" round @click="logout"> 登出 </el-button>
      </el-menu-item>
      <el-menu-item class="el-menu-custom">
        <input v-model="searchTerm" type="text" /> &nbsp;
        <el-button @click="performSearch">搜尋</el-button>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElMessageBox, type Action, ElMessage } from "element-plus";
import { ref } from "vue";
import { useMemberStore } from "~/store/memberStore";
import { GeneralMsg } from "~/models/GeneralMsg";
import { ErrorMsg } from "~/models/ErrorMsg";

const memberStore = useMemberStore();
const { member } = storeToRefs(memberStore);
const { isLoggedIn } = storeToRefs(memberStore);
const searchTerm = ref("");

const router = useRouter();

const logout = () => {
  memberStore.logout();
  open("登出" + GeneralMsg.Success, undefined);
  router.push("/login");
};

const performSearch = () => {
  const term = searchTerm.value.trim();
  if (!term) {
    // Handle empty search term
    ElMessage.error("請輸入搜尋條件。");
    return;
  }

  try {
    router.push({ path: "/searchresult", query: { term } });
  } catch (error) {
    open("搜尋失敗，請稍後再試。", ErrorMsg.Error);
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
</script>
<style scoped>
.el-right {
  float: right;
}

/* Override hover effect for the elmenu item */
.el-menu-custom,
.el-menu-custom:hover,
.el-menu-custom:focus,
.el-menu-custom:active {
  background-color: transparent !important; /* Set the background color to transparent */
  color: inherit !important; /* Inherit the color */
  border-color: transparent !important; /* Set border color to transparent */
}
</style>
