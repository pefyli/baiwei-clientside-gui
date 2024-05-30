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
      <option value="orderByPriceAsc">價格由高到低</option>
      <option value="orderByPriceDesc">價格由低到高</option>
    </select>
  </div>
  <br /><br />
  <div class="product-container">
    <div v-for="product in sortedProductList" :key="product.product_id" class="product-card">
      <p>{{ product.product_name }}</p>
      <p>產品價格: {{ product.price }}</p>
      <p>庫存量: {{ product.inventory_quantity }}</p>
      <div v-if="product.mediaUrls" class="image-container">
        <div v-for="mediaUrl in product.mediaUrls" :key="mediaUrl">
          <img :src="mediaUrl" alt="Product Image" class="product-image" />
        </div>
      </div>
      <div class="button-container">
        <div>
          <NuxtLink :to="'/productpage?product_id=' + product.product_id">
            <el-button class="product-button">立即購買</el-button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { Product } from "~/models/ProductModel";
import { getProducts, getProductMediaByProductId, convertBuffer } from "~/server/services/productService";

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
  const products = await getProducts();
  for (const product of products) {
    let mediaList = await getProductMediaByProductId(product.product_id);
    mediaList = mediaList.filter((media) => media.display_location === 0);
    if (mediaList.length > 0) {
      product.mediaUrls = convertBuffer(mediaList);
    }
  }
  productList.value = products;
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
</script>
