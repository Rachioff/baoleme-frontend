// src/api/category.ts

import { apiRoot } from '@/config/api';
import { useTokenStore } from '@/stores/token';
import axios from 'axios';
import type { ItemCategory } from '@/types/category';

/**
 * 获取指定店铺的所有商品分类列表
 * @param shopId 店铺ID
 * @returns 商品分类列表
 */
export const getShopItemCategories = async (shopId: string): Promise<ItemCategory[]> => {
    const token = useTokenStore().token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get<ItemCategory[]>(`<span class="math-inline">\{apiRoot\}/shops/</span>{shopId}/item-categories`, {
        headers
    });

    return response.data;
};