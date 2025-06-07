import type { imgURL } from "./img";

export interface ProductProfileData {
  /**
   * 商品是否上架
   */
  available: boolean;
  /**
   * 商品类别 ID
   */
  categories: string[];
  /**
   * 商品描述
   */
  description: string;
  /**
   * 商品名称
   */
  name: string;
  /**
   * 商品实际价格，分
   */
  price: number;
  /**
   * 商品无优惠价格（划线价），分
   */
  priceWithoutPromotion: number;
  /**
   * 商品是否缺货
   */
  stockout: boolean;
  [property: string]: any;
}

/**
 * 商品完整信息 (API 返回的商品结构)
 * 此接口整合了用户提供的商品基本信息、商品资料、商品图像和商品统计数据
 */
export interface ProductData extends ProductProfileData {
  /**
   * 商品创建时间
   */
  createdAt: Date;
  /**
   * 商品 ID
   */
  id: string;
  /**
   * 商品所属店铺 ID
   */
  shopId: string;
  /**
   * 商品封面图
   */
  cover: imgURL;
  /**
   * 评分，0~50 (API 定义)
   */
  rating: number;
  /**
   * 月销量
   */
  sale: number;
  [property: string]: any;
}

/**
 * 商品图像信息 (用于修改商品封面API的返回)
 */
export interface ProductImageData {
  /**
   * 商品封面图
   */
  cover: imgURL;
  [property: string]: any;
}

// --- API相关的参数和响应类型 ---

// GET /shops/{shopId}/item-categories/{categoryId}/items
export interface GetShopProductsByCategoryPathParams {
  categoryId: string;
  shopId: string;
}
export interface GetShopProductsByCategoryQueryParams {
  p?: number; // 页码
  pn?: number; // 每页数量
}
export type GetShopProductsByCategoryResponse = ProductData[];

// GET /items/{id} (API路径仍为items, 但我们逻辑上称之为product)
export interface GetProductDetailPathParams {
  /**
   * 商品ID
   */
  id: string;
}
export type GetProductDetailResponse = ProductData;

// GET /shops/{shopId}/items
export interface GetShopAllProductsPathParams {
  shopId: string;
}
// QueryParams可复用 GetShopProductsByCategoryQueryParams
export type GetShopAllProductsResponse = ProductData[];

// POST /shops/{shopId}/items
export interface CreateProductPathParams {
  shopId: string;
}
export type CreateProductBody = ProductProfileData;
export type CreateProductResponse = ProductData;

// PATCH /items/{id}/profile
export interface UpdateProductProfilePathParams {
  id: string; // API文档中商品ID为string，Path参数示例中为number，这里统一为string
}
export type UpdateProductProfileBody = Partial<ProductProfileData>;
export type UpdateProductProfileResponse = ProductProfileData;

// PATCH /items/{id}/cover
export interface UpdateProductCoverPathParams {
  id: string;
}
// Body是文件，将在API封装中处理
export type UpdateProductCoverResponse = ProductImageData;

// DELETE /items/{id}
export interface DeleteProductPathParams {
  id: string;
}
export type DeleteProductResponse = void;

export interface Product {
  image: string
  id: string
  shopId: string
  createdAt: string
  name: string
  description: string
  available: boolean
  stockout: boolean
  priceWithoutPromotion: number
  categories: string[]
  cover: {
    origin: string
    thumbnail: string
  }
  rating: number
  price: number
  discount?: string
  sale: number
}

export interface RecommendedProductsParams {
  p?: number 
  pn?: number
  q?: string 
  c?: string[] 
  r?: number 
  s?: string 
  a?: string 
  min_p?: number 
  max_p?: number 
}