import axios from 'axios'
import { apiRoot } from '@/config/api'
import type { Shop, RecommendedShopsParams } from '@/types/shop'
export const getRecommendedShops = async (params: RecommendedShopsParams = {}) => {
  const res = await axios.get(`${apiRoot}/recommended/shops`, { params })
  return res.data as Shop[]
}