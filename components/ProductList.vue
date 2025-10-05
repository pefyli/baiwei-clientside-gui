<template>
  <!-- Display Categories as Buttons -->
  <div class="category-container">
    <h3>分類</h3>
    <div class="category-buttons">
        <button
          v-for="category in categoryList"
          :key="category.category_id"
          class="category-button"
          :class="{ active: selectedCategoryId === category.category_id }"
          @click="selectedCategoryId = category.category_id"
        >
        {{ category.category_name }}
        </button>
        <button
          class="category-button"
          :class="{ active: selectedCategoryId === null }"
          @click="selectedCategoryId = null"
        >
        全部
  </button>
    </div>
  </div>
  <div class="outer-product-container">
    <div class="product-container">
      <div v-for="product in filteredProductList" :key="product.product_id" class="product-card">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { Product } from "~/models/ProductModel";
import { getProducts, getProductMediaByProductId, convertBuffer } from "~/server/services/productService";
import { getAllCategory } from "~/server/services/categoryService";
import { Category } from "~/models/CategoryModel";

const productList = ref<Product[]>([]); // Initialize as empty array
const categoryList = ref<Category[]>([]);
const orderByTime = ref(""); // Default order by time
const orderByPrice = ref(""); // Default order by price
const selectedCategoryId = ref<number | null>(null);

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
  await fetchCategories();
});

const fetchCategories = async () => {
  const categories = await getAllCategory();
  categoryList.value = categories;
};

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
    sortedProducts.sort((a, b) => (a.items[0] ? (b.items[0] ? b.items[0].price - a.items[0].price : -1) : 1));
  } else if (orderByPrice.value === "orderByPriceAsc") {
    sortedProducts.sort((a, b) => (a.items[0] ? (b.items[0] ? a.items[0].price - b.items[0].price : 1) : -1));
  }
  return sortedProducts;
});

const filteredProductList = computed(() => {
  if (!selectedCategoryId.value) {
    return sortedProductList.value;
  }
  return sortedProductList.value.filter(
    (p) => p.category_id === selectedCategoryId.value
  );
});
</script>
