import { Category } from "~/models/CategoryModel";

export async function getAllCategory() {
  const categoryList: Category[] = [];
  const response: any = await $fetch("/api/category", {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  response.data.forEach(function (value: any) {
    const product = new Category(value);
    categoryList.push(product);
  });
  return categoryList;
}
