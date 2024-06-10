<!-- ProductSearchResult.vue -->
<template>
  <!-- Display search results here -->
  <div class="product-container">
    <div v-for="product in searchResult" :key="product.product_id" style="border-style: double" class="product-card">
      <p>{{ product.product_name }}</p>
      <p>產品價格: {{ product.items.at(0)?.price }}</p>
      <p>庫存量: {{ product.items.at(0)?.quantity }}</p>
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
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { convertBuffer, getProductItemsById, getProductMediaByProductId, searchProduct } from "~/server/services/productService";
import type { Product } from "~/models/ProductModel";

const router = useRouter();

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
