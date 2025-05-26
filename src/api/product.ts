import axios from 'axios'
import { apiRoot } from '@/config/api'
import type { Product, RecommendedProductsParams } from '@/types/product'

export const getRecommendedProducts = async (params: RecommendedProductsParams = {}) => {
  const res = await axios.get(`${apiRoot}/recommended/items`, { params })
  return res.data as Product[]
}