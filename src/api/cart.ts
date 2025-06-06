import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
import type { CartItem, CartInfo } from '@/types/cart'

export const getCart = async (shopId: string) => {
    const res = await axios.get(`${apiRoot}/cart/${shopId}`, {
        headers: { 
            Authorization: `Bearer ${useTokenStore().token}`
        }
    })
    return res.data as CartInfo 
}

export const getCartItems = async (shopId: string) => {
    const res = await axios.get(`${apiRoot}/cart/${shopId}/items`, {
        headers: { 
            Authorization: `Bearer ${useTokenStore().token}`
        }
    })
    return res.data as CartItem[]
}