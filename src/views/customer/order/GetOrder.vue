<template>
    <n-tabs v-model:value="activeTab" default-value="signin" size="large" justify-content="space-evenly" animated>
        <n-tab-pane name="getOrder" tab="获取新订单">
            <n-card>
                <div class="order-container">

                    <div class="search-input" @click="router.push('/search')">
                        <n-icon size="16"><search-outlined /></n-icon>
                        <span>搜索订单</span>
                    </div>

                    <n-card v-for="item in orders" :key="item.id" class="order-card">
                        <div class="order-header">
                            <n-icon size="30" corlor="#00c853">
                                <component :is="FileTextOutlined" />
                            </n-icon>
                            <div class="order-distance">距离 {{ item.distance }}km</div>
                            <div class="order-number">
                                <n-tag type="success" round>{{ item.orderNumber }}#</n-tag>
                            </div>

                        </div>

                        <n-divider />

                        <div class="order-info">
                            <div class="order-address">
                                <n-icon><location-icon /></n-icon> {{ item.address }}
                            </div>
                            <div class="order-time">
                                <n-icon><clock-icon /></n-icon> 上门时间：{{ item.time }}
                            </div>
                            <div class="order-contact">
                                <n-icon><phone-icon /></n-icon> {{ item.contact }}
                            </div>
                        </div>

                        <n-divider />

                        <div class="order-footer">
                            <div class="time-left">接单剩余时间：{{ item.timeLeft }}</div>
                            <n-button type="primary" size="large" @click="acceptOrder(item)">接单</n-button>
                        </div>
                    </n-card>
                </div>
            </n-card>

        </n-tab-pane>
        <n-tab-pane name="deliverOrder" tab="进行中">
            <n-card>
                <div class="order-container">

                    <div class="search-input" @click="router.push('/search')">
                        <n-icon size="16"><search-outlined /></n-icon>
                        <span>搜索订单</span>
                    </div>

                    <n-card v-for="item in ordersInProcess" :key="item.id" class="order-card">
                        <div class="order-header">
                            <n-icon size="30" corlor="#00c853">
                                <component :is="FileTextOutlined" />
                            </n-icon>
                            <div class="order-distance">距离 {{ item.distance }}km</div>
                            <div class="order-number">
                                <n-tag type="success" round>{{ item.orderNumber }}#</n-tag>
                            </div>

                        </div>

                        <n-divider />

                        <div class="order-info">
                            <div class="order-address">
                                <n-icon><location-icon /></n-icon> {{ item.address }}
                            </div>
                            <div class="order-time">
                                <n-icon><clock-icon /></n-icon> 上门时间：{{ item.time }}
                            </div>
                            <div class="order-contact">
                                <n-icon><phone-icon /></n-icon> {{ item.contact }}
                            </div>
                        </div>

                        <n-divider />

                        <div class="order-footer">
                            <div class="time-left">订单剩余时间：{{ item.timeLeft }}</div>
                            <n-button type="warning" size="large" @click="cancelOrder(item)">取消</n-button>
                        </div>
                    </n-card>
                </div>
            </n-card>
        </n-tab-pane>
        <n-tab-pane name="finishOrder" tab="已完成">
            <n-card>
                <div class="order-container">

                    <div class="search-input" @click="router.push('/search')">
                        <n-icon size="16"><search-outlined /></n-icon>
                        <span>搜索订单</span>
                    </div>

                    <n-card v-for="item in ordersFinished" :key="item.id" class="order-card">
                        <div class="order-header">
                            <n-icon size="30" corlor="#00c853">
                                <component :is="FileTextOutlined" />
                            </n-icon>
                            <div class="order-distance">距离 {{ item.distance }}km</div>
                            <div class="order-number">
                                <n-tag type="success" round>{{ item.orderNumber }}#</n-tag>
                            </div>

                        </div>

                        <n-divider />

                        <div class="order-info">
                            <div class="order-address">
                                <n-icon><location-icon /></n-icon> {{ item.address }}
                            </div>
                            <div class="order-time">
                                <n-icon><clock-icon /></n-icon> 上门时间：{{ item.time }}
                            </div>
                            <div class="order-contact">
                                <n-icon><phone-icon /></n-icon> {{ item.contact }}
                            </div>
                        </div>

                        <n-divider />
                        <div class="order-footer">
                            <n-button type="warning" size="large" @click="getOrderInfo(item)">查看详情</n-button>
                        </div>
                    </n-card>
                </div>
            </n-card>
        </n-tab-pane>
    </n-tabs>

    <n-back-top :right="20" :bottom="80" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NButton, NDivider } from 'naive-ui'
import { FileTextOutlined, SearchOutlined } from '@vicons/antd'
import { useRouter } from 'vue-router'
// import { OrderInfoForShopAndrider } from '@/types/order'

const router = useRouter()

const activeTab = ref('getOrder')
// TODO：这部分数据应该优前端购物车生成
const orders = ref([
    {
        id: 1,
        orderNumber: '13',
        distance: 0.4,
        address: '中国航空航天大学松苑2号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    }, {
        id: 1,
        orderNumber: '13',
        distance: 0.4,
        address: '中国航空航天大学松苑2号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    },
    {
        id: 2,
        orderNumber: '8',
        distance: 0.4,
        address: '中国航空航天大学松苑2号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    },
    {
        id: 3,
        orderNumber: '6',
        distance: 0.4,
        address: '中国航空航天大学松苑2号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    },
])
// TODO：这两部部分数据应该由后端查询
const ordersInProcess = ref([
    {
        id: 1,
        orderNumber: '13',
        distance: 0.4,
        address: '北京航空航天大学松苑2号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    },
    {
        id: 2,
        orderNumber: '8',
        distance: 0.4,
        address: '北京航空航天大学松苑2号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    }
])

const ordersFinished = ref([
    {
        id: 1,
        orderNumber: '13',
        distance: 0.4,
        address: '北京航空航天大学7号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    },
    {
        id: 2,
        orderNumber: '8',
        distance: 0.4,
        address: '北京航空航天大学7号楼7102',
        time: '2019-8-2 13:00',
        contact: 'TC_ZY 189****7687',
        timeLeft: '00:17:20',
    }
])

// 接单处理函数
const acceptOrder = (item: any) => {
    console.log('接受订单:', item)
    alert("not implemented")
    // getOrder(item)
}

const cancelOrder = (item: any) => {
    console.log('取消订单:', item)
    alert("not implemented")
}

const getOrderInfo = (item: any) => {
    router.push({
        path: '/orderInfo',
        query: { id: item.id }
    })
}

</script>

<style scoped>
.search-input {
    margin-bottom: 40px;
    flex: 1;
    display: flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 20px;
    background-color: #ebe7e7;
    color: #575454;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.search-input:hover {
    background-color: #eaeaea;
    color: #222;
}

/* 自定义主题色，后续使用 */
:root {
    --primary-color: #00c853;
    /* 清新绿色 */
    --text-color: #333;
    --subtle-color: #888;
    --danger-color: #e53935;
}

.order-container {
    margin-top: 20px;
}

.order-card {
    margin-bottom: 16px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(100, 10, 0, 0.2);
    /* 设置动画时长 */
    transition: transform 0.3s ease;
    border-radius: 8px;
    border-left: 6px solid var(--primary-color);
    background: #f9fefb;
}

.order-card:hover {
    /* 设置动画方向。拟物感+卡片阴影 */
    transform: translateY(-2px);
}

.order-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 18px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.order-info {
    margin-top: 12px;
    font-size: 14px;
    color: #666;
}

.order-info .order-address,
.order-info .order-time,
.order-info .order-contact {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
}

.time-left {
    color: var(--danger-color);
    font-family: 'Courier New', monospace;
    font-size: 16px;
    letter-spacing: 1px;
}

.n-button {
    margin-top: 10px;
    /* background-color: var(--primary-color); */
    border: none;
}

.order-number {
    font-size: 18px;
    background: var(--primary-color);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
}
</style>
