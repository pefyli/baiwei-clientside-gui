<template>
  <div class="common-layout">
    <el-container>
      <el-header>個人資料</el-header>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div v-if="memberInfo">
          <div v-for="(value, key) in memberInfo" :key="key">
            <div v-if="shouldDisplay(key)">
              <div style="float: left"><el-input v-model="memberInfo[key]" :disabled="!editMode[key]"></el-input></div>
              <div style="float: right"><el-button v-if="!editMode[key]" @click="editMode[key] = true">編輯</el-button><el-button v-else @click="updateMemberInfo(key)">更新</el-button></div>
            </div>
          </div>
        </div>
        <div v-else>Loading...</div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getMember, updateMember } from "~/server/services/memberService";
import { Member } from "~/models/memberModel";

const memberInfo = ref<Member | null>(null);
const editMode = ref<Record<string, boolean>>({});

onMounted(() => {
  memberInfo.value = getMember();
  if (memberInfo.value) {
    Object.keys(memberInfo.value).forEach((key) => {
      editMode.value[key] = false;
    });
  }
});

// Update member information
const updateMemberInfo = (key: string) => {
  // Perform update logic.
  // After updating, set edit mode back to false
  if (memberInfo.value) {
    // After edition, disable edit mode
    updateMember(memberInfo.value);
    editMode.value[key] = false;
  }
};

const shouldDisplay = (key: keyof Member) => {
  return key !== "member_id" && key !== "role_id" && key !== "create_datetime" && key !== "password" && key !== "picture";
};
</script>
