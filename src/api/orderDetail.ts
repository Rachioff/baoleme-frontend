import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const order = ref()
const products = ref([])
const totalProducts = ref(0)
const page = ref(1)
const pageSize = 5
const orderId = useRoute().params.id as string // 提取路由参数

const pageCount = computed(() => Math.ceil(totalProducts.value / pageSize))

// 线程同步
export async function fetchOrderDetail() {
  const res = await axios.get(`/api/orders/${orderId}`, {
    params: {
      page: page.value,
      pageSize
    }
  })
//   获取data段中的数据
  order.value = res.data.order
  products.value = res.data.products
  totalProducts.value = res.data.totalProducts
}

function handlePageChange(newPage: number) {
  page.value = newPage
  fetchOrderDetail()
}

onMounted(() => {
  fetchOrderDetail()
})
