// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
  head: {
    title: "baiwei-clientside-gui",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
  },
  modules: ["@nuxt/image", "@element-plus/nuxt", "@nuxt-alt/proxy", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  css: ["@/assets/css/main.css"],
  image: {
    dir: "assets/images",
  },
  plugins: ["@/plugins/pinia.ts"],
  proxy: {
    proxies: {
      "/api/": {
        target: "http://127.0.0.1:8080/baiwei-clientside-api/",
        changeOrigin: true,
      },
    },
  },
  devtools: { enabled: true },
};
