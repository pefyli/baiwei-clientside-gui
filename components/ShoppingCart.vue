<template>
  <div class="cart-container">
    <div v-if="!shoppingCart.length" class="empty-cart-message-container">
      <div class="empty-cart-message">你的購物車目前還是空的</div>
      <NuxtLink to="/" class="continue-shopping-button"><el-button>去血拚</el-button></NuxtLink>
    </div>
    <div v-if="shoppingCart.length" class="product-container">
      <div v-for="cart in shoppingCart" :key="cart.cart_id" class="product-card">
        <div v-if="mediaUrls" class="image-container">
          <div v-for="(mediaUrl, index) in mediaUrls[cart.item.product_id]" :key="index">
            <img :src="mediaUrl" alt="Product Image" class="product-image" />
          </div>
        </div>
        <div class="product-details">
          <p>
            <NuxtLink :to="'/productpage?product_id=' + cart.item.product_id">{{ cart.item.product_name }}</NuxtLink>
          </p>
          <p>單價: {{ cart.item.price }}</p>
          <p>顏色: {{ cart.item.color }}</p>
          <div class="quantity-container">
            <label for="quantity">數量:</label>
            <div class="input-group">
              <button @click="decrementQuantity(cart)">-</button>
              <span>{{ cart.amount }}</span>
              <button @click="incrementQuantity(cart)">+</button>
            </div>
          </div>
          <p>目前金額: {{ cart.item.price * cart.amount }}</p>
          <div class="button-container">
            <el-button class="product-button" @click="deleteProductFromCart(cart.cart_id)">移除</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="shoppingCart.length" class="checkout-container">
      <el-button class="cleanup-button" @click="cleanupShoppingCart">清空購物車</el-button>
      <el-button class="payment-button">結帳</el-button>
      <p class="total-container">總計: {{ calculateTotal }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getMember } from "~/server/services/memberService";
import { getMemberCart, updateItemAmount, deleteCart, cleanupCart } from "~/server/services/cartService";
import { ShoppingCart } from "~/models/ShoppingCartModel";
import { convertBuffer, getProductById, getProductMediaByProductId } from "~/server/services/productService";

const shoppingCart = ref<ShoppingCart[]>([]); // Initialize as empty array
const mediaUrls = ref<{ [key: number]: string[] }>({}); // Initialize as empty array
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
    const product = await getProductById(cart.item.product_id);
    cart.item.product_name = product.product_name;
    let mediaList = await getProductMediaByProductId(cart.item.product_id);
    mediaList = mediaList.filter((media) => media.display_location === 0);
    if (mediaList.length > 0) {
      mediaUrls.value[cart.item.product_id] = convertBuffer(mediaList); // Assuming media_buffer is in the response
    }
  }
};

const incrementQuantity = async (cart: ShoppingCart) => {
  if (cart.amount < cart.item.quantity) {
    cart.amount++;
    if (memberId) {
      await updateItemAmount(cart);
    }
  }
};

const decrementQuantity = async (cart: ShoppingCart) => {
  if (cart.amount > 1) {
    cart.amount--;
    if (memberId) {
      await updateItemAmount(cart);
    }
  }
};

const calculateTotal = computed(() => {
  return shoppingCart.value.reduce((total, cart) => {
    return total + cart.item.price * cart.amount;
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
.cart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.product-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.product-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-style: double;
  background-color: white;
  margin: 10px;
  padding: 15px;
  width: 80%;
  max-width: 800px; /* Increase size for larger screens */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add some shadow for better visibility */
}

.image-container {
  flex: 1;
  margin-right: 15px;
}

.product-image {
  max-width: 150px; /* Adjust based on your design */
  margin-right: 20px;
}

.product-details {
  flex: 2;
  display: flex;
  flex-direction: column;
}

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
  padding: 10px 15px; /* Larger buttons */
  font-size: 1.2em; /* Larger font size */
}

.input-group span {
  margin: 0 10px;
  font-size: 1.2em; /* Larger font size */
}

.button-container {
  margin-top: 10px;
}

.checkout-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 15px;
  padding: 20px;
  width: 80%;
  max-width: 800px; /* Match the max-width of product-card */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Optional: add some shadow for better appearance */
}

.cleanup-button,
.payment-button {
  margin: 0 10px;
  padding: 10px 20px; /* Larger buttons */
  font-size: 1.1em; /* Larger font size */
  flex: 1;
}

.total-container {
  margin-left: 20px;
  font-size: 1.1em; /* Larger font size */
  text-align: right; /* Align the total amount to the right */
  flex: 2;
}

.empty-cart-message-container {
  text-align: center;
  margin-top: 50px;
}

.empty-cart-message {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.continue-shopping-button {
  color: #333;
}
</style>
