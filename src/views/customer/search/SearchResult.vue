<!-- src/views/customer/search/SearchResult.vue -->
<template>
  <div class="search-result-container">
    <!-- 搜索头部 -->
    <div class="search-header">
      <n-button quaternary circle @click="router.back()">
        <n-icon size="18"><arrow-left-outlined /></n-icon>
      </n-button>
      <div class="search-input-wrapper" @click="router.push('/search')">
        <n-input
          v-model:value="searchText"
          placeholder="搜索商家、美食"
          readonly
        />
      </div>
    </div>

    <!-- 搜索过滤器 -->
    <div class="search-filters">
      <n-radio-group v-model:value="searchType" class="search-type-selector">
        <n-radio-button value="product">商品</n-radio-button>
        <n-radio-button value="shop">店铺</n-radio-button>
      </n-radio-group>
      
      <div class="filter-controls">
        <n-dropdown :options="sortOptions" @select="handleSortChange">
          <n-button quaternary size="small">
            {{ getCurrentSortLabel() }}
            <n-icon size="tiny"><down-outlined /></n-icon>
          </n-button>
        </n-dropdown>
        
        <n-dropdown :options="filterOptions" @select="handleFilterChange">
          <n-button quaternary size="small">
            筛选
            <n-icon size="tiny"><filter-outlined /></n-icon>
          </n-button>
        </n-dropdown>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-result">
      <div v-if="loading" class="loading-state">
        <n-spin size="large" />
      </div>
      <template v-else>
        <div v-if="searchType === 'product'">
          <div v-if="productResults.length === 0" class="empty-state">
            <n-empty description="您搜索的商品不存在" />
            <div class="recommendation-section">
              <div class="recommendation-title">为您推荐</div>
              <div class="result-list">
                <div 
                  v-for="product in recommendedProducts" 
                  :key="product.id"
                  class="result-item"
                  @click="handleProductClick(product)"
                >
                  <div class="item-image">
                    <img :src="product.cover.thumbnail || product.cover.origin" :alt="product.name" />
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{ product.name }}</div>
                    <div class="item-description">{{ product.description }}</div>
                    <div class="item-price-sales">
                      <div class="item-price">¥{{ product.price }}</div>
                      <div class="item-sales">已售{{ product.sale }}+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="result-list">
            <div 
              v-for="product in productResults" 
              :key="product.id"
              class="result-item"
              @click="handleProductClick(product)"
            >
              <div class="item-image">
                <img :src="product.cover.thumbnail || product.cover.origin" :alt="product.name" />
              </div>
              <div class="item-info">
                <div class="item-name">{{ product.name }}</div>
                <div class="item-description">{{ product.description }}</div>
                <div class="item-price-sales">
                  <div class="item-price">¥{{ product.price }}</div>
                  <div class="item-sales">已售{{ product.sale }}+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else>
          <div v-if="shopResults.length === 0" class="empty-state">
            <n-empty description="您搜索的店铺不存在" />
            <div class="recommendation-section">
              <div class="recommendation-title">为您推荐</div>
              <div class="result-list">
                <div 
                  v-for="shop in recommendedShops" 
                  :key="shop.id"
                  class="result-item shop-item"
                  @click="handleShopClick(shop)"
                >
                  <div class="item-image">
                    <img :src="shop.cover.thumbnail || shop.cover.origin" :alt="shop.name" />
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{ shop.name }}</div>
                    <div class="item-description">{{ shop.description }}</div>
                    <div class="shop-details">
                      <div class="shop-rating">
                        <n-rate readonly size="small" :value="shop.rating" />
                        <span>{{ shop.rating }}</span>
                      </div>
                      <div class="shop-distance">{{ formatDistance(shop.distance) }}</div>
                      <div class="shop-time">{{ formatTime(shop.time) }}</div>
                    </div>
                    
                    <div v-if="shop.recommends && shop.recommends.length > 0" class="shop-recommends">
                      <div 
                        v-for="(product, idx) in shop.recommends" 
                        :key="product.id"
                        class="recommend-product"
                      >
                        <img :src="product.cover.thumbnail || product.cover.origin" :alt="product.name" />
                        <div class="recommend-price">¥{{ product.price }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="result-list">
            <div 
              v-for="shop in shopResults" 
              :key="shop.id"
              class="result-item shop-item"
              @click="handleShopClick(shop)"
            >
              <div class="item-image">
                <img :src="shop.cover.thumbnail || shop.cover.origin" :alt="shop.name" />
              </div>
              <div class="item-info">
                <div class="item-name">{{ shop.name }}</div>
                <div class="item-description">{{ shop.description }}</div>
                <div class="shop-details">
                  <div class="shop-rating">
                    <n-rate readonly size="small" :value="shop.rating" />
                    <span>{{ shop.rating }}</span>
                  </div>
                  <div class="shop-distance">{{ formatDistance(shop.distance) }}</div>
                  <div class="shop-time">{{ formatTime(shop.time) }}</div>
                </div>
                
                <div v-if="shop.recommends && shop.recommends.length > 0" class="shop-recommends">
                  <div 
                    v-for="(product, idx) in shop.recommends" 
                    :key="product.id"
                    class="recommend-product"
                  >
                    <img :src="product.cover.thumbnail || product.cover.origin" :alt="product.name" />
                    <div class="recommend-price">¥{{ product.price }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed,reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeftOutlined, DownOutlined, FilterOutlined } from '@vicons/antd'
import { getRecommendedProducts } from '@/api/product'
import { getRecommendedShops } from '@/api/shop'
import type { Product } from '@/types/product'
import type { Shop } from '@/types/shop'

const router = useRouter()
const route = useRoute()
const searchText = ref('')
const loading = ref(false)
const searchType = ref<'product' | 'shop'>('product')

// 结果列表
const productResults = ref<Product[]>([])
const shopResults = ref<Shop[]>([])
const recommendedProducts = ref<Product[]>([])
const recommendedShops = ref<Shop[]>([])

// 过滤和排序选项
const sortOption = ref<string>('default')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const minRating = ref<number | null>(null)
const categories = ref<string[]>([])

const sortOptions = [
  {
    label: '默认排序',
    key: 'default'
  },
  {
    label: '销量优先',
    key: 'sale'
  },
  {
    label: '评分优先',
    key: 'rating'
  },
  {
    label: '价格从低到高',
    key: 'price_asc'
  },
  {
    label: '价格从高到低',
    key: 'price_desc'
  }
]

const filterOptions = [
  {
    label: '价格区间',
    key: 'price',
    children: [
      {
        label: '全部',
        key: 'all'
      },
      {
        label: '¥0-20',
        key: '0-20'
      },
      {
        label: '¥20-40',
        key: '20-40'
      },
      {
        label: '¥40-60',
        key: '40-60'
      },
      {
        label: '¥60以上',
        key: '60+'
      }
    ]
  },
  {
    label: '评分',
    key: 'rating',
    children: [
      {
        label: '全部',
        key: '0'
      },
      {
        label: '4.5分以上',
        key: '4.5'
      },
      {
        label: '4分以上',
        key: '4'
      },
      {
        label: '3.5分以上',
        key: '3.5'
      }
    ]
  }
]

// 获取当前排序方式的标签
const getCurrentSortLabel = () => {
  const option = sortOptions.find(option => option.key === sortOption.value)
  return option ? option.label : '默认排序'
}

// 处理排序变更
const handleSortChange = (key: string) => {
  sortOption.value = key
  searchProducts()
}

// 处理筛选变更
const handleFilterChange = (key: string) => {
  if (key === 'all') {
    minPrice.value = null
    maxPrice.value = null
  } else if (key === '0-20') {
    minPrice.value = 0
    maxPrice.value = 20
  } else if (key === '20-40') {
    minPrice.value = 20
    maxPrice.value = 40
  } else if (key === '40-60') {
    minPrice.value = 40
    maxPrice.value = 60
  } else if (key === '60+') {
    minPrice.value = 60
    maxPrice.value = null
  } else if (key === '0') {
    minRating.value = null
  } else {
    minRating.value = parseFloat(key)
  }
  
  searchProducts()
}

// 格式化距离
const formatDistance = (distance: number) => {
  if (!distance) return '未知距离'
  if (distance < 1000) {
    return `${distance}m`
  }
  return `${(distance / 1000).toFixed(1)}km`
}

// 格式化配送时间
const formatTime = (time: number) => {
  if (!time) return '未知时间'
  return `${time}分钟`
}

// 处理商品点击
const handleProductClick = (product: Product) => {
  router.push(`/store/${product.shopId}?product=${product.id}`)
}

// 处理店铺点击
const handleShopClick = (shop: Shop) => {
  router.push(`/store/${shop.id}`)
}

// 搜索API - 商品
const searchProducts = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      q: encodeURIComponent(searchText.value.trim()) ,
      page: pagination.page,
      page_size: pagination.pageSize
    }
    
    // 添加排序和筛选参数
    if (sortOption.value !== 'default') {
      params.s = sortOption.value
    }
    
    if (minPrice.value !== null) {
      params.min_p = minPrice.value
    }
    
    if (maxPrice.value !== null) {
      params.max_p = maxPrice.value
    }
    
    if (minRating.value !== null) {
      params.r = minRating.value
    }
    
    if (categories.value.length > 0) {
      params.c = categories.value
    }
    
    if (searchType.value === 'product') {
      const data = await getRecommendedProducts(params)
      productResults.value = data
      
      // 如果没有结果，获取推荐商品
      if (data.length === 0 && !params.q) {
        recommendedProducts.value = await getRecommendedProducts({
          pn: 10
        })
      }
    } else {
      const data = await getRecommendedShops({
        ...params,
        rc: 3 // 获取3个推荐商品
      })
      shopResults.value = data
      
      // 如果没有结果，获取推荐店铺
      if (data.length === 0 && !params.q) {
        recommendedShops.value = await getRecommendedShops({
          pn: 5,
          rc: 3
        })
      }
    }
  } catch (error) {
    console.error('获取搜索结果失败', error)
  } finally {
    loading.value = false
  }
}
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 监听滚动加载更多
const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    if (!loading.value && pagination.page * pagination.pageSize < pagination.total) {
      pagination.page++
      searchProducts()
    }
  }
}
// 监听路由参数变化
watch(
  () => route.query.keyword,
  (newKeyword) => {
    if (newKeyword) {
      searchText.value = newKeyword as string
      searchProducts()
    }
  },
  { immediate: true }
)

// 监听搜索类型变化
watch(searchType, (newVal) => {
  // 重置筛选条件
  sortOption.value = 'default'
  minPrice.value = null
  maxPrice.value = null
  minRating.value = null
  categories.value = []
  searchProducts()
})

// 组件挂载时获取初始数据
onMounted(() => {
  searchProducts()
})
</script>

<style scoped>
.search-result-container {
  min-height: 100vh;
  background-color: #fff;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 12px;
  margin-left: 12px;
  cursor: pointer;
}

.search-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.search-type-selector {
  margin-right: 8px;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.search-result {
  padding: 16px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.recommendation-section {
  width: 100%;
  margin-top: 24px;
}

.recommendation-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.shop-item {
  flex-direction: column;
}

.shop-item .item-image {
  width: 100%;
  height: 140px;
}

.item-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.item-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-price-sales {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 16px;
  color: #ff6b01;
  font-weight: bold;
}

.item-sales {
  font-size: 12px;
  color: #999;
}

.shop-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
  margin: 8px 0;
}

.shop-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.shop-recommends {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  overflow-x: auto;
}

.recommend-product {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.recommend-product img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommend-price {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  text-align: center;
}
</style>