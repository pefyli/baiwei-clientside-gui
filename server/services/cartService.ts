import { ShoppingCart } from "~/models/ShoppingCartModel";

export async function addToCart(memberId: number, productId: number, amount: number) {
  const response: any = await $fetch("/api/cart/" + memberId, {
    onRequest({ options }) {
      options.body = { product_id: productId, amount };
      options.method = "POST";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  return new ShoppingCart(response.data);
}

export async function getMemberCart(memberId: number): Promise<ShoppingCart[]> {
  const shoppingCartList: ShoppingCart[] = [];
  const response: any = await $fetch("/api/cart/" + memberId, {
    onRequest({ options }) {
      options.method = "GET";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  response.data.forEach(function (value: any) {
    const shoppingCart = new ShoppingCart(value);
    shoppingCartList.push(shoppingCart);
  });
  return shoppingCartList;
}
