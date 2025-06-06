// src/api/cart.ts

import { apiRoot } from '@/config/api';
import { useTokenStore } from '@/stores/token';
import axios from 'axios';
import type { CartInfo, CartItem, UpdateCartQuantityResponse } from '@/types/cart';

const getToken = () => useTokenStore().token;

/**
 * 获取购物车信息
 * @param shopId 店铺ID
 */
export const getCartInfo = async (shopId: string): Promise<CartInfo> => {
    const res = await axios.get<CartInfo>(`${apiRoot}/cart/${shopId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
};

/**
 * 获取购物车商品列表
 * @param shopId 店铺ID
 */
export const getCartItems = async (shopId: string): Promise<CartItem[]> => {
    const res = await axios.get<CartItem[]>(`${apiRoot}/cart/${shopId}/items`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
};

/**
 * 修改购物车中商品的数量
 * @param shopId 店铺ID
 * @param itemId 商品ID
 * @param quantity 商品的目标总量
 */
export const updateCartItemQuantity = async (shopId: string, itemId: string, quantity: number): Promise<UpdateCartQuantityResponse> => {
    const res = await axios.patch<UpdateCartQuantityResponse>(
        `${apiRoot}/cart/${shopId}/item/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
};

/**
 * 清空指定店铺的购物车
 * @param shopId 店铺ID
 */
export const clearCart = async (shopId: string): Promise<void> => {
    await axios.delete(`${apiRoot}/cart/${shopId}/items`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};