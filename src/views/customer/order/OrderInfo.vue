<template>
    <div class="order-info-container">
        <div class="top-bar">
            <n-button text @click="goBack">
                <n-icon size="24">
                    <arrow-back />
                </n-icon>
            </n-button>
            <h1 class="title">订单详情</h1>
        </div>

        <!-- 概要部分 -->
        <n-card class="summary-card">
            <div class="summary-wrapper">
                <!-- 左侧头像与概要 -->
                <div class="summary-left">
                    <n-avatar v-if="order.items" :src="order?.items[0].cover.origin" :size="200" />
                    <div class="info-list">
                        <div class="store-name">{{ shopInfo.name || "未知店铺" }}</div>
                        <div class="order-time">{{ order.createdAt }}</div>
                    </div>
                </div>

                <!-- 右侧详情 -->
                <div class="summary-right">
                    <div class="store-link" @click="goToShop(order.shop!)">店铺链接 →</div>
                    <div class="detail-wrapper">
                        <div class="actions">
                            <n-button strong size="small" @click="evaluate(order)">评价</n-button>
                            <n-button strong size="small" @click="buyAgain(order)">再次购买</n-button>
                            <n-button strong size="small" tertiary type="error" @click="feedback(order)">反馈</n-button>
                        </div>

                        <n-collapse class="order-info-collapse">
                            <n-collapse-item title="交易信息" name="1">
                                <p>实付：￥{{ order.total }}</p>
                                <p>配送费：￥{{ order.deliveryFee }}</p>
                                <p>合计：￥{{ order.total && order.total + order.deliveryFee }}</p>
                                <p>订单号：{{ order.id }}</p>
                                <p>支付时间：{{ order.paidAt }}</p>
                                <p>准备完成时间：{{ order.preparedAt }}</p>
                                <p>配送时间：{{ order.deliveredAt }}</p>
                                <p>送达时间：{{ order.finishedAt }}</p>
                            </n-collapse-item>
                            <n-collapse-item title="收货信息" name="2">
                                <p>收货人：{{ order.customer }}</p>
                                <p>联系电话：{{ order.customerAddress.tel }}</p>
                                <p>地址：{{ order.customerAddress.address }} {{ order.customerAddress.city }} {{
                                    order.customerAddress.district }}
                                    {{ order.customerAddress.address }}</p>
                            </n-collapse-item>

                            <n-collapse-item title="物流信息" name="3">
                                <p>配送方式：自提</p>
                                <p>配送员：{{ order.rider }}</p>
                                <p>配送时间：{{ order.deliveredAt }}</p>
                                <p>送达时间：{{ order.finishedAt }}</p>
                                <p>配送位置：{{ order.delivery }}</p>
                                <p>店铺信息：</p>
                            </n-collapse-item>
                            <n-collapse-item title="其它信息" name="4">
                                <p> 备注： {{ order.note || "无" }} </p>
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
        <n-card class="map-container" v-if="order.status === Status.Delivering">
            <DeliveryMap v-if="order.status === Status.Delivering" 
            :start-longitude="order.shopAddress.coordinate[0]" 
            :start-latitude="order.shopAddress.coordinate[1]"
            :current-longitude="order.shopAddress.coordinate[0]"
            :current-latitude="order.shopAddress.coordinate[1]"
            :end-longitude="order.customerAddress.coordinate[0]"
            :end-latitude="order.customerAddress.coordinate[1]"
            />
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
import { computed, ref, onMounted } from 'vue'
import Recommendation from './Recommendation.vue'
import { useRoute, useRouter } from 'vue-router'
import { type RecommendItem, type Order, Status } from '@/types/order'
import { useDialog, useMessage, NButton, NIcon, NBackTop, NCard } from 'naive-ui'
import { ArrowBack } from '@vicons/ionicons5'
import type { ShopInfo } from '@/types/shop'
import DeliveryMap from '@/views/DeliveryMap.vue'


const order = ref<Order>({
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
            quantity: 1,
            price: 10,
        },
        {
            id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
            name: "string",
            cover: {
                origin: "string",
                thumbnail: "string"
            },
            quantity: 2,
            price: 20,
        },
    ],
    deliveryFee: 0,
    total: 32,
    note: "string",
    delivery: {
        latitude: 0,
        longitude: 0
    },
    shopAddress: {
        id: '1',
        isDefault: true,
        coordinate: [
            0
        ],
        province: "北京",
        city: "北京",
        district: "海淀区",
        address: "学院路37号北京航空航天大学学生1公寓邮局旁外卖柜",
        name: "string",
        tel: "string"
    },
    customerAddress: {
        id: '2',
        isDefault: false,
        coordinate: [
            0
        ],
        province: "北京",
        city: "北京",
        district: "海淀区",
        address: "学院路37号北京航空航天大学学生1公寓邮局旁外卖柜",
        name: "string",
        tel: "string"
    }
})
const router = useRouter()
const route = useRoute()

const goBack = () => {
    router.go(-1)
}
const goToShop = (shopId: string) => {
    router.push(`/customer/shops/${shopId}`)
}
const getShopInfo = async (shopId: string): Promise<ShopInfo> => {
    return fetchShopInfo(shopId) as unknown as ShopInfo
}
const shopInfo = ref<ShopInfo>({} as ShopInfo)
onMounted(async () => {
    try {
        shopInfo.value = await getShopInfo(order.value.shop!)
    } catch (error) {
        shopInfo.value = {} as ShopInfo
    }
})
// const loadData = async () => {
//     try {
//         const orderId = router.params.id as unknown as number
//         order.value = await fetchOrderDetail(orderId)
//     } catch (error) {
//         console.error('Error fetching order data:', error)
//     }
// }

// onMounted(() => {
//     loadData()
// })

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


const orderId = route.params.id || '12345678'

// TODO: 功能按钮
const evaluate = (order: Order) => {
    router.push(`/comments/${order.id}`)
}

const buyAgain = (order: Order) => {
    console.log(`加入购物车：${order.note}`)
    // TODO: 调用购物车逻辑
    let dialog = useDialog()
    let message = useMessage()

    dialog.success({
        title: '加入购物车',
        content: '你确定？',
        positiveText: '确定',
        negativeText: '不确定',
        draggable: true,
        onPositiveClick: () => {
            message.success('确定')
            alert("Not implemented")
        },
        onNegativeClick: () => {
            message.error('不确定')
            alert("Not implemented")
        }
    })
}

const feedback = (order: Order) => {
    alert('Not implemented yet')
}

function fetchOrder(arg0: string): Order | PromiseLike<Order | undefined> | undefined {
    throw new Error('Function not implemented.')
}

function fetchShopInfo(shopId: string): unknown {
    throw new Error('Function not implemented.')
}
</script>

<style scoped>
.order-info-container {
    padding: 16px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  flex-shrink: 0;
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

.map-container {
    margin-top: auto;
    margin-bottom: auto;
    width: 100%;
    aspect-ratio: 16 / 9;
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
