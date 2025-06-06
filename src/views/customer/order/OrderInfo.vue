<template>
    <div class="order-info-container">
        <h1 class="title">订单详情</h1>

        <!-- 概要部分 -->
        <n-card class="summary-card">
            <div class="summary-wrapper">
                <!-- 左侧头像与概要 -->
                <div class="summary-left">
                    <n-avatar :src="order.storeAvatar" round size="60" />
                    <div class="info-list">
                        <div class="store-name">{{ order.storeName }}</div>
                        <div class="order-time">{{ order.orderTime }}</div>
                    </div>
                </div>

                <!-- 右侧详情 -->
                <div class="summary-right">
                    <div class="store-link">店铺链接 →</div>
                    <div class="detail-wrapper">
                        <div class="actions">
                            <n-button strong size="small">评价</n-button>
                            <n-button strong size="small" secondary>再次购买</n-button>
                            <n-button strong size="small" tertiary type="error">反馈</n-button>
                        </div>

                        <n-collapse class="order-info-collapse">
                            <n-collapse-item title="交易信息" name="1">
                                <p>实付：￥{{ order.total }}</p>
                                <p>共减：￥{{ order.discount}}</p>
                                <p>合计：￥{{ order.total + order.discount }}</p>
                                <p>订单号：{{ order.id }}</p>
                                <p>支付时间：{{ order.payTime }}</p>
                                <p>配送时间：{{ order.deliveryTime }}</p>
                                <p>送达时间：{{ order.receiveTime }}</p>
                            </n-collapse-item>
                            <n-collapse-item title="收货信息" name="2">
                                <p>收货人：{{ order.address }}</p>
                                <p>联系电话：{{ order.phone }}</p>
                                <p>备注：{{ order.remark }}</p>
                            </n-collapse-item>
                            <n-collapse-item title="物流信息" name="3">
                                <p>配送方式：自提</p>
                                <p>配送员：张三</p>
                                <p>联系电话：13800138000</p>
                                <p>配送时间：{{ order.deliveryTime }}</p>
                                <p>送达时间：{{ order.receiveTime }}</p>
                            </n-collapse-item>
                        </n-collapse>
                    </div>
                </div>
            </div>
        </n-card>

        <!-- 反馈与权益 -->
        <n-card class="feedback-card">
            <p>如有问题，请点击反馈或查看订单权益。</p>
        </n-card>

        <!-- 商品推荐 -->
        <n-card title="为你推荐" class="recommend-card">
            <hr>
            <div class="recommend-card-container">
                <div class="recommend-items" v-for="product in sampleProduct" :key="product.name">
                    <Recommendation :product="product" />
                </div>
            </div>
        </n-card>
        <div class="pagination-wrapper mt-4">
            <!-- 分页 Pagination -->
            <n-pagination v-model:page="page" :page-count="pageCount" :page-size="pageSize"
                @update:page="handlePageChange" />
        </div>
    </div>
    <n-back-top :bottom="160"></n-back-top>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Recommendation from './Recommendation.vue'
import { useRoute } from 'vue-router'
import { type OrderDetail, type RecommendItem} from '@/types/order'

const order = ref<OrderDetail>({
    id: 12345678,
    storeName: '麦当劳',
    storeAvatar: 'https://picsum.photos/seed/avatar/60',
    orderTime: '2025-05-19 13:00',
    time: '2025-05-19 13:00',
    total: 28.5,
    items: [],
    discount: 3.5,
    payTime: '2025-05-19 13:05',
    deliveryTime: '2025-05-19 13:30',
    receiveTime: '2025-05-19 13:40',
    status: '已完成',
    address: '北京市海淀区中关村大街1号',
    phone: '13800138000',
    remark: '不要辣'
})
// m模拟数据
const sampleProduct = ref<RecommendItem[]>([{
    id: 1,
    image: 'https://picsum.photos/300/300?random=1',
    name: '酸辣粉',
    category: '地方小吃',
    rating: 4.5,
    price: 18.8,
    discount: '限时优惠'
}, {
    id: 2,
    image: 'https://picsum.photos/300/300?random=1',
    name: '酸辣粉',
    category: '地方小吃',
    rating: 4.5,
    price: 18.8,
    discount: '限时优惠'
}, {
    id: 3,
    image: 'https://picsum.photos/300/300?random=1',
    name: '酸辣粉',
    category: '地方小吃',
    rating: 4.5,
    price: 18.8,
    discount: '限时优惠'
}, {
    id: 4,
    image: 'https://picsum.photos/300/300?random=1',
    name: '酸辣粉',
    category: '地方小吃',
    rating: 4.5,
    price: 18.8,
    discount: '限时优惠'
}])
// TODO: 分页
const page = ref(2)
const pageSize = 5

const pageCount = computed(() => {
    Math.ceil(sampleProduct.value.length / pageSize)
})

const currentPageOrders = computed(() => {
    const start = (page.value - 1) * pageSize
    return sampleProduct.value.slice(start, start + pageSize)
})

function handlePageChange(newPage: number) {
    page.value = newPage
}

const route = useRoute()
const orderId = route.params.id || '12345678'

// 数据

</script>

<style scoped>
.order-info-container {
    padding: 16px;
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
}

.summary-card {
    margin-bottom: 16px;
}

.summary-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

.summary-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.info-list {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #555;
}

.store-name {
    font-weight: bold;
    font-size: 16px;
}

.order-time {
    color: #888;
    font-size: 13px;
}

.summary-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.store-link {
    color: #409eff;
    cursor: pointer;
    font-weight: 500;
}

.detail-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.actions {
    display: flex;
    gap: 8px;
}

.feedback-card {
    margin-bottom: 16px;
    font-size: 14px;
    color: #666;
}

.recommend-card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.recommend-card-container::after {
    display: table;
    content: '';
    clear: both;
}

.recommend-card {
    font-size: 14px;
}

.recommend-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    font-size: 12px;
    color: #444;
}
</style>
