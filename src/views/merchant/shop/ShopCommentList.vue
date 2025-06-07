<template>
  <n-card>
    <!-- 商家评分栏 -->
    <div class="shop-rating-header" v-if="shopInfo">
      <div class="rating-overview">
        <h2>商家评分</h2>
        <div class="rating-display">
          <span class="rating-value">{{ shopInfo.rating }}</span>
          <n-rate readonly :value="starCount" :count="5" />
          <span class="rating-text">{{ ratingText }}</span>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="review-list">
      <h2>用户评价 ({{ totalReviews }})</h2>
      <n-list>
        <n-list-item v-for="review in reviews" :key="review.id">
          <div class="review-item">
            <div class="user-info">
              <n-avatar round :src="review.user.avatar.thumbnail" />
              <div class="user-details">
                <span class="username">{{ review.user.name }}</span>
                <span class="review-time">{{ formatTime(review.createdAt) }}</span>
              </div>
            </div>
            <div class="review-rating">
              <n-rate readonly :value="review.rating / 10" :count="5" />
              <span class="rating-description">{{ getRatingDescription(review.rating) }}</span>
            </div>
            <div class="review-content">
              {{ review.content }}
            </div>
          </div>
        </n-list-item>
        
        <!-- 加载更多 -->
        <n-list-item v-if="hasMore && !loading">
          <div class="load-more" @click="loadMore">
            <n-button text type="primary">加载更多</n-button>
          </div>
        </n-list-item>
        
        <!-- 加载状态 -->
        <n-list-item v-if="loading">
          <n-spin size="small" />
          <span style="margin-left: 10px">加载中...</span>
        </n-list-item>
        
        <!-- 没有更多数据 -->
        <n-list-item v-if="!hasMore && reviews.length > 0">
          <div class="no-more">没有更多评价了</div>
        </n-list-item>
        
        <!-- 空状态 -->
        <n-list-item v-if="reviews.length === 0 && !loading">
          <n-empty description="暂无评价" />
        </n-list-item>
      </n-list>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { NRate, NAvatar, NList, NListItem, NCard, NButton, NSpin, NEmpty } from 'naive-ui'
import { format } from 'date-fns'
import axios from 'axios'
import type { UserComment } from '@/types/user'
import type { Comment } from '@/types/comment'
import type { ShopInfo } from '@/types/shop'
import { useRoute } from 'vue-router'
const route = useRoute()
const shopId = route.params.id as string

const shopInfo = ref<ShopInfo | null>(null)
const reviews = ref<Comment[]>([])
const loading = ref(false)
const page = ref(0)
const pageSize = ref(10)
const totalReviews = ref(0)
const hasMore = ref(true)

// 计算商家星级 (50分=5星，40分=4星，以此类推)
const starCount = computed(() => {
  if (!shopInfo.value) return 0
  return Math.floor(shopInfo.value.rating / 10)
})

// 商家评分文本
const ratingText = computed(() => {
  const texts = ['差评', '不满意', '一般', '满意', '非常满意']
  return texts[starCount.value - 1] || ''
})

// 格式化时间
const formatTime = (time: string) => {
  return format(new Date(time), 'yyyy-MM-dd HH:mm')
}

// 获取评分描述
const getRatingDescription = (rating: number) => {
  const star = rating / 10
  const descriptions = ['差评', '不满意', '一般', '满意', '非常满意']
  return descriptions[star - 1] || ''
}

// 获取店铺信息
const fetchShopInfo = async () => {
  try {
    const response = await axios.get(`/shops/${shopId}`)
    shopInfo.value = response.data
  } catch (error) {
    console.error('获取店铺信息失败:', error)
  }
}

// 获取评价列表
const fetchReviews = async (reset = false) => {
  if (loading.value) return
  
  loading.value = true
  try {
    const currentPage = reset ? 0 : page.value
    const response = await axios.get(`/shops/${shopId}/comments`, {
      params: {
        p: currentPage,
        pn: pageSize.value
      }
    })
    
    if (reset) {
      reviews.value = response.data
      page.value = 1
    } else {
      reviews.value = [...reviews.value, ...response.data]
      page.value++
    }
    
    // 检查是否还有更多数据
    hasMore.value = response.data.length >= pageSize.value
    
    // 如果是第一次加载，获取总评价数
    if (reset && response.headers['x-total-count']) {
      totalReviews.value = parseInt(response.headers['x-total-count'], 10)
    }
  } catch (error) {
    console.error('获取评价列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  fetchReviews()
}

// 初始化加载
onMounted(() => {
  fetchShopInfo()
  fetchReviews(true)
})
</script>

<style scoped>
.shop-rating-header {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.rating-overview {
  display: flex;
  align-items: center;
  gap: 20px;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-value {
  font-size: 24px;
  font-weight: bold;
  color: #ff9900;
}

.rating-text {
  color: #ff9900;
  font-weight: bold;
}

.review-list {
  margin-top: 20px;
}

.review-item {
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.review-item:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
}

.review-time {
  font-size: 12px;
  color: #999;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.rating-description {
  color: #ff9900;
}

.review-content {
  line-height: 1.6;
  color: #333;
}

.load-more {
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
}

.no-more {
  text-align: center;
  padding: 10px 0;
  color: #999;
  font-size: 14px;
}
</style>