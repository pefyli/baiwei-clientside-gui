import { ShoppingCart } from "~/models/ShoppingCartModel";

export async function addToCart(memberId: number, productId: number, itemId: number, amount: number) {
  const response: any = await $fetch("/api/cart", {
    onRequest({ options }) {
      options.body = { member_id: memberId, product_id: productId, item_id: itemId, amount };
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
  const response: any = await $fetch("/api/cart?member_id=" + memberId, {
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

export async function updateProductAmount(cart: ShoppingCart) {
  const response: any = await $fetch("/api/cart/" + cart.cart_id, {
    onRequest({ options }) {
      options.body = { member_id: cart.member_id, product_id: cart.product.product_id, amount: cart.item.quantity };
      options.method = "PUT";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  return new ShoppingCart(response.data);
}

export async function deleteCart(carId: number) {
  const response: any = await $fetch("/api/cart/" + carId, {
    onRequest({ options }) {
      options.method = "DELETE";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  return new ShoppingCart(response.data);
}

export async function cleanupCart(memberId: number) {
  const response: any = await $fetch("/api/cart", {
    onRequest({ options }) {
      options.body = { member_id: memberId };
      options.method = "DELETE";
    },
    onRequestError({ error }) {
      throw new Error(error.message);
    },
  });
  return new ShoppingCart(response.data);
}
