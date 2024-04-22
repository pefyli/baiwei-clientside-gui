<template>
  <div class="product-container">
    <!-- Display search results here -->
    <div v-if="product" style="border-style: double" class="product-card">
      <p>產品名稱: {{ product.product_name }}</p>
      <p>產品描述: {{ product.product_description }}</p>
      <p>產品價格: {{ product.price }}</p>
      <p>庫存量: {{ product.inventory_quantity }}</p>
      <div class="button-container">
        <el-button class="product-button"> 立即購買 </el-button>
        <el-button class="product-button"> 加入購物車 </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { getProductById } from "~/server/services/productService";
import type { Product } from "~/models/ProductModel";

const router = useRouter();

// Accessing the search parameter from the URL
const productId = router.currentRoute.value.query.product_id ? parseInt(router.currentRoute.value.query.product_id as string, 10) : null;
const product = ref<Product>(); // Initialize as empty array

onMounted(async () => {
  if (productId !== null) {
    await fetchProduct(productId);
  }
});

const fetchProduct = async (productId: number) => {
  product.value = await getProductById(productId);
};
</script>
