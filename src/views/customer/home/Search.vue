<!-- src/views/customer/home/Search.vue -->
<template>
  <div class="search-container">
    <!-- 搜索头部 -->
    <div class="search-header">
      <n-button quaternary circle @click="router.push('/customer/home')">
        <n-icon size="18"><arrow-left-outlined /></n-icon>
      </n-button>
      <div class="search-input-wrapper">
        <n-input
          v-model:value="searchText"
          placeholder="搜索商家、美食"
          clearable
          @keyup.enter="handleSearch"
          @input="handleInput"
          ref="searchInput"
        />
        <n-button
          class="search-button"
          type="primary"
          @click="handleSearch"
          :loading="isSearching"
        >
          搜索
        </n-button>
      </div>
    </div>

    <!-- 实时搜索结果 -->
    <div class="search-suggestions" v-if="searchText && suggestions.length > 0">
      <div 
        v-for="(item, index) in suggestions" 
        :key="index"
        class="suggestion-item"
        @click="handleSuggestionClick(item)"
      >
        <span class="suggestion-text" v-html="highlightText(item.name, searchText)"></span>
        <span class="suggestion-type">{{ item.type === 'product' ? '商品' : '店铺' }}</span>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="!searchText && searchHistory.length > 0">
      <div class="history-header">
        <span>搜索历史</span>
        <n-button text size="small" @click="clearHistory">
          <template #icon>
            <n-icon><delete-outlined /></n-icon>
          </template>
          清空历史
        </n-button>
      </div>
      <div class="history-list">
        <n-tag
          v-for="(item, index) in searchHistory"
          :key="index"
          size="large"
          :bordered="false"
          class="history-tag"
          @click="handleHistoryClick(item)"
        >
          {{ item }}
        </n-tag>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div class="hot-search" v-if="!searchText">
      <div class="hot-header">
        <span>热门搜索</span>
      </div>
      <div class="hot-list">
        <n-tag
          v-for="(item, index) in hotSearches"
          :key="index"
          size="large"
          :bordered="false"
          class="hot-tag"
          @click="handleHotClick(item)"
        >
          {{ item }}
        </n-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DeleteOutlined, ArrowLeftOutlined } from '@vicons/antd'
import { NInput } from 'naive-ui'
import { getRecommendedItems } from '@/api/recommend'
import { getRecommendedShops } from '@/api/recommend'

// 搜索建议项类型定义
interface SuggestionItem {
  id: string
  name: string
  type: 'product' | 'shop'
}

const router = useRouter()
const searchText = ref('')
const searchInput = ref<InstanceType<typeof NInput> | null>(null)
const searchHistory = ref<string[]>([])
const suggestions = ref<SuggestionItem[]>([])
const isSearching = ref(false)
const hotSearches = ref<string[]>([
  '北京烤鸭',
  '麻辣香锅',
  '炸酱面',
  '重庆小面',
  '龙虾',
  '奶茶',
  '早餐',
  '披萨'
])

// 加载热门搜索词
const loadHotSearches = async () => {
  try {
    // TODO: 接入热门搜索API
  } catch (error) {
    console.error('获取热门搜索失败', error)
  }
}

// 处理搜索建议
const handleInput = async () => {
  if (!searchText.value.trim()) {
    suggestions.value = []
    return
  }

  try {
    const [products, shops] = await Promise.all([
      getRecommendedItems({ 
        q: searchText.value.trim(), 
        pn: 5 
      }),
      getRecommendedShops({ 
        q: searchText.value.trim(), 
        pn: 5,
        rc: 0 // 不需要推荐商品
      })
    ])

    // 转换为建议格式
    const productSuggestions: SuggestionItem[] = products.map(product => ({
      id: product.id,
      name: product.name,
      type: 'product'
    }))

    const shopSuggestions: SuggestionItem[] = shops.map(shop => ({
      id: shop.id,
      name: shop.name,
      type: 'shop'
    }))

    // 合并两种类型的建议
    suggestions.value = []
    const maxLength = Math.max(productSuggestions.length, shopSuggestions.length)
    for (let i = 0; i < maxLength; i++) {
      if (i < productSuggestions.length) {
        suggestions.value.push(productSuggestions[i])
      }
      if (i < shopSuggestions.length) {
        suggestions.value.push(shopSuggestions[i])
      }
    }

    // 限制建议数量
    suggestions.value = suggestions.value.slice(0, 10)
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    suggestions.value = []
  }
}

// 处理搜索
const handleSearch = async () => {
  const trimmedText = searchText.value.trim()
  if (!trimmedText) return
  
  // 保存搜索历史
  if (!searchHistory.value.includes(trimmedText)) {
    searchHistory.value.unshift(trimmedText)
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
  
  isSearching.value = true
  try {
    // 跳转到搜索结果页
    router.push({
      path: '/customer/search/result',
      query: { keyword: trimmedText }
    })
  } finally {
    isSearching.value = false
  }
}

// 处理建议点击
const handleSuggestionClick = (item: SuggestionItem) => {
  searchText.value = item.name
  handleSearch()
}

// 处理历史记录点击
const handleHistoryClick = (keyword: string) => {
  searchText.value = keyword
  handleSearch()
}

// 处理热门搜索点击
const handleHotClick = (keyword: string) => {
  searchText.value = keyword
  handleSearch()
}

// 清空历史记录
const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 高亮匹配文本
const highlightText = (text: string, keyword: string) => {
  if (!keyword) return text
  const reg = new RegExp(keyword, 'gi')
  return text.replace(reg, match => `<span class="highlight">${match}</span>`)
}

onMounted(() => {
  // 从本地存储加载搜索历史
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
  
  // 加载热门搜索
  loadHotSearches()
  
  // 自动聚焦搜索框
  searchInput.value?.focus()
})
</script>

<style scoped>
.search-container {
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
}

.search-button {
  margin-left: 12px;
  background-color: #ff6b01;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0 16px;
  height: 32px;
}

.search-suggestions {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  max-height: 60vh;
  overflow-y: auto;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-text {
  font-size: 14px;
  color: #333;
}

.suggestion-type {
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.suggestion-text :deep(.highlight) {
  color: #ff6b01;
  font-weight: bold;
}

.search-history, .hot-search {
  padding: 16px;
}

.history-header, .hot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.history-list, .hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag, .hot-tag {
  background-color: #f5f5f5;
  color: #666;
  cursor: pointer;
}

.history-tag:hover, .hot-tag:hover {
  background-color: #ff6b01;
  color: #fff;
}
</style>