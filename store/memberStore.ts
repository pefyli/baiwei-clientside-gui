import { defineStore } from "pinia";
import { Member } from "~/models/memberModel";

interface MemberState {
  isLoggedIn: boolean;
  member: Member | null;
}

export const useMemberStore = defineStore("member", {
  state: (): MemberState => ({
    isLoggedIn: false,
    member: null as Member | null,
  }),
  actions: {
    login(member: Member) {
      this.isLoggedIn = true;
      this.member = member;
    },
    logout() {
      this.isLoggedIn = false;
      this.member = null;
    },
  },
  getters: {
    getLoggedStatus: (state): boolean => state.isLoggedIn,
    getMember: (state): Member | null => state.member,
  },
  persist: true,
});
