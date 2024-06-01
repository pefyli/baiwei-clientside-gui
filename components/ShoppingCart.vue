<template>
  <div class="product-container">
    <div v-for="cart in shoppingCart" :key="cart.cart_id" style="border-style: double" class="product-card">
      <div v-if="cart.product.mediaUrls" class="image-container">
        <div v-for="(mediaUrl, index) in cart.product.mediaUrls" :key="index">
          <img :src="mediaUrl" alt="Product Image" class="product-image" />
        </div>
      </div>
      <p>
        <NuxtLink :to="'/productpage?product_id=' + cart.product.product_id">{{ cart.product.product_name }}</NuxtLink>
      </p>
      <p>單價: {{ cart.product.price }}</p>
      <div class="quantity-container">
        <label for="quantity">數量:</label>
        <div class="input-group">
          <button @click="decrementQuantity(cart)">-</button>
          <span>{{ cart.amount }}</span>
          <button @click="incrementQuantity(cart)">+</button>
        </div>
      </div>
      <br /><br />
      <p>目前金額: {{ cart.product.price * cart.amount }}</p>
      <div class="button-container">
        <div>
          <el-button class="product-button" @click="deleteProductFromCart(cart.cart_id)">移除</el-button>
        </div>
      </div>
    </div>

    <div>
      <div>
        <div v-if="!shoppingCart.length" class="empty-cart-message-container">
          <div class="empty-cart-message">你的購物車目前還是空的</div>
          <NuxtLink to="/" class="continue-shopping-button"><el-button>去血拚</el-button></NuxtLink>
        </div>
      </div>
      <div>
        <el-button v-if="shoppingCart.length" class="cleanup-button" @click="cleanupShoppingCart">清空購物車</el-button>
      </div>
      <div style="margin-left: 80px">
        <el-button v-if="shoppingCart.length" class="payment-button">結帳</el-button>
      </div>
      <div>
        <p v-if="shoppingCart.length" class="total-container">總計: {{ calculateTotal }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getMember } from "~/server/services/memberService";
import { getMemberCart, updateProductAmount, deleteCart, cleanupCart } from "~/server/services/cartService";
import { ShoppingCart } from "~/models/ShoppingCartModel";
import { convertBuffer, getProductMediaByProductId } from "~/server/services/productService";

const shoppingCart = ref<ShoppingCart[]>([]); // Initialize as empty array
const memberId = getMember()?.member_id;

onMounted(async () => {
  await getCart();
});

const getCart = async () => {
  if (memberId !== undefined) {
    shoppingCart.value = await getMemberCart(memberId);
  } else {
    const storageData = localStorage.getItem("carts");
    if (storageData === null) {
      return [];
    }
    const parsedData: any[] = JSON.parse(storageData);
    parsedData.map((item: any) => new ShoppingCart(item));
    shoppingCart.value = parsedData;
  }
  for (const cart of shoppingCart.value) {
    let mediaList = await getProductMediaByProductId(cart.product.product_id);
    mediaList = mediaList.filter((media) => media.display_location === 0);
    if (mediaList.length > 0) {
      const mediaUrls = convertBuffer(mediaList); // Assuming media_buffer is in the response
      cart.product.mediaUrls = mediaUrls;
    }
  }
};

const incrementQuantity = async (cart: ShoppingCart) => {
  if (cart.amount < cart.product.inventory_quantity) {
    cart.amount++;
    if (memberId) {
      await updateProductAmount(cart);
    }
  }
};

const decrementQuantity = async (cart: ShoppingCart) => {
  if (cart.amount > 1) {
    cart.amount--;
    if (memberId) {
      await updateProductAmount(cart);
    }
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
  if (memberId) {
    if (index !== -1) {
      shoppingCart.value.splice(index, 1);
    }
    await deleteCart(cartId);
  } else {
    shoppingCart.value = shoppingCart.value.filter((item) => item.cart_id !== cartId);
    localStorage.setItem("carts", JSON.stringify(shoppingCart.value));
  }
};

const cleanupShoppingCart = async () => {
  if (memberId) {
    shoppingCart.value = [];
    await cleanupCart(memberId);
  } else {
    shoppingCart.value = [];
    localStorage.removeItem("carts");
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
.cleanup-button {
  position: fixed; /* Fix the cleanup button */
  bottom: 20px; /* Adjust bottom spacing */
  right: 70px; /* Adjust right spacing */
  margin-right: 15px; /* Add margin between the cleanup button and the total container */
  margin-left: 15px;
}
.payment-button {
  position: fixed; /* Fix the cleanup button */
  bottom: 20px; /* Adjust bottom spacing */
  right: 10px; /* Adjust right spacing */
}
.total-container {
  position: fixed; /* Fix the total container */
  bottom: 10px; /* Adjust bottom spacing */
  right: calc(5px + 270px); /* Adjust right spacing */
}
.empty-cart-message-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.empty-cart-message {
  font-size: 1.5em;
  margin-bottom: 20px;
}
.continue-shopping-button {
  /* Remove underline */
  text-decoration: none;
  /* Change color */
  color: #333; /* Change it to your desired color */
}
</style>
