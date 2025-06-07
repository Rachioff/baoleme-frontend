// src/types/cart.ts

import type { ProductData } from './product'; // 假设商品详情复用 ProductData

/**
 * 购物车摘要信息 (对应 GET /cart/{id})
 */
export interface CartInfo {
  /**
   * 是否可结算
   */
  settlable: boolean;
  /**
   * 实际总金额，分
   */
  total: number;
  /**
   * 无优惠总金额（划线价），分
   */
  totalWithoutPromotion: number;
}

/**
 * 购物车中的单项商品 (对应 GET /cart/{id}/items 的数组项)
 */
export interface CartItem {
  /**
   * 商品完整信息
   */
  item: ProductData;
  /**
   * 商品数量
   */
  quantity: number;
}

/**
 * 修改购物车商品数量的响应体
 */
export interface UpdateCartQuantityResponse {
    cart: CartInfo;
    quantity: number;
}