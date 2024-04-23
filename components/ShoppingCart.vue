<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getMember } from "~/server/services/memberService";
import { getMemberCart } from "~/server/services/cartService";

onMounted(async () => {
  const cart = await getCart();
  console.log(cart);
});

const getCart = async () => {
  const memberId = getMember()?.member_id;
  if (memberId !== undefined) {
    return await getMemberCart(memberId);
  } else {
    // display cart info from localStorage
  }
};
</script>
