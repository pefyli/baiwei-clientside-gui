import { defineNuxtPlugin } from "nuxt/app";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  // Inject the Pinia instance to the app
  nuxtApp.vueApp.provide("pinia", pinia);
});
