import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import type { OrderStats, TopProducts } from '@/types/shop'
import axios from 'axios'
import type { ShopInfo } from '@/types/shop'
export const getOrderStats = async (shopId: string, s: Date, t: Date) => {
    const res = await axios.get(`${apiRoot}/shops/${shopId}/stats`, {
        headers: { Authorization: `Bearer ${useTokenStore().token}` },
        params: { s, t }
    })
    return res.data as OrderStats
}

export const getTopProducts = async (shopId: string, s: Date, t: Date, n: number) => {
    const res = await axios.get(`${apiRoot}/shops/${shopId}/top-items`, {
        headers: { Authorization: `Bearer ${useTokenStore().token}` },
        params: { s, t, n }
    })
    return res.data as TopProducts
}

export const getShopInfo = async (shopId: string) => {
    const res = await axios.get(`${apiRoot}/shops/${shopId}`, {
        headers: { 
            Authorization: `Bearer ${useTokenStore().token}`
        }
    })
    return res.data as ShopInfo 
}