import axios from 'axios'
import { useTokenStore } from '@/stores/token'
import { apiRoot } from '@/config/api'
import { type ItemInfo, type OrderInfoForShopAndrider } from '@/types/order'

export async function fetchOrders(page: number, pageSize: number) {
  return await axios.get(`${apiRoot}/orders`, {
    params: {
      page: page.valueOf,
      pageSize
    },
    headers: {Authorization: `Bearer ${useTokenStore().token}`}
  })
}

// 线程同步
export async function fetchOrderDetail(page:number, pageSize: number, orderId: number) {
  return await axios.get(`${apiRoot}/orders/${orderId}`, {
    params: {
      page: page,
      pageSize
    },
    headers: {Authorization: `Bearer ${useTokenStore().token}`}
  })
}

export async function submitOrder(itemList:Array<ItemInfo>) {
  return await axios.post(`${apiRoot}/orders`,  {
    data: { 
      itemList
    },
    headers: {Authorization: `Bearer ${useTokenStore().token}`}
  })
}

export async function deleteOrder(orderId: number) {
  return await axios.delete(`${apiRoot}/orders/${orderId}`, {
    headers: {Authorization: `Bearer ${useTokenStore().token}`}
  })
}

export async function updateOrderStatus(orderId: number, status: number) {
  return await axios.put(`${apiRoot}/orders/${orderId}`, {
    status
  }, {
    headers: {Authorization: `Bearer ${useTokenStore().token}`}
  })
}

// 接单
export async function getOrder(params:OrderInfoForShopAndrider) {
  return await axios.post(`${apiRoot}/orders/get/${params.id}`,
    {
      headers: {Authorization: `Bearer ${useTokenStore().token}`}
    }
  )
}