<template>
  <div class="evaluation-page">
    <!--顶部导航栏 -->
    <div class="top-bar">
      <n-button text @click="goBack">
        <n-icon size="24">
          <arrow-back />
        </n-icon>
      </n-button>
      <n-button type="primary" @click="submitEvaluation">提交</n-button>
    </div>

    <!-- 提示信息 -->
    <div class="hint-section">
      <n-icon size="20" color="#FFA500">
        <flower />
      </n-icon>
      <span class="hint-text">提交评价或建议，鼓励商家做得更好～</span>
    </div>

    <!-- 评价内容 -->
    <div class="evaluation-content">
      <h3>您对商家/菜品满意吗？</h3>

      <!-- 店铺信息 -->
      <div class="shop-info">
        <n-avatar
          round
          :size="60"
          :src="shopInfo.cover.thumbnail"
        />
        <span class="shop-name">{{ shopInfo.name }}</span>
      </div>

      <!-- 评分 -->
      <div class="rating-section">
        <span class="rating-label">评分</span>
        <n-rate v-model:value="rating" :count="5" :default-value="0" />
      </div>

      <!-- 评价文本框 (评分后才显示) -->
      <div class="comment-section" v-if="rating > 0">
        <n-input
          v-model:value="comment"
          type="textarea"
          placeholder="请写下您的评价..."
          :autosize="{
            minRows: 3,
            maxRows: 5
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NIcon, NAvatar, NRate, NInput } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'
import { Flower } from '@vicons/ionicons5'
import axios from 'axios'
import type { ShopInfo } from '@/types/shop'

export default defineComponent({
  name: 'EvaluationPage',
  components: {
    NButton,
    NIcon,
    NAvatar,
    NRate,
    NInput,
    ArrowBack,
    Flower
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const rating = ref(0)
    const comment = ref('')
    const orderId = route.params.id as string
    const shopInfo = ref<ShopInfo>({
      name: '',
      id: '',
      owner: '',
      createdAt: '',
      description: '',
      categories: [],
      address: {
        coordinate: [],
        province: '',
        city: '',
        district: '',
        address: '',
        name: '',
        tel: ''
      },
      verified: false,
      opened: false,
      openTimeStart: 0,
      openTimeEnd: 0,
      cover: {
        origin: '',
        thumbnail: '',
      },
      detailImage: {
        origin: '',
        thumbnail: '',
      },
      license: {
        origin: '',
        thumbnail: '',
      },
      deliveryThreshold: 0,
      deliveryPrice: 0,
      maximumDistance: 0,
      rating: 0,
      sale: 0,
      averagePrice: 0,
    })

    const getOrderInfo = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`)
        const shopId = response.data.shopId
        const shopResponse = await axios.get(`/shops/${shopId}`)
        shopInfo.value = shopResponse.data
      } catch (error) {
        console.error('获取订单信息失败:', error)
      }
    }

    onMounted(() => {
      getOrderInfo()
    })

    const goBack = () => {
      router.go(-1)
    }

    const submitEvaluation = async () => {
      if (rating.value === 0) {
        window.alert('请先评分')
        return
      }
      
      try {
        const response = await axios.post('/comments', {
          order: orderId,
          rating: rating.value,
          content: comment.value
        })
        
        console.log('评价提交成功:', response.data)
        window.alert('评价提交成功！')
        router.go(-1)
      } catch (error) {
        console.error('评价提交失败:', error)
        window.alert('评价提交失败,请稍后重试')
      }
    }

    return {
      rating,
      comment,
      shopInfo,
      goBack,
      submitEvaluation
    }
  }
})
</script>


<style scoped>
.evaluation-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background-color: #fff;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  flex-shrink: 0;
}

.hint-section {
  background-color: #FFF9C4;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.hint-text {
  color: #FFA500;
  margin-left: 8px;
  font-size: 14px;
}

.evaluation-content {
  margin-top: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.evaluation-content h3 {
  text-align: left;
  margin-bottom: 20px;
}

.shop-info {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.shop-name {
  margin-left: 12px;
  font-size: 18px;
  font-weight: bold;
}

.rating-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rating-label {
  margin-right: 12px;
  font-size: 16px;
}

.comment-section {
  margin-top: 20px;
  flex-grow: 1;
}

.comment-section .n-input {
  height: 100%;
}
</style>