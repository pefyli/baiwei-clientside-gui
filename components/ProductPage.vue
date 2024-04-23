<template>
  <div>
    <!-- Order by Time -->
    <span>排序</span>&nbsp;
    <select v-model="orderByTime">
      <option value="" disabled>選擇時間排序方式</option>
      <option value="orderByTimeDesc">上架時間新到舊</option>
      <option value="orderByTimeAsc">上架時間舊到新</option>
    </select>
    &nbsp;
    <!-- Order by Price -->
    <select v-model="orderByPrice">
      <option value="" disabled>請選擇價格排序方式</option>
      <option value="orderByPriceAsc">價格由低到高</option>
      <option value="orderByPriceDesc">價格由高到低</option>
    </select>
  </div>
  <br /><br />
  <div class="product-container">
    <div v-for="product in sortedProductList" :key="product.product_id" style="border-style: double" class="product-card">
      <p>產品名稱: {{ product.product_name }}</p>
      <p>產品價格: {{ product.price }}</p>
      <p>庫存量: {{ product.inventory_quantity }}</p>
      <div class="button-container">
        <div>
          <NuxtLink :to="'/productpage?product_id=' + product.product_id">
            <el-button class="product-button">立即購買</el-button>
          </NuxtLink>
        </div>
        <el-button class="product-button" @click="addProductToCart(product.product_id, 1)"> 加入購物車 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { ElMessageBox, type Action, ElMessage } from "element-plus";
import type { Product } from "~/models/ProductModel";
import { getProducts } from "~/server/services/productService";
import { getMember } from "~/server/services/memberService";
import { addToCart } from "~/server/services/cartService";
import { ErrorStrToEum, ErrorMsg } from "~/models/ErrorMsg";
import { GeneralMsg } from "~/models/GeneralMsg";

const productList = ref<Product[]>([]); // Initialize as empty array
const orderByTime = ref(""); // Default order by time
const orderByPrice = ref(""); // Default order by price

// Watch for changes in orderByTime and orderByPrice
watch(orderByTime, (newValue: string, oldValue: string) => {
  if (newValue !== "" && newValue !== oldValue) {
    orderByPrice.value = ""; // Reset orderByPrice
  }
});

watch(orderByPrice, (newValue: string, oldValue: any) => {
  if (newValue !== "" && newValue !== oldValue) {
    orderByTime.value = ""; // Reset orderByTime
  }
});

onMounted(async () => {
  await fetchProductList();
});

const fetchProductList = async () => {
  productList.value = await getProducts();
};

const sortedProductList = computed(() => {
  const sortedProducts = [...productList.value]; // Make a copy to avoid mutating original data

  // Sort by time
  if (orderByTime.value === "orderByTimeDesc") {
    sortedProducts.sort((a, b) => {
      const dateA = new Date(a.create_datetime);
      const dateB = new Date(b.create_datetime);
      return dateB.getTime() - dateA.getTime();
    });
  } else if (orderByTime.value === "orderByTimeAsc") {
    sortedProducts.sort((a, b) => {
      const dateA = new Date(a.create_datetime);
      const dateB = new Date(b.create_datetime);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // Sort by price
  if (orderByPrice.value === "orderByPriceDesc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (orderByPrice.value === "orderByPriceAsc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return sortedProducts;
});

const addProductToCart = async (productId: number, amount: number) => {
  try {
    const memberId = getMember()?.member_id;
    if (memberId !== undefined) {
      const response = await addToCart(memberId, productId, amount);
      if (response) {
        open("加入購物車" + GeneralMsg.Success, undefined);
      }
    } else {
      // add cart info into localStorage
    }
  } catch (error: any) {
    if (error.message !== undefined) {
      open(ErrorStrToEum(error.message), ErrorMsg.Error);
    }
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
</script>
