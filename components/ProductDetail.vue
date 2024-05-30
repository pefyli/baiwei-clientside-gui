<template>
  <div class="product-detail-container">
    <!-- Display search results here -->
    <div v-if="product" class="product-detail-card">
      <div class="product-image-container">
        <el-carousel trigger="click" height="400px">
          <el-carousel-item v-for="(mediaUrl, index) in product.mediaUrls" :key="index">
            <img :src="mediaUrl" alt="Product Image" class="product-image" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="product-info-container">
        <p>{{ product.product_name }}</p>
        <p>商品描述: {{ product.product_description }}</p>
        <p>產品價格: {{ product.price }}</p>
        <p>庫存量: {{ product.inventory_quantity }}</p>
        <div class="quantity-container">
          <label for="quantity">數量:</label>
          <div class="input-group">
            <button @click="decrementQuantity">-</button>
            <span>{{ quantity }}</span>
            <button @click="incrementQuantity">+</button>
          </div>
        </div>
        <br /><br /><br /><br />
        <div class="button-container">
          <div>
            <el-button class="product-button" @click="product && addProductToCart(product.product_id, quantity)"> 加入購物車 </el-button>
          </div>
          <el-button class="product-button"> 立即結帳 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { ElMessageBox, type Action, ElMessage } from "element-plus";
import { convertBuffer, getProductById, getProductMediaByProductId } from "~/server/services/productService";
import type { Product } from "~/models/ProductModel";
import { getMember } from "~/server/services/memberService";
import { addToCart } from "~/server/services/cartService";
import { ErrorStrToEum, ErrorMsg } from "~/models/ErrorMsg";
import { GeneralMsg } from "~/models/GeneralMsg";
import { getUUID } from "~/server/services/utilService";

const router = useRouter();

// Accessing the search parameter from the URL
const productId = router.currentRoute.value.query.product_id ? parseInt(router.currentRoute.value.query.product_id as string, 10) : null;
const product = ref<Product>(); // Initialize as empty array
const quantity = ref(1);

onMounted(async () => {
  if (productId !== null) {
    await fetchProduct(productId);
  }
});

const addProductToCart = async (productId: number, amount: number) => {
  try {
    const memberId = getMember()?.member_id;
    if (memberId !== undefined) {
      await addToCart(memberId, productId, amount);
    } else {
      // add cart info into localStorage
      const carts = localStorage.getItem("carts") == null ? [] : JSON.parse(localStorage.getItem("carts")!);
      const existingCartItem = carts.find((item: any) => item.product.product_id === productId);
      if (existingCartItem) {
        // If the product exists, increment the amount
        existingCartItem.amount += amount;
        existingCartItem.update_datetime = Date.now();
      } else {
        const product = await getProductById(productId);
        const cart = {
          cart_id: getUUID(),
          amount,
          create_datetime: Date.now,
          update_datetime: Date.now,
          product,
        };
        carts.push(cart);
      }
      localStorage.setItem("carts", JSON.stringify(carts));
    }
  } catch (error: any) {
    if (error.message !== undefined) {
      open(ErrorStrToEum(error.message), ErrorMsg.Error);
    }
  } finally {
    open("加入購物車" + GeneralMsg.Success, undefined);
  }
};

const open = (message: string, title?: string) => {
  ElMessageBox.alert(message, title, {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "OK",
    callback: (action: Action) => {
      ElMessage({
        type: "info",
        message: `action: ${action}`,
      });
    },
  });
};

const fetchProduct = async (productId: number) => {
  const productInfo = await getProductById(productId);
  const mediaList = await getProductMediaByProductId(productId);
  if (mediaList.length > 0) {
    productInfo.mediaUrls = convertBuffer(mediaList);
  }
  product.value = productInfo;
};

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.inventory_quantity) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
</script>

<style scoped>
.product-detail-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh; /* Full viewport height */
  padding: 20px; /* Optional: add some padding */
  box-sizing: border-box; /* Ensure padding does not affect the size */
}
.product-detail-card {
  display: flex;
  max-width: 1000px; /* Max width of the card */
  width: 100%; /* Full width up to the max width */
  padding: 20px; /* Padding inside the card */
  background-color: #fff; /* Background color of the card */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Optional: add some shadow for better appearance */
}
.product-image-container {
  flex: 1; /* Take up equal space */
  margin-right: 20px; /* Space between image and info */
}
.product-info-container {
  flex: 1; /* Take up equal space */
}
.quantity-container {
  margin-top: 10px;
}
.input-group {
  display: flex;
  align-items: center;
}
.input-group button {
  background-color: #d3d3d3;
  color: rgb(39, 38, 38);
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}
.input-group span {
  margin: 0 10px;
}
</style>
