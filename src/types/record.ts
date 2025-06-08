import type { ShopInfo } from './shop'
import type { Product } from './product'

/**
 * 店铺历史记录项
 */
export interface ShopHistoryRecord {
  /**
   * 记录时间 
   */
  createdAt: Date
  /**
   * 店铺信息 
   */
  shop: ShopInfo
}

/**
 * 商品历史记录项
 */
export interface ItemHistoryRecord {
  /**
   * 记录时间 
   */
  createdAt: Date
  /**
   * 商品信息 
   */
  item: Product
}