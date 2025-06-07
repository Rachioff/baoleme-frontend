<template>
  <n-page>
    <div class="tab-bar mt-4">
      <div class="tab-wrapper">
        <n-tabs type="line" v-model:value="currentTab" animated class="custom-tabs">
          <n-tab-pane name="all" tab="全部" />
          <n-tab-pane name="unpaid" tab="待支付" />
          <n-tab-pane name="preparing" tab="制作中" />
          <n-tab-pane name="prepared" tab="待取餐" />
          <n-tab-pane name="delivering" tab="配送中" />
          <n-tab-pane name="finished" tab="已完成" />
          <n-tab-pane name="cancelled" tab="已取消" />
        </n-tabs>
      </div>
      <!-- 搜索框 -->
      <div class="search-input" @click="router.push('/search')">
        <n-icon size="16"><search-outlined /></n-icon>
        <span>搜索订单</span>
      </div>
    </div>

    <div class="order-list mt-4">
      <!-- 订单卡片 -->
      <n-space vertical :size="12" class="mt-4">
        <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" />
      </n-space>
      <infinite-scroll-list :items="orders" :load-more="loadMoreOrders" :is-loading="isLoading" :has-more="hasMore"
        item-key="id" class="order-scroll-list">
      </infinite-scroll-list>
      <n-skeleton height="40px"  :sharp="false" />

    </div>
    <p v-if="isTimeOut" class="no-orders" style="justify-self: center;">加载超时，重试</p>
    <div class="pagination-wrapper mt-4">
      <n-pagination v-model:page="page" :page-count="pageCount" :page-size="pageSize" @update:page="handlePageChange" />
    </div>
  </n-page>
  <!-- 回到顶部Back Top -->
  <n-back-top :right="40" :bottom="160">
    <div style="
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
      ">
      回到顶部
    </div>
  </n-back-top>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NTabs, NTabPane, NSpace, useMessage, NBackTop } from 'naive-ui'
import OrderCard from '@/components/card/OrderCard.vue'
import { SearchOutlined } from '@vicons/antd'
import { Status, type Order } from '@/types/order' // 导入数据类型
import { fetchCustomerOrderList, fetchShopOrderList, fetchRiderOrderList } from '@/api/orders'
import { useTokenStore } from '@/stores/token'
import InfiniteScrollList from '@/components/common/InfiniteScrollList.vue'

const route = useRoute()
const router = useRouter()

// 加载数据
const isLoading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const itemsPerPage = 5

const total = ref(0)
const page = ref(2)
const pageSize = 5
const status = ref<Status | null>(null)

const message = useMessage()

const isTimeOut = ref(false)
// const orders =  ref<OrderList[]>([])

// const loadData = async () => {
//   try {
//     // TODO 这几个api其实完全一样
//     switch (useTokenStore().role) {
//       case "customer":
//         orders.value = await fetchCustomerOrderList(page.value, pageSize, status.value as string)
//         break;
//       case "merchant":
//         orders.value = await fetchShopOrderList(page.value, pageSize, status.value as string, useTokenStore().userId as string)
//         break;
//       // case "admin":
//       //   orders.value = await fetchOrders(page.value, pageSize, status.value as string)
//       case "rider":
//         orders.value = await fetchRiderOrderList(page.value, pageSize, status.value as string)
//       default:
//         break;
//     }
//     console.log("switch pass!")
//   } catch (error) {
//     alert("获取订单失败");
//     console.error('Failed to load orders:', error)
//   }
// }

// onMounted(() => {
//   loadData();
//   setTimeout(() => {
//     if (orders.value.length === 0) {
//       isTimeOut.value = true
//     }
//   }, 5000)
// })
// TODO :模拟订单数据

const orders = ref<Order[]>([])

// 模拟 API 请求获取店铺数据，后续可删
const fetchMockOrders = (page: number, limit: number): Promise<Order[]> => {
  return new Promise((resolve) => {
    console.log(`模拟请求第 ${page} 页店铺数据，每页 ${limit} 条`)
    setTimeout(() => {
      const newOrders: Order[] = []
      const totalMockItems = 12
      const startIndex = (page - 1) * limit

      if (startIndex >= totalMockItems) {
        resolve([])
        return
      }

      for (let i = 0; i < limit; i++) {
        const currentIndex = startIndex + i
        if (currentIndex >= totalMockItems) break
        let nowStatus =  currentIndex % 2 === 0 ? Status.Finished : Status.Delivering

        const orderId = `order-${currentIndex + 1}`
        newOrders.push({
          id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
          status: nowStatus,
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
              name: "string0",
              cover: {
                origin: "string",
                thumbnail: "string"
              },
              quantity: 0,
              price: 0,
            },
            {
              id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
              name: "string1",
              cover: {
                origin: "string",
                thumbnail: "string"
              },
              quantity: 0,
              price: 0,
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
      }
      resolve(newOrders)
    }, 800)
  })
}

const loadMoreOrders = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  try {
    const newItems = await fetchMockOrders(currentPage.value, itemsPerPage)
    if (newItems.length > 0) {
      orders.value.push(...newItems)
      currentPage.value++
      console.log(orders)
      console.log(currentPage.value)
      console.log("zheshi1 shuju")
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载店铺失败:', error)
    message.error('加载店铺列表失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
const currentTab = ref('all')

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') {
    console.log("filtered")
    return orders.value
  }
  if (currentTab.value === 'unpaid') {
    return orders.value.filter(order => order.status === Status.Unpaid)
  }
  if (currentTab.value === 'preparing') {
    return orders.value.filter(order => order.status === Status.Preparing)
  }
  if (currentTab.value === 'prepared') {
    return orders.value.filter(order => order.status === Status.Prepared)
  }
  if (currentTab.value === 'delivering') {
    return orders.value.filter(order => order.status === Status.Delivering)
  }
  if (currentTab.value === 'history') {
    return orders.value.filter(order => order.status === Status.Finished)
  }
  if (currentTab.value === 'canceled') {
    return orders.value.filter(order => order.status === Status.Canceled)
  }
  if (currentTab.value === 'category') {
    // TODO: 分类页暂做占位处理
    alert('分类页暂做占位处理')
    return []
  }
  return orders.value
})

// TODO: 分页功能
// 数据 pageOrders
// 当前页数 page
// const pageSize = 5

const pageCount = computed(() => {
  Math.ceil(orders.value.length / pageSize)
})

const currentPageOrders = computed(() => {
  const start = (page.value - 1) * pageSize
  return orders.value.slice(start, start + pageSize)
})

function handlePageChange(newPage: number) {
  page.value = newPage
}


</script>

<style scoped>
/* 顶部页面导航样式 */
.tab-bar {
  position: sticky;
  display: flex;
  margin: 20px 10px;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tab-bar-wrapper {
  align-items: center;
  flex-wrap: wrap;
  width: fit-content;
}

/* 定制 Tab 内部样式 */
.custom-tabs .n-tabs-tab {
  flex: 1;
  min-width: 200px;
  margin-right: 12px;
  padding: 10px 20px;
  font-size: 24px;
}


.search-input {
  margin-left: 60px;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 20px;
  background-color: #f5f5f5;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-input:hover {
  background-color: #eaeaea;
  color: #222;
}

/* 选中的 Tab 高亮文字 */
.custom-tabs .n-tabs-tab--active {
  font-weight: 600;
  color: #2563eb;
  /* 蓝色强调 */
}

/* 指示器大小加粗一点 */
.custom-tabs .n-tabs-bar {
  height: 3px;
}

.mt-4 {
  margin-top: 1rem;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin: 24px 0 40px 0;
  padding-bottom: 64px;
  min-height: 10vh;
  box-sizing: border-box;
}

.order-scroll-list {
  /* 如果希望滚动列表有固定高度 */
  /* height: calc(100vh - 180px); */
  /* 减去 PageHeader 和其他可能的间距 */
  /* overflow-y: auto; */
}
</style>
