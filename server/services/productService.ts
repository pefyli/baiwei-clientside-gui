import { Product } from "~/models/ProductModel";

export async function getProducts(): Promise<Product[]> {
  const productList: Product[] = [];
  const response: any = await $fetch("/api/product/", {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  response.data.forEach(function (value: any) {
    const product = new Product(value);
    productList.push(product);
  });
  return productList;
}

export async function getProductById(productId: number): Promise<Product> {
  const response: any = await $fetch("/api/product/" + productId, {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  return new Product(response.data);
}

export async function searchProduct(searchTerm: string): Promise<Product[]> {
  const productList: Product[] = [];
  const response: any = await $fetch("/api/product/search?search_term=" + searchTerm, {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  response.data.forEach(function (value: any) {
    const product = new Product(value);
    productList.push(product);
  });
  return productList;
}
