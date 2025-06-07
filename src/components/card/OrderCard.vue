<template>
    <div class="order-card-wrapper">
        <n-card class="mb-4" :title="order.shop" hoverable>
            <template #header-extra>
                <n-tag type="info">{{ order.status }}</n-tag>
            </template>
            <div class="order-card-info" @click="getOrderItem(order.id)">
                <n-space align="start" :wrap="false" size="large">
                    <!-- 左侧：头像与店铺信息 -->
                    <div class="order-left">
                        <n-avatar :size="80" :src="order.shop || null" />
                    </div>

                    <!-- 右侧：订单详情 -->
                    <div class="order-right">
                        <div class="order-detail-time">下单时间：{{ order.createdAt }}</div>
                        <div class="order-items">{{ order.items.join('、') }}</div>
                        <div class="order-total">￥{{ order.total }}</div>
                    </div>
                </n-space>
            </div>
            <!-- 送餐进度条 -->
            <div style="overflow-x: auto" class="timeline-container">
                <template v-if="order.status !== Status.Finished">
                    <!-- 横向进度条 -->
                    <n-timeline horizontal>
                        <n-timeline-item v-for="(step, index) in steps" :key="index"
                            :type="index < currentStep ? 'success' : (index === currentStep ? 'warning' : 'default')"
                            :title="step.title" :content="step.content" :time="step.time" />
                    </n-timeline>
                </template>

                <template v-else>
                    <!-- 订单完成后显示的按钮组 -->
                    <div class="action-buttons">
                        <n-button type="primary" ghost @click="evaluate(order)">评价</n-button>
                        <n-button type="info" ghost @click="viewInvoice(order)">查看发票</n-button>
                        <n-button type="error" ghost @click="deleteOrder(order)">删除订单</n-button>
                        <n-button type="success" ghost @click="buyAgain(order)">再次购买</n-button>
                    </div>
                </template>
            </div>

        </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Status, type Order, type OrderItem } from '@/types/order'
import { useTokenStore } from '@/stores/token'

const route = useRoute()
const router = useRouter()
// TODO: 根据订单状态决定是否显示进度条的逻辑
const isShowTimeline = (status: string) => {
    if (status === '已完成') {
        return true
    }
    return false
}
// 组件参数
const { order } = defineProps({
    order: {
        type: Object as () => Order,
        required: true
    }
})

// 定义进度条状态数据
const steps = [
    {
        title: '下单成功',
        content: '用户已提交订单',
        time: '2025-05-19 15:00',
        type: 'success',
    },
    {
        title: '商家接单',
        content: '商家已确认并准备制作',
        time: '2025-05-19 15:02',
        type: 'info',
    },
    {
        title: '配送中',
        content: '骑手正在配送',
        time: '2025-05-19 15:10',
        type: 'info',
    },
    {
        title: '送达',
        content: '订单已送达用户手中',
        time: '',
        type: 'warning',
    },
    {
        title: '完成',
        content: '订单流程已结束',
        time: '',
        type: 'default',
    }
]

const currentStep = ref(3) // 当前步骤索引

const getOrderItem = (id: string) => {
    console.log('获取订单详情', id)
    if (useTokenStore().role != 'rider') {
        router.push({ path: '/customer/order/:id', query: { id } }) // 添加路由参数
    } else if (useTokenStore().role == 'rider') {
        router.push({ path: '/rider/order/:id', query: { id } })
    }
}

// TODO：按钮逻辑
const evaluate = (order: Order) => {
    // 跳转评价页面或弹出评价窗口
    console.log('评价', order)
    alert("Not implemented")
}

const viewInvoice = (order: Order) => {
    // 打开发票详情
    console.log('查看发票', order)
    alert("Not implemented")
}

const deleteOrder = (order: Order) => {
    // 弹出确认框并删除
    console.log('删除订单', order)
    alert("Not implemented")
}

const buyAgain = (order: Order) => {
    // 跳转购买流程
    console.log('再次购买', order)
    alert("Not implemented")
}


</script>

<style scoped>
.order-card-wrapper {
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
}

/* 动态光影 */
.mb-4 {
    margin-bottom: 1rem;
    border-radius: 12px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* 悬停效果 */
.mb-4:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

/* .order-card-info {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    margin: 8px 5px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
} */

/* .order-card-info:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
} */

.order-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 160px;
}

.store-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.store-name {
    font-size: 16px;
    font-weight: 500;
    color: #1f2937;
}

.order-time {
    font-size: 14px;
    color: #6b7280;
}

.order-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
}

.order-detail-time {
    font-size: 14px;
    color: #6b7280;
}

.order-items {
    font-size: 15px;
    color: #374151;
}

.order-total {
    font-size: 18px;
    font-weight: bold;
    color: #ef4444;
}

/* 进度条 */
.timeline-container {
    margin-top: 1rem;
    max-height: 10rem;
    overflow-y: hidden;
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    justify-content: flex-start;
}
</style>
