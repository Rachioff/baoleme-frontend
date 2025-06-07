<template>
  <n-card class="shop-card" hoverable @click="goToShopDetail">
    <template #cover>
      <n-image :src="shop.cover.thumbnail" object-fit="cover" class="shop-cover-image" />
    </template>
    <n-thing>
      <template #header>
        <n-h3 class="shop-name">{{ shop.name }}</n-h3>
      </template>

      <n-space align="center">
        <n-rate readonly :default-value="shop.rating / 10" size="small" />
        <span class="rating-text">{{ (shop.rating / 10).toFixed(1) }}</span>
        <span class="sale-text">月售 {{ shop.sale }}+</span>
      </n-space>

      <n-space justify="space-between" class="delivery-info">
        <span>起送 ¥{{ (shop.deliveryThreshold / 100).toFixed(2) }}</span>
        <span>配送 ¥{{ (shop.deliveryPrice / 100).toFixed(2) }}</span>
        <span>约 {{ shop.time }}分钟</span>
      </n-space>

      <div v-if="shop.description" class="description-text">
        {{ shop.description }}
      </div>

    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NImage, NThing, NH3, NSpace, NRate } from 'naive-ui';
import type { RecommendedShop } from '@/types/recommend';

const props = defineProps({
  shop: {
    type: Object as PropType<RecommendedShop>,
    required: true
  }
});

const router = useRouter();

const goToShopDetail = () => {
  // 假设店铺详情页的路由是 '/merchant/shops/:shopId/detail'
  router.push({ name: 'MerchantShopDetail', params: { shopId: props.shop.id } });
};
</script>

<style scoped>
.shop-card {
  cursor: pointer;
  transition: all 0.3s;
}
.shop-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.shop-cover-image {
  width: 100%;
  height: 150px;
}
.shop-name {
  margin: 0;
  font-weight: bold;
}
.rating-text, .sale-text, .delivery-info, .description-text {
  font-size: 12px;
  color: #888;
}
.delivery-info {
  margin-top: 8px;
}
.description-text {
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>