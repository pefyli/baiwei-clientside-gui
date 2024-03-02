import { Member } from "~/models/memberModel";
import { useMemberStore } from "~/store/memberStore";

export async function authentication(account: string, password: string) {
  const memberStore = useMemberStore();
  const data: any = await $fetch("/api/member/authenication", {
    method: "POST",
    body: { account, password },
  });
  memberStore.login(new Member(data.data));
}
