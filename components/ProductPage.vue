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
    <div v-for="product in sortedProductList" :key="product.id" style="border-style: double" class="product-card">
      <p>產品名稱: {{ product.product_name }}</p>
      <p>產品價格: {{ product.price }}</p>
      <p>產品描述: {{ product.product_description }}</p>
      <p>庫存量: {{ product.inventory_quantity }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getProduct } from "~/server/services/productService";

const productList = ref([]); // Initialize as empty array
const orderByTime = ref("orderByTime"); // Default order by time
const orderByPrice = ref("orderByPrice"); // Default order by price

// Watch for changes in orderByTime and orderByPrice
watch(orderByTime, (newValue, oldValue) => {
  if (newValue !== "" && newValue !== oldValue) {
    orderByPrice.value = ""; // Reset orderByPrice
  }
});

watch(orderByPrice, (newValue, oldValue) => {
  if (newValue !== "" && newValue !== oldValue) {
    orderByTime.value = ""; // Reset orderByTime
  }
});

onMounted(async () => {
  await fetchProductList();
});

const fetchProductList = async () => {
  productList.value = await getProduct();
};

const sortedProductList = computed(() => {
  const sortedProducts = [...productList.value]; // Make a copy to avoid mutating original data

  // Sort by time
  if (orderByTime.value === "orderByTimeDesc") {
    sortedProducts.sort((a, b) => new Date(b.create_datetime) - new Date(a.create_datetime));
  } else if (orderByTime.value === "orderByTimeAsc") {
    sortedProducts.sort((a, b) => new Date(a.create_datetime) - new Date(b.create_datetime));
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
