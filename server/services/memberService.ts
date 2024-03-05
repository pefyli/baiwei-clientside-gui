import { Member } from "~/models/memberModel";
import { useMemberStore } from "~/store/memberStore";

// We should think about how to make interceptors globally, cause has many duplication here.

export async function authentication(loginForm: any) {
  const memberStore = useMemberStore();
  await $fetch("/api/member/authenication", {
    onRequest({ options }) {
      options.body = loginForm;
      options.method = "POST";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
    onResponse({ response }) {
      memberStore.login(new Member(response._data.data));
    },
  });
}

export async function register(registerForm: any): Promise<boolean> {
  let status: boolean = false;
  await $fetch("/api/member", {
    onRequest({ options }) {
      options.body = registerForm;
      options.method = "POST";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
    onResponse({ response }) {
      if (response.status === 201) {
        status = true;
      } else if (response.status === 200) {
        status = false;
        throw new Error("The email has been used.");
      }
    },
  });
  return status;
}
