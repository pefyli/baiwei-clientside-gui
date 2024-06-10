<template>
  <div v-if="product" class="product-detail-container">
    <div class="product-detail-card">
      <div class="product-image-container">
        <el-carousel trigger="click" height="400px">
          <el-carousel-item v-for="(mediaUrl, index) in product.mediaUrls" :key="index">
            <img :src="mediaUrl" alt="Product Image" class="product-image" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="product-info-container">
        <p>{{ product.product_name }}</p>
        <div class="specs-container">
          <label v-for="item in product.items" :key="item.item_id" :class="['spec-label', { active: item === selectedItem }]" @click="selectItem(item)"> {{ item.color }} - {{ item.spec }} </label>
        </div>
        <p>產品價格: {{ selectedItem?.price }}</p>
        <p>庫存量: {{ selectedItem?.quantity }}</p>
        <div class="quantity-container">
          <label for="quantity">數量:</label>
          <div class="input-group">
            <button @click="decrementQuantity">-</button>
            <span>{{ quantity }}</span>
            <button @click="incrementQuantity">+</button>
          </div>
        </div>
        <div class="button-container">
          <el-button class="product-button" @click="product && addProductToCart(product.product_id, selectedItem?.item_id, quantity)"> 加入購物車 </el-button>
          <el-button class="product-button"> 立即結帳 </el-button>
        </div>
      </div>
    </div>
    <div class="product-detail-card">
      <p>
        <b>商品描述:</b><br /><br />
        <span class="product-description">{{ product.product_description }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { ElMessageBox, type Action, ElMessage } from "element-plus";
import { convertBuffer, getItemById, getProductItemsById, getProductMediaByProductId } from "~/server/services/productService";
import type { Product } from "~/models/ProductModel";
import { getMember } from "~/server/services/memberService";
import { addToCart } from "~/server/services/cartService";
import { ErrorStrToEum, ErrorMsg } from "~/models/ErrorMsg";
import { GeneralMsg } from "~/models/GeneralMsg";
import { getUUID } from "~/server/services/utilService";

const router = useRouter();

// Accessing the search parameter from the URL
const productId = router.currentRoute.value.query.product_id ? parseInt(router.currentRoute.value.query.product_id as string, 10) : null;
const product = ref<Product | null>(null); // Initialize as null
const quantity = ref(1);
const selectedItem = ref<any | null>(null); // To handle the selected item specifications

onMounted(async () => {
  if (productId !== null) {
    await fetchProduct(productId);
  }
});

const addProductToCart = async (productId: number, itemId: number, amount: number) => {
  try {
    const memberId = getMember()?.member_id;
    if (memberId !== undefined) {
      await addToCart(memberId, productId, itemId, amount);
    } else {
      // add cart info into localStorage
      const carts = localStorage.getItem("carts") == null ? [] : JSON.parse(localStorage.getItem("carts")!);
      const existingCartItem = carts.find((item: any) => item.item_id === itemId);
      if (existingCartItem) {
        // If the product exists, increment the amount
        existingCartItem.amount += amount;
        existingCartItem.update_datetime = Date.now();
      } else {
        const cart = {
          cart_id: getUUID(),
          amount,
          create_datetime: Date.now(),
          update_datetime: Date.now(),
          item: await getItemById(itemId),
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
  const productInfo = await getProductItemsById(productId);
  const mediaList = await getProductMediaByProductId(productId);
  if (mediaList.length > 0) {
    productInfo.mediaUrls = convertBuffer(mediaList);
  }
  product.value = productInfo;
  selectedItem.value = productInfo.items?.length ? productInfo.items[0] : null;
};

const selectItem = (item: any) => {
  selectedItem.value = item;
  quantity.value = 1; // Reset the quantity to 1 when a new item is selected
};

const incrementQuantity = () => {
  if (selectedItem.value && quantity.value < selectedItem.value.quantity) {
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.product-detail-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  box-sizing: border-box;
}

.product-image-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.product-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 400px; /* Adjust this value as needed */
  object-fit: contain;
  border-radius: 10px;
}

.product-info-container {
  flex: 1;
}

.specs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.spec-label {
  padding: 10px 15px;
  background-color: #d3d3d3;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.spec-label:hover {
  background-color: #b0b0b0;
}

.spec-label.active {
  background-color: #a3d3ff;
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

.button-container {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
}

.product-button {
  margin-top: 0;
}

.product-description {
  white-space: pre-wrap;
}

/* Media queries for responsive design */
@media (min-width: 768px) {
  .product-detail-card {
    flex-direction: row;
  }

  .product-image-container {
    margin-right: 20px;
    margin-bottom: 0;
  }
}

@media (max-width: 767px) {
  .product-detail-card {
    flex-direction: column;
  }

  .product-image-container {
    margin-right: 0;
  }
}
</style>
