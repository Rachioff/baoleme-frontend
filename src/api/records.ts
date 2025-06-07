import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
import type { ShopHistoryRecord, ItemHistoryRecord } from '@/types/record'

const getToken = () => useTokenStore().token

/**
 * 获取店铺历史记录列表 
 * @param p 分页编号
 * @param pn 每页数量
 */
export const getShopHistory = async (p: number, pn: number): Promise<ShopHistoryRecord[]> => {
  const res = await axios.get(`${apiRoot}/records/shops`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { p, pn }
  })
  return res.data
}

/**
 * 删除单条店铺历史记录
 * @param shopId 店铺ID 
 */
export const deleteShopHistory = async (shopId: string): Promise<void> => {
  await axios.delete(`${apiRoot}/records/shops/${shopId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}

/**
 * 获取商品历史记录列表 
 * @param p 分页编号
 * @param pn 每页数量
 */
export const getItemHistory = async (p: number, pn: number): Promise<ItemHistoryRecord[]> => {
  const res = await axios.get(`${apiRoot}/records/items`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { p, pn }
  })
  return res.data
}

/**
 * 删除单条商品历史记录
 * @param itemId 商品ID 
 */
export const deleteItemHistory = async (itemId: string): Promise<void> => {
  await axios.delete(`${apiRoot}/records/items/${itemId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}