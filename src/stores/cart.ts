// src/stores/cart.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCartInfo, getCartItems, updateCartItemQuantity, clearCart } from '@/api/cart';
import type { CartInfo, CartItem } from '@/types/cart';

export const useCartStore = defineStore('cart', () => {
  // =================================================================
  // State: 定义状态
  // =================================================================
  
  /**
   * 购物车摘要信息 (总价, 是否可结算等)
   */
  const info = ref<CartInfo | null>(null);
  
  /**
   * 购物车内的商品列表
   */
  const items = ref<CartItem[]>([]);
  
  /**
   * 购物车是否正在加载或操作中
   */
  const isLoading = ref(false);
  
  /**
   * 当前购物车的店铺ID
   */
  const currentShopId = ref<string | null>(null);

  // =================================================================
  // Getters: 定义计算属性
  // =================================================================

  /**
   * 根据商品ID获取其在购物车中的数量
   */
  const itemQuantity = computed(() => {
    return (productId: string): number => {
      const item = items.value.find(i => i.item.id === productId);
      return item ? item.quantity : 0;
    };
  });

  /**
   * 购物车商品总数
   */
  const totalItemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });
  
  /**
   * 购物车总价（分）
   */
  const totalPrice = computed(() => {
    return info.value?.total || 0;
  });

  // =================================================================
  // Actions: 定义操作购物车的函数
  // =================================================================

  /**
   * 从后端加载/刷新整个购物车的数据
   * @param shopId 店铺ID
   */
  async function loadCart(shopId: string) {
    isLoading.value = true;
    currentShopId.value = shopId;
    try {
      // 并行获取购物车信息和商品列表
      const [cartInfo, cartItems] = await Promise.all([
        getCartInfo(shopId),
        getCartItems(shopId),
      ]);
      info.value = cartInfo;
      items.value = cartItems;
    } catch (error) {
      // 如果购物车不存在 (例如404)，则将其视为空购物车
      console.warn(`加载店铺 ${shopId} 购物车失败，可能为空:`, error);
      info.value = { settlable: false, total: 0, totalWithoutPromotion: 0 };
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 增加一件商品
   * @param itemId 商品ID
   */
  async function addItem(itemId: string) {
    if (!currentShopId.value) return;
    const shopId = currentShopId.value;
    const currentQuantity = itemQuantity.value(itemId);
    const newQuantity = currentQuantity + 1;
    await updateItemQuantity(shopId, itemId, newQuantity);
  }

  /**
   * 减少一件商品
   * @param itemId 商品ID
   */
  async function removeItem(itemId: string) {
    if (!currentShopId.value) return;
    const shopId = currentShopId.value;
    const currentQuantity = itemQuantity.value(itemId);
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      await updateItemQuantity(shopId, itemId, newQuantity);
    }
  }

  /**
   * 内部函数，用于调用API并刷新购物车
   */
  async function updateItemQuantity(shopId: string, itemId: string, quantity: number) {
    isLoading.value = true;
    try {
      await updateCartItemQuantity(shopId, itemId, quantity);
      // 操作成功后，立即刷新整个购物车以保证数据同步
      await loadCart(shopId);
    } catch (error) {
      console.error(`更新商品 ${itemId} 数量失败:`, error);
      // 可以在此添加用户错误提示
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 清空当前店铺的购物车
   */
  async function clearShopCart() {
    if (!currentShopId.value) return;
    const shopId = currentShopId.value;
    isLoading.value = true;
    try {
      await clearCart(shopId);
      // 清空成功后，刷新购物车
      await loadCart(shopId);
    } catch (error) {
      console.error(`清空购物车失败:`, error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    info,
    items,
    isLoading,
    currentShopId,
    itemQuantity,
    totalItemsCount,
    totalPrice,
    loadCart,
    addItem,
    removeItem,
    clearShopCart
  };
});