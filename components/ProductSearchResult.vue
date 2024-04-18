<!-- ProductSearchResult.vue -->
<template>
  <div>
    <!-- Display search results here -->
    <div class="product-container">
      <div v-for="product in searchResult" :key="product.product_id" style="border-style: double" class="product-card">
        <p>產品名稱: {{ product.product_name }}</p>
        <p>產品價格: {{ product.price }}</p>
        <p>庫存量: {{ product.inventory_quantity }}</p>
        <el-button class="buy-button"> 立即購買 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { searchProduct } from "~/server/services/productService";
import type { Product } from "~/models/ProductModel";
const router = useRouter();

// Accessing the search parameter from the URL
const searchTerm = router.currentRoute.value.query.term as string;
const searchResult = ref<Product[]>([]); // Initialize as empty array

onMounted(async () => {
  await fetchSearch(searchTerm);
});

const fetchSearch = async (searchTerm: string) => {
  searchResult.value = await searchProduct(searchTerm);
};
</script>
