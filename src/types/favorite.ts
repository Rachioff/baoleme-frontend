import type { ShopInfo } from './shop'
import type { Product } from './product'

/**
 * 店铺收藏项
 */
export interface ShopFavoriteRecord {
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
 * 商品收藏项
 */
export interface ItemFavoriteRecord {
  /**
   * 记录时间 
   */
  createdAt: Date
  /**
   * 商品信息 
   */
  item: Product
}