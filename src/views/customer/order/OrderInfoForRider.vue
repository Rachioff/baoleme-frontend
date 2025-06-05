<template>
    <div class="rider-page">
        <n-card class="map-container">
            <div id="map-container">
                <!-- <AmapMap /> -->
            </div>
        </n-card>

        <n-card>
            <n-card class="order-info">
                <div class="status-bar">
                    <span>未到达</span>
                    <span class="order-id">12#</span>
                </div>
                <div class="detail">
                    <div><n-icon>
                            <Location />
                        </n-icon> {{ order.address }} <span class="distance">距离{{ order.distance }}km</span></div>
                    <div><n-icon>
                            <ClockCircle />
                        </n-icon> 下单时间：{{ order.createdAt }}</div>
                    <div>联系方式：{{ order.customer }}</div>
                    <div>送餐内容：{{order.items?.map(item => item.name).join('、')}}</div>
                    <div>预计送达时间：{{ order.deliveredAt }}</div>
                    <div>备注：{{ order.note }}</div>
                    <div class="timeout">已超时：<span class="overtime">{{ countdown }}</span></div>
                </div>
            </n-card>

            <n-card class="bottom-bar">
                <div class="button-group">
                    <n-button type="primary" strong secondary round @click="callPhone">
                        <n-icon>
                            <ShopFilled />
                        </n-icon>
                        店铺
                    </n-button>
                    <n-button type="primary" strong secondary round @click="sendMessage">
                        <n-icon>
                            <MessageFilled />
                        </n-icon>
                        消息
                    </n-button>
                    <n-button type="primary" round @click="confirmArrival" style="margin-right: 20px;">
                        已到达
                    </n-button>
                </div>

            </n-card>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { ShopFilled, MessageFilled } from '@vicons/antd'
// import AmapMap from './AmapMap.vue'
import { fetchOrderDetail } from '@/api/orders'
import { useRoute } from 'vue-router'
import { Status, type OrderInfo } from '@/types/order'
import { forEachChild } from 'typescript'
// import { useWebSocket } from '@/utils/websocket'

const message = useMessage()
const order = ref<OrderInfo>({
    id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    status: Status.Delivering,
    createdAt: new Date("2019-08-24T14:15:22.123Z"),
    paidAt: new Date("2019-08-24T14:15:22.123Z"),
    preparedAt: new Date("2019-08-24T14:15:22.123Z"),
    deliveredAt: new Date("2019-08-24T14:15:22.123Z"),
    finishedAt: new Date("2019-08-24T14:15:22.123Z"),
    canceledAt: new Date("2019-08-24T14:15:22.123Z"),
    customer: "0ac6320b-fa4d-4235-8d23-413a2b863bad",
    shop: "06d34de1-b0bd-4e60-bd25-222980128ed1",
    rider: "a197bfad-7b25-473e-bd10-519eeb8049dd",
    items: [
        {
            id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
            name: "string",
            cover: {
                origin: "string",
                thumbnail: "string"
            },
            quantity: 0,
            price: 0,
        },
        {
            id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
            name: "cai jiu duo lian",
            cover: {
                origin: "string",
                thumbnail: "string"
            },
            quantity: 0,
            price: 0,
        }
    ],
    deliveryFee: 0,
    total: 32,
    note: "string",
    delivery: {
        latitude: 0,
        longitude: 0
    },
    shopAddress: {
        coordinate: [
            0
        ],
        province: "北京",
        city: "北京",
        district: "海淀区",
        town: "花园路街道",
        address: "学院路37号北京航空航天大学学生1公寓邮局旁外卖柜",
        name: "string",
        tel: "string"
    },
    customerAddress: {
        coordinate: [
            0
        ],
        province: "北京",
        city: "北京",
        district: "海淀区",
        town: "花园路街道",
        address: "学院路37号北京航空航天大学学生1公寓邮局旁外卖柜",
        name: "string",
        tel: "string"
    }
})
const countdown = ref('00:17:20')

const router = useRoute()
const loadData = async () => {
    try {
        order.value = await fetchOrderDetail(router.params.id as string)
    } catch (error) {
        alert('加载失败')

    }
}

// 获取当前位置并发送
function locateAndSend() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        console.log("定位:")
        console.log(latitude, longitude)
    })
}

onMounted(() => {
    startCountdown(1040)
})

function startCountdown(seconds: number) {
    const timer = setInterval(() => {
        if (seconds <= 0) {
            clearInterval(timer)
            countdown.value = '超时'
        } else {
            const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
            const s = String(seconds % 60).padStart(2, '0')
            countdown.value = `${h}:${m}:${s}`
            seconds--
        }
    }, 1000)
}

function arrive() {
    message.success('送达确认已发送！')
    // 发送状态更新到后端
}

function callPhone() {
    window.open('tel:18912345678')
}
function sendMessage() {
    // 可集成即时通讯
    alert('跳转到聊天页面')
}
function confirmArrival() {
    alert('订单已送达')
}
</script>

<style scoped>
.rider-page {
    position: relative;
    /* height: 125vh; */
    overflow: hidden;
}

#map-container {
    height: 50%;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(100, 10, 0, 0.2);
    transition: transform 0.3s ease;
    border-radius: 8px;
    border-left: 6px solid var(--primary-color);
    background: #f9fefb;
}

.order-info {
    margin-bottom: 125px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(100, 10, 0, 0.2);
    transition: transform 0.3s ease;
    border-radius: 8px;
    border-left: 6px solid var(--primary-color);
    background: #f9fefb;
}

.status-bar {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
}

.detail {
    margin-top: 10px;
    font-size: 14px;
}

.distance {
    color: #999;
    font-size: 12px;
    margin-left: 5px;
}

.overtime {
    color: red;
    font-weight: bold;
}

.bottom-bar {
    margin-top: 10px;
    margin-bottom: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 12px;
    display: flex;
    justify-content: space-around;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.button-group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 16px;
}
</style>
