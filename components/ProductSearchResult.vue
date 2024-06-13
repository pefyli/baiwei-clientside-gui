<template>
  <div class="product-page-container">
    <!-- Filter Section -->
    <div class="filter-container">
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
    <!-- Product Grid -->
    <div class="product-container">
      <div v-for="product in sortedProductList" :key="product.product_id" class="product-card">
        <!-- Product Details -->
        <p>{{ product.product_name }}</p>
        <p>產品價格: {{ product.items.at(0)?.price }}</p>
        <p>庫存量: {{ product.items.at(0)?.quantity }}</p>

        <!-- Product Images -->
        <div v-if="product.mediaUrls" class="image-container">
          <div v-for="mediaUrl in product.mediaUrls" :key="mediaUrl">
            <img :src="mediaUrl" alt="Product Image" class="product-image" />
          </div>
        </div>

        <!-- Product Button -->
        <div class="button-container">
          <div>
            <NuxtLink :to="'/productpage?product_id=' + product.product_id">
              <el-button class="product-button">立即購買</el-button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import { convertBuffer, getProductItemsById, getProductMediaByProductId, searchProduct } from "~/server/services/productService";
import type { Product } from "~/models/ProductModel";
const router = useRouter();

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

const sortedProductList = computed(() => {
  const sortedProducts = [...searchResult.value]; // Make a copy to avoid mutating original data
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
    sortedProducts.sort((a, b) => (a.items[0] ? (b.items[0] ? b.items[0].price - a.items[0].price : -1) : 1));
  } else if (orderByPrice.value === "orderByPriceAsc") {
    sortedProducts.sort((a, b) => (a.items[0] ? (b.items[0] ? a.items[0].price - b.items[0].price : 1) : -1));
  }
  return sortedProducts;
});

// Accessing the search parameter from the URL
const searchTerm = ref(router.currentRoute.value.query.term as string);
const searchResult = ref<Product[]>([]); // Initialize as empty array

watch(
  () => router.currentRoute.value,
  async (to) => {
    const newTerm = to.query.term as string;
    await fetchSearch(newTerm);
  },
);

onMounted(async () => {
  await fetchSearch(searchTerm.value);
});

const fetchSearch = async (searchTerm: string) => {
  const products = await searchProduct(searchTerm);
  for (const product of products) {
    let mediaList = await getProductMediaByProductId(product.product_id);
    const productItems = await getProductItemsById(product.product_id);
    mediaList = mediaList.filter((media) => media.display_location === 0);
    if (mediaList.length > 0) {
      product.mediaUrls = convertBuffer(mediaList);
    }
    if (productItems) {
      product.items = productItems.items;
    }
  }
  searchResult.value = products;
};
</script>
