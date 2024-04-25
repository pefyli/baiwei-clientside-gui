<template>
  <div class="product-container">
    <div v-for="cart in shoppingCart" :key="cart.cart_id" style="border-style: double" class="product-card">
      <p>產品名稱: {{ cart.product.product_name }}</p>
      <p>單價: {{ cart.product.price }}</p>
      <div class="quantity-container">
        <label for="quantity">數量:</label>
        <div class="input-group">
          <button @click="decrementQuantity(cart)">-</button>
          <span>{{ cart.amount }}</span>
          <button @click="incrementQuantity(cart)">+</button>
        </div>
      </div>
      <p>金額: {{ cart.product.price * cart.amount }}</p>
      <div class="button-container">
        <div>
          <el-button class="product-button" @click="deleteProductFromCart(cart.cart_id)">移除</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-button v-if="shoppingCart.length" class="product-button" @click="cleanupShoppingCart">清空購物車</el-button>
    </div>
    <p v-if="shoppingCart.length">總計: {{ calculateTotal }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getMember } from "~/server/services/memberService";
import { getMemberCart, updateProductAmount, deleteCart, cleanupCart } from "~/server/services/cartService";
import type { ShoppingCart } from "~/models/ShoppingCartModel";

const shoppingCart = ref<ShoppingCart[]>([]); // Initialize as empty array
const memberId = getMember()?.member_id;

onMounted(async () => {
  await getCart();
});

const getCart = async () => {
  if (memberId !== undefined) {
    shoppingCart.value = await getMemberCart(memberId);
  } else {
    // display cart info from localStorage
  }
};

const incrementQuantity = async (cart: ShoppingCart) => {
  if (cart.amount < cart.product.inventory_quantity) {
    cart.amount++;
    await updateProductAmount(cart);
  }
};

const decrementQuantity = async (cart: ShoppingCart) => {
  if (cart.amount > 1) {
    cart.amount--;
    await updateProductAmount(cart);
  }
};

const calculateTotal = computed(() => {
  return shoppingCart.value.reduce((total, cart) => {
    return total + cart.product.price * cart.amount;
  }, 0);
});

const deleteProductFromCart = async (cartId: number) => {
  const index = shoppingCart.value.findIndex((cart) => cart.cart_id === cartId);
  // If the cart item is found, remove it from the shoppingCart array
  if (index !== -1) {
    shoppingCart.value.splice(index, 1);
  }
  await deleteCart(cartId);
};

const cleanupShoppingCart = async () => {
  if (memberId) {
    shoppingCart.value = [];
    await cleanupCart(memberId);
  }
};
</script>

<style scoped>
.quantity-container {
  margin-top: 10px;
}
.input-group {
  display: flex;
  align-items: center;
}
.input-group button {
  background-color: #0d0d0d(190 59% 39%);
  color: rgb(39, 38, 38);
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}
.input-group span {
  margin: 0 10px;
}
</style>
