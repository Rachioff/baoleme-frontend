import axios from 'axios'
import { ref, onMounted } from 'vue'

const orders = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 5

export async function fetchOrders(page: number, pageSize: number) {
  return await axios.get('/api/orders', {
    params: {
      page: page.valueOf,
      pageSize
    }
  })
}