<template>
  <div class="menu-container">
    <el-menu mode="horizontal" class="custom-menu">
      <div class="menu-items">
        <el-menu-item>幫助中心</el-menu-item>
        <el-menu-item v-if="isLoggedIn" class="el-right">
          <NuxtLink to="/membercenter"> 會員中心 </NuxtLink>
        </el-menu-item>
        <el-menu-item v-if="!isLoggedIn">
          <NuxtLink to="/register"> 註冊 </NuxtLink>
        </el-menu-item>
        <el-menu-item v-if="!isLoggedIn">
          <NuxtLink to="/login"> 登入 </NuxtLink>
        </el-menu-item>
        <el-menu-item>
          <NuxtLink to="/"> 首頁 </NuxtLink>
        </el-menu-item>
        <el-menu-item>
          <p v-if="isLoggedIn">{{ member?.member_name }}，您好</p>
        </el-menu-item>
        <el-menu-item>
          <el-button v-if="isLoggedIn" round @click="logout"> 登出 </el-button>
        </el-menu-item>
        <el-menu-item>
          <input v-model="searchTerm" type="text" /> &nbsp;
          <el-button @click="performSearch">搜尋</el-button>
        </el-menu-item>
        <el-menu-item>
          <NuxtLink to="/shoppingcart"> 購物車 </NuxtLink>
        </el-menu-item>
      </div>
      <el-menu-item class="custom-menu-item icon-container">
        <NuxtImg src="/icon.jpg" class="icon-image" />
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
.menu-container {
  overflow-x: auto; /* Allow horizontal scrolling if items overflow */
}

.custom-menu {
  display: flex;
  flex-wrap: nowrap; /* Prevent items from wrapping */
  white-space: nowrap; /* Prevent text wrapping */
  justify-content: space-between; /* Ensure the icon stays on the right */
}

.menu-items {
  display: flex;
  flex-wrap: nowrap;
}

.icon-image {
  height: 50px; /* Adjust the height as needed */
  width: 50px; /* Adjust the width as needed */
}

@media (max-width: 768px) {
  .custom-menu {
    flex-direction: column;
  }

  .menu-items {
    flex-direction: row;
    flex-wrap: wrap; /* Allow items to wrap on smaller screens */
  }

  .el-right {
    margin-left: 0;
  }
}
</style>
