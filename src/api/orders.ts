import axios from 'axios'
import { ref, onMounted } from 'vue'
import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import type { createOrderreturn,OrderStatus} from '@/types/order'
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

export const createOrder = async (shopId: string,addressId: string,note?: string) => {
    const res = await axios.post(`${apiRoot}/orders`, {
        headers: { 
            Authorization: `Bearer ${useTokenStore().token}`
        }
    })
    return res.data as createOrderreturn
}

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const res = await axios.patch(`${apiRoot}/orders/${orderId}/status`, 
    { status },
    {
      headers: { 
        Authorization: `Bearer ${useTokenStore().token}`
      }
    }
  );
  return res.data as createOrderreturn;
};
