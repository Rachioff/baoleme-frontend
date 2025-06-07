<template>
  <n-drawer
    :show="show"
    :default-height="400"
    placement="bottom"
    rezi
    @update:show="$emit('update:show', $event)"
  >
    <n-drawer-content :native-scrollbar="false">
      <template #header>
        <n-space justify="space-between" align="center" style="width: 100%;">
          <span>购物车</span>
          <n-button text @click="handleClearCart">
            <template #icon><n-icon :component="TrashOutline" /></template>
            清空
          </n-button>
        </n-space>
      </template>
      
      <n-spin :show="cartStore.isLoading">
        <div v-if="cartStore.items.length > 0">
          <div v-for="cartItem in cartStore.items" :key="cartItem.item.id" class="cart-item">
            <n-image :src="cartItem.item.cover.thumbnail" class="item-image" lazy />
            <div class="item-info">
              <span class="item-name">{{ cartItem.item.name }}</span>
              <span class="item-price">¥{{ (cartItem.item.price / 100).toFixed(2) }}</span>
            </div>
            <QuantityControl
              :quantity="cartItem.quantity"
              @add="cartStore.addItem(cartItem.item.id)"
              @remove="cartStore.removeItem(cartItem.item.id)"
            />
          </div>
        </div>
        <n-empty v-else description="购物车是空的" style="margin-top: 80px;" />
      </n-spin>

      <template #footer>
        <n-space justify="space-between" align="center">
          <div>
            总计: <span class="total-price">¥{{ (cartStore.totalPrice / 100).toFixed(2) }}</span>
          </div>
          <n-button type="primary" :disabled="!cartStore.info?.settlable">
            去结算 ({{ cartStore.totalItemsCount }}件)
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { NDrawer, NDrawerContent, NSpace, NButton, NIcon, NEmpty, NImage, NSpin, useDialog } from 'naive-ui';
import { TrashOutline } from '@vicons/ionicons5';
import QuantityControl from '@/components/common/QuantityControl.vue';

defineProps({
  show: {
    type: Boolean,
    required: true,
  }
});

defineEmits(['update:show']);

const cartStore = useCartStore();
const dialog = useDialog();

const handleClearCart = () => {
  dialog.warning({
    title: '确认清空',
    content: '您确定要清空购物车中的所有商品吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      cartStore.clearShopCart();
    }
  });
};
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.item-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin-right: 12px;
}
.item-info {
  flex-grow: 1;
}
.item-name {
  font-size: 14px;
}
.item-price {
  font-size: 12px;
  color: #888;
}
.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
}
</style>