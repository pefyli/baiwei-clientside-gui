import { Item } from "~/models/ItemModel";
import { Media } from "~/models/MediaModel";
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

export async function getProductItemsById(productId: number): Promise<Product> {
  const response: any = await $fetch("/api/product/" + productId + "/item", {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  return new Product(response.data);
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

export async function getItemById(itemId: number): Promise<Item> {
  const response: any = await $fetch("/api/item/" + itemId, {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  return new Item(response.data);
}

export async function getProductMediaByProductId(productId: number): Promise<Media[]> {
  const mediaList: Media[] = [];
  const response: any = await $fetch("/api/product/" + productId + "/media", {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  response.data.forEach(function (value: any) {
    const product = new Media(value);
    mediaList.push(product);
  });
  return mediaList;
}

export function convertBuffer(mediaBufferList: Media[]): string[] {
  const mediaUrlList: string[] = [];
  if (mediaBufferList) {
    mediaBufferList.forEach((mediaBuffer) => {
      if (mediaBuffer.product_media.data) {
        const blob = new Blob([new Uint8Array(mediaBuffer.product_media.data)], { type: "image/jpeg" });
        mediaUrlList.push(URL.createObjectURL(blob));
      } else {
        throw new Error("Invalid media buffer");
      }
    });
  }
  return mediaUrlList;
}

export async function searchProduct(searchTerm: string): Promise<Product[]> {
  const productList: Product[] = [];
  const response: any = await $fetch("/api/search?search_term=" + searchTerm, {
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
