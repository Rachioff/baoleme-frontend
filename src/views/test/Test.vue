<template>
    <div class="rider-page">
        <n-card>
            <div id="map-container">
                <img src="../../assets/logo.svg" alt="just for test">
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
                        </n-icon> 下单时间：{{ order.orderTime }}</div>
                    <div>联系方式：{{ order.contact }} {{ order.phone }}</div>
                    <div>送餐内容：{{ order.content }}</div>
                    <div>送达时间：{{ order.deliveryTime }}</div>
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
                    </n-button>
                    <n-button type="primary" strong secondary round @click="sendMessage">
                        <n-icon>
                            <MessageFilled />
                        </n-icon>
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
// import { useWebSocket } from '@/utils/websocket'

const message = useMessage()
const order = ref({
    id: 12,
    address: '中国矿业大学松苑2号楼7102',
    distance: 0.4,
    orderTime: '2019-8-2 13:00',
    contact: 'TC_ZY',
    phone: '189****2342',
    content: '鱼香肉丝、米饭',
    remark: '需要2分餐具',
    status: '未到达',
    deliveryTime: '2019-8-2 13:00',
    note: '需要2分餐具'
})
const countdown = ref('00:17:20')

// 反馈定位
// const { sendLocation } = useWebSocket('wss://example.com')

// 获取当前位置并发送
function locateAndSend() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        // sendLocation({ latitude, longitude, orderId: order.value.id })
        // drawMarker(latitude, longitude)
    })
}

// 模拟地图渲染和路径
// function drawMarker(lat, lng) {
//   const map = new BMapGL.Map('map')
//   const point = new BMapGL.Point(lng, lat)
//   map.centerAndZoom(point, 15)
//   const marker = new BMapGL.Marker(point)
//   map.addOverlay(marker)
// }

onMounted(() => {
    initAMap()
    startCountdown(1040) // 秒数
})

function initAMap() {
    message.error('地图初始化失败')
    //   const map = new AMap.Map('map-container', {
    //     resizeEnable: true,
    //     zoom: 15,
    //   })
    //   AMap.plugin('AMap.Geolocation', function () {
    //     const geolocation = new AMap.Geolocation({
    //       enableHighAccuracy: true,
    //       timeout: 10000
    //     })
    //     map.addControl(geolocation)
    //     geolocation.getCurrentPosition((status, result) => {
    //       if (status === 'complete') {
    //         const { position } = result
    //         new AMap.Marker({
    //           position,
    //           map
    //         })
    //         map.setCenter(position)
    //       } else {
    //         message.error('定位失败')
    //       }
    //     })
    //   })
}

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
