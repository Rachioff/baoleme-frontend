<template>
  <div class="shop-view-container">
    <div class="header-section">
      <n-image
        v-if="shopInfo?.cover.origin"
        :src="shopInfo.cover.origin"
        class="shop-banner"
        object-fit="cover"
      />
      <n-page-header :title="shopInfo?.name || '加载中...'" @back="goBack" class="page-header" />
    </div>
    
    <n-layout has-sider class="main-layout">
      <n-layout-sider bordered width="100" class="category-sider">
        <n-menu
          :options="categoryMenuOptions"
          v-model:value="activeCategory"
          @update:value="handleCategoryClick"
        />
      </n-layout-sider>

      <n-layout-content ref="contentRef" class="product-content" @scroll="handleScroll">
        <div v-if="isLoading" class="loading-container">
          <n-spin size="large" />
        </div>
        <div v-else>
          <div v-for="group in categoryGroups" :key="group.id">
            <h3 class="category-title" :ref="el => setCategoryTitleRef(el, group.id)">
              {{ group.name }}
            </h3>
            <div v-if="group.products.length > 0">
              <ProductListItem
                v-for="product in group.products"
                :key="product.id"
                :product="product"
                :quantity="cartStore.itemQuantity(product.id)"
                @item-click="handleItemClick"
                @add-to-cart="cartStore.addItem(product.id)"
                @remove-from-cart="cartStore.removeItem(product.id)"
              />
            </div>
            <n-empty v-else :description="`该分类下暂无商品`" class="category-empty" />
          </div>
        </div>
      </n-layout-content>
    </n-layout>
    
    <div class="cart-bar" @click="showCartDrawer = true">
      <n-badge :value="cartStore.totalItemsCount" :max="99" class="cart-badge">
        <n-icon :component="CartOutline" size="28" />
      </n-badge>
      <div class="cart-price">
        ¥{{ (cartStore.totalPrice / 100).toFixed(2) }}
      </div>
      <n-button type="primary" size="medium" :disabled="!cartStore.info?.settlable">
        去结算
      </n-button>
    </div>

    <ProductDetailModal
      v-model:show="showDetailModal"
      :product-id="selectedProductId"
      :product="selectedProduct"
    />

    <CartView v-model:show="showCartDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NPageHeader, NImage, NLayout, NLayoutSider, NLayoutContent, NMenu, NSpin, NEmpty, useMessage, NBadge, NIcon } from 'naive-ui';
import { CartOutline } from '@vicons/ionicons5';
import ProductListItem from '@/components/product/ProductListItem.vue';
import ProductDetailModal from '@/components/product/ProductDetailModal.vue';
import CartView from '@/components/cart/CartView.vue';
import { useCartStore } from '@/stores/cart';
// import { getShopInfo } from '@/api/shop';
// import { getShopAllProducts } from '@/api/product';
// import { getShopItemCategories } from '@/api/category';
import type { ShopInfo } from '@/types/shop';
import type { ProductData } from '@/types/product';
import type { ItemCategory } from '@/types/category';
import type { MenuOption } from 'naive-ui';

// --- 静态样例代码（保持不变） ---
const mockShopInfo: ShopInfo = {
  id: '1', name: '旗舰自营炸鸡汉堡店', description: '全心全意，只为做好每一份炸鸡！',
  cover: { origin: 'https://placehold.co/800x200/f9a825/FFF?text=Baoleme+Shop', thumbnail: '' },
  categories: [], address: { coordinate: [], province: '', city: '', district: '', address: '', name: '', tel: '' },
  owner: '', createdAt: new Date().toISOString(), verified: true, opened: true, openTimeStart: 0, openTimeEnd: 1440,
  deliveryThreshold: 2000, deliveryPrice: 500, maximumDistance: 5, rating: 48, sale: 999, averagePrice: 2500,
  detailImage: { origin: '', thumbnail: '' }, license: { origin: '', thumbnail: '' },
};
const mockCategories: ItemCategory[] = [
  { id: 'cat-1', name: '热销爆款' }, { id: 'cat-2', name: '经典汉堡' }, { id: 'cat-3', name: '香脆炸鸡' },
  { id: 'cat-4', name: '美味小食' }, { id: 'cat-5', name: '清爽饮品' }, { id: 'cat-6', name: '超值套餐' },
];
const mockProducts: ProductData[] = [
  { id: 'prod-1', name: '经典香辣鸡腿堡', description: '鲜嫩多汁的鸡腿肉，配上秘制酱料，微辣开胃。', price: 1800, priceWithoutPromotion: 2200, sale: 500, rating: 49, stockout: false, available: true, categories: ['cat-1', 'cat-2'], cover: { origin: 'https://placehold.co/300x300/fbc02d/FFF?text=Burger', thumbnail: 'https://placehold.co/100x100/fbc02d/FFF?text=Burger' }, createdAt: new Date(), shopId: '1' },
  { id: 'prod-2', name: '吮指原味鸡', description: '外皮酥脆，内里鲜嫩，经典永不过时。', price: 1200, priceWithoutPromotion: 1500, sale: 800, rating: 48, stockout: false, available: true, categories: ['cat-1', 'cat-3'], cover: { origin: 'https://placehold.co/300x300/e53935/FFF?text=Chicken', thumbnail: 'https://placehold.co/100x100/e53935/FFF?text=Chicken' }, createdAt: new Date(), shopId: '1' },
  { id: 'prod-3', name: '双层芝士牛肉堡', description: '双倍牛肉，双倍满足，芝士爱好者首选。', price: 2500, priceWithoutPromotion: 3000, sale: 300, rating: 47, stockout: false, available: true, categories: ['cat-2'], cover: { origin: 'https://placehold.co/300x300/fbc02d/FFF?text=Beef+Burger', thumbnail: 'https://placehold.co/100x100/fbc02d/FFF?text=Beef+Burger' }, createdAt: new Date(), shopId: '1' },
  { id: 'prod-4', name: '香辣鸡翅（2只）', description: '香辣入味，让人欲罢不能。', price: 1000, priceWithoutPromotion: 1000, sale: 600, rating: 48, stockout: false, available: true, categories: ['cat-3'], cover: { origin: 'https://placehold.co/300x300/e53935/FFF?text=Wings', thumbnail: 'https://placehold.co/100x100/e53935/FFF?text=Wings' }, createdAt: new Date(), shopId: '1' },
  { id: 'prod-5', name: '美式大薯条', description: '外脆内软，黄金搭档。', price: 800, priceWithoutPromotion: 1000, sale: 700, rating: 46, stockout: false, available: true, categories: ['cat-4'], cover: { origin: 'https://placehold.co/300x300/ffeb3b/000?text=Fries', thumbnail: 'https://placehold.co/100x100/ffeb3b/000?text=Fries' }, createdAt: new Date(), shopId: '1' },
  { id: 'prod-6', name: '香酥鸡块（5块）', description: '一口一个，追剧必备。', price: 1500, priceWithoutPromotion: 1500, sale: 450, rating: 47, stockout: true, available: true, categories: ['cat-4'], cover: { origin: 'https://placehold.co/300x300/ffeb3b/000?text=Nuggets', thumbnail: 'https://placehold.co/100x100/ffeb3b/000?text=Nuggets' }, createdAt: new Date(), shopId: '1' },
  { id: 'prod-7', name: '可口可乐', description: '快乐肥宅水。', price: 500, priceWithoutPromotion: 500, sale: 999, rating: 50, stockout: false, available: true, categories: ['cat-5'], cover: { origin: 'https://placehold.co/300x300/d32f2f/fff?text=Coke', thumbnail: 'https://placehold.co/100x100/d32f2f/fff?text=Coke' }, createdAt: new Date(), shopId: '1' },
];
// --- 静态样例代码结束 ---

const route = useRoute();
const router = useRouter();
const message = useMessage();
const shopId = route.params.shopId as string;
const cartStore = useCartStore();

const isLoading = ref(true);
const shopInfo = ref<ShopInfo | null>(null);
const categories = ref<ItemCategory[]>([]);
const products = ref<ProductData[]>([]);

const activeCategory = ref<string | null>(null);
const contentRef = ref<InstanceType<typeof NLayoutContent> | null>(null);
const categoryTitleRefs = ref<Record<string, HTMLElement>>({});
const setCategoryTitleRef = (el: Element | ComponentPublicInstance | null, id: string) => {
  if (el) categoryTitleRefs.value[id] = el as HTMLElement;
}
const isScrollingProgrammatically = ref(false);
const showDetailModal = ref(false);
const selectedProductId = ref<string | null>(null);
const selectedProduct = ref<ProductData | null>(null);
const showCartDrawer = ref(false);

onMounted(() => {
    shopInfo.value = mockShopInfo;
    categories.value = mockCategories;
    products.value = mockProducts.filter(p => p.available);
    if (mockCategories.length > 0) {
        activeCategory.value = mockCategories[0].id;
    }
    cartStore.loadCart(shopId); 
    isLoading.value = false;
});

const categoryMenuOptions = computed((): MenuOption[] => 
  categories.value.map(cat => ({ label: cat.name, key: cat.id }))
);

// 变更点：重构数据结构
const categoryGroups = computed(() => {
  // 创建一个带空商品数组的分类映射
  const categoryMap: Record<string, { id: string; name: string; products: ProductData[] }> = {};
  for (const cat of categories.value) {
    categoryMap[cat.id] = { ...cat, products: [] };
  }

  // 将商品放入对应的分类中
  for (const product of products.value) {
    for (const catId of product.categories) {
      if (categoryMap[catId]) {
        categoryMap[catId].products.push(product);
      }
    }
  }

  // 返回映射的值数组，保持原始分类顺序
  return Object.values(categoryMap);
});

// productsByCategory 不再需要
// const productsByCategory = computed(() => { ... });

const handleCategoryClick = (key: string) => {
  const targetEl = categoryTitleRefs.value[key];
  if (targetEl) {
    isScrollingProgrammatically.value = true;
    targetEl.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isScrollingProgrammatically.value = false;
    }, 800);
  }
};

const handleScroll = () => {
  if (isScrollingProgrammatically.value) return;
  const scrollContainer = contentRef.value?.$el;
  if (!scrollContainer) return;
  const containerTop = scrollContainer.getBoundingClientRect().top;
  
  for (let i = categoryGroups.value.length - 1; i >= 0; i--) {
    const group = categoryGroups.value[i];
    const titleEl = categoryTitleRefs.value[group.id];
    if (titleEl && titleEl.getBoundingClientRect().top <= containerTop + 1) {
      if (activeCategory.value !== group.id) {
        activeCategory.value = group.id;
      }
      break;
    }
  }
};

const handleItemClick = (productId: string) => {
  selectedProductId.value = productId;
  selectedProduct.value = products.value.find(p => p.id === productId) || null;
  showDetailModal.value = true;
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* 样式保持不变 */
.shop-view-container { display: flex; flex-direction: column; height: 100vh; background-color: #fff; overflow: hidden; }
.header-section { flex-shrink: 0; }
.shop-banner { width: 100%; height: 120px; }
.page-header { border-bottom: 1px solid #eee; }
.main-layout { flex-grow: 1; overflow: hidden; }
.category-sider { height: 100%; overflow-y: auto; background-color: #f8f8f8; }
.product-content { height: 100%; overflow-y: auto; padding: 0 16px; }
.category-title { padding: 16px 0 8px 0; font-size: 16px; font-weight: 600; position: sticky; top: 0; background-color: #fff; z-index: 1; }
.category-empty { padding: 40px 0; }
.cart-bar { flex-shrink: 0; height: 60px; background-color: #4a4a4a; color: #fff; display: flex; align-items: center; padding: 0 16px; justify-content: space-between; cursor: pointer; }
.cart-badge { color: #fff; }
.cart-price { font-size: 18px; font-weight: bold; margin-left: 16px; flex-grow: 1; }
.loading-container { display: flex; justify-content: center; align-items: center; height: 100%; }
</style>