// src/api/recommend.ts
import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import type {ShopInfo} from '@/types/shop'
import type { ProductData, Product } from '@/types/product'
import type { Recommend } from '@/types/recommend'
import type { Order } from '@/types/order'
import axios from 'axios'

const getToken = () => useTokenStore().token

/**
 * 获取推荐店铺列表
 * @param params 查询参数
 * @returns 推荐店铺列表
 */
export const getRecommendedShops = async (
    params: {
        p?: number,  
        pn?: number,    
        q?: string,     
        c?: string[],  
        d?: number,  
        r?: number, 
        t?: number,   
        s?: 'c' | 't' | 'r', 
        rc?: number,   
        a?: string    
    } = {}
): Promise<ShopInfo[]> => {
    const res = await axios.get<ShopInfo[]>(`${apiRoot}/recommended/shops`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: {
            ...params,
            c: params.c?.join(',') // 将数组转换为逗号分隔字符串
        }
    })
    return res.data
}

/**
 * 获取推荐商品列表
 * @param params 查询参数
 * @returns 推荐商品列表
 */
export const getRecommendedProducts = async (
    params: {
        p?: number,   
        pn?: number,   
        q?: string,    
        c?: string[],  
        r?: number,   
        s?: 'c' | 't' | 'r' | 's',
        a?: string, 
        min_p?: number, 
        max_p?: number 
    } = {}
): Promise<Product[]> => {
    const res = await axios.get<Product[]>(`${apiRoot}/recommended/items`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: {
            ...params,
            c: params.c?.join(',')
        }
    })
    return res.data
}

/**
 * 获取推荐订单列表（骑手）
 * @param params 查询参数
 * @returns 推荐订单列表
 */
export const getRecommendedOrders = async (
    params: {
        p?: number, 
        pn?: number, 
        d?: number, 
        t?: number, 
        lat?: number,
        lon?: number,
        m?: number
    } = {}
): Promise<Order[]> => {
    const res = await axios.get<Order[]>(`${apiRoot}/recommended/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
    })
    return res.data
}