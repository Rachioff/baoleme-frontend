<template>
  <n-page>
    <div class="tab-bar mt-4">
      <div class="tab-wrapper">
        <n-tabs type="line" v-model:value="currentTab" animated class="custom-tabs">
          <n-tab-pane name="all" tab="全部" />
          <n-tab-pane name="pending" tab="待评价" />
          <n-tab-pane name="category" tab="分类" />
          <n-tab-pane name="history" tab="历史" />
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
    </div>
    <p v-if="isTimeOut" class="no-orders">加载超时，重试</p>
    <div class="pagination-wrapper mt-4">
      <!-- 分页 Pagination -->
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NTabs, NTabPane, NSpace } from 'naive-ui'
import OrderCard from '@/components/card/OrderCard.vue'
import { SearchOutlined } from '@vicons/antd'
import { Status, type OrderInfo, type OrderItem, type OrderList } from '@/types/order' // 导入数据类型
import { fetchOrders, fetchCustomerOrderList, fetchShopOrderList, fetchRiderOrderList} from '@/api/orders'
import { useTokenStore } from '@/stores/token'

const route = useRoute()
const router = useRouter()

// 加载数据
// const orders = ref<OrderItem[]>([])
const total = ref(0)
const page = ref(2)
const pageSize = 5
const status = ref<Status | null>(null)

const isTimeOut = ref(false)
const orders =  ref<OrderList[]>([])

const loadData = async () => {
  try {
    // TODO 这几个api其实完全一样
    switch (useTokenStore().role) {
      case "customer":
        orders.value = await fetchCustomerOrderList(page.value, pageSize, status.value as string)
        break;
      case "merchant":
        orders.value = await fetchShopOrderList(page.value, pageSize, status.value as string, useTokenStore().userId as string)
        break;
      case "admin":
        orders.value = await fetchOrders(page.value, pageSize, status.value as string)
      case "rider":
        orders.value = await fetchRiderOrderList(page.value, pageSize, status.value as string)
      default:
        break;
    }
    console.log("switch pass!")
  } catch (error) {
    alert("获取订单失败");
    console.error('Failed to load orders:', error)
  }
}

onMounted(() => {
  loadData();
  setTimeout(() => {
    if (orders.value.length === 0) {
      isTimeOut.value = true
    }
  }, 5000)
})
// TODO :模拟订单数据
// const orders = ref([
//   {
//     id: 1,
//     storeName: '沙县小吃',
//     status: '已完成',
//     time: '2025-05-17 11:23',
//     items: ['米线', '蛋炒饭'],
//     total: 29,
//     storeAvatar: 'https://picsum.photos/seed/1/200/200',
//     orderTime: '2025-05-17 11:23'
//   },
//   {
//     id: 2,
//     storeName: '麦当劳',
//     status: '待评价',
//     time: '2025-05-18 14:45',
//     items: ['汉堡', '可乐'],
//     total: 36,
//     storeAvatar: 'https://picsum.photos/seed/2/200/200',
//     orderTime: '2025-05-18 14:45'
//   },
//   {
//     id: 3,
//     storeName: '黄焖鸡米饭',
//     status: '已完成',
//     time: '2025-05-16 18:10',
//     items: ['黄焖鸡', '米饭'],
//     total: 32,
//     storeAvatar: 'https://picsum.photos/seed/3/200/200',
//     orderTime: '2025-05-16 18:10'
//   },
//   {
//     id: 4,
//     storeName: '兰州拉面',
//     status: '已完成',
//     time: '2025-05-15 20:00',
//     items: ['拉面', '卤蛋'],
//     total: 28,
//     storeAvatar: 'https://picsum.photos/seed/4/200/200',
//     orderTime: '2025-05-15 20:00'
//   },
//   {
//     id: 5,
//     storeName: '肯德基',
//     status: '待评价',
//     time: '2025-05-19 12:15',
//     items: ['炸鸡', '雪碧'],
//     total: 38,
//     storeAvatar: 'https://picsum.photos/seed/5/200/200',
//     orderTime: '2025-05-19 12:15'
//   },
//   {
//     id: 6,
//     storeName: '麦当劳',
//     status: '已完成',
//     time: '2025-05-14 09:50',
//     items: ['汉堡', '可乐'],
//     total: 34,
//     storeAvatar: 'https://picsum.photos/seed/6/200/200',
//     orderTime: '2025-05-14 09:50'
//   },
//   {
//     id: 7,
//     storeName: '沙县小吃',
//     status: '待评价',
//     time: '2025-05-13 13:33',
//     items: ['米线', '蛋炒饭'],
//     total: 26,
//     storeAvatar: 'https://picsum.photos/seed/7/200/200',
//     orderTime: '2025-05-13 13:33'
//   },
//   {
//     id: 8,
//     storeName: '兰州拉面',
//     status: '已完成',
//     time: '2025-05-12 10:25',
//     items: ['拉面', '卤蛋'],
//     total: 30,
//     storeAvatar: 'https://picsum.photos/seed/8/200/200',
//     orderTime: '2025-05-12 10:25'
//   },
//   {
//     id: 9,
//     storeName: '肯德基',
//     status: '已完成',
//     time: '2025-05-11 15:40',
//     items: ['炸鸡', '雪碧'],
//     total: 35,
//     storeAvatar: 'https://picsum.photos/seed/9/200/200',
//     orderTime: '2025-05-11 15:40'
//   },
//   {
//     id: 10,
//     storeName: '黄焖鸡米饭',
//     status: '待评价',
//     time: '2025-05-10 17:55',
//     items: ['黄焖鸡', '米饭'],
//     total: 31,
//     storeAvatar: 'https://picsum.photos/seed/10/200/200',
//     orderTime: '2025-05-10 17:55'
//   }
// ])


const currentTab = ref('all')

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') return orders.value
  if (currentTab.value === 'pending') {
    return orders.value.filter(order => order.status === Status.Prepared)
  }
  if (currentTab.value === 'history') {
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
</style>
