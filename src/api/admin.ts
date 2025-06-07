// src/api/admin.ts

import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import type { ProductData } from '@/types/product' 
import axios from 'axios'

// =================================================================
// 1. 类型定义 (根据您提供的API文档)
// =================================================================

export type ImageLink = {
  origin: string
  thumbnail: string
}

export type ShopAddress = {
  address: string
  city: string
  coordinate: number[]
  district: string
  name: string
  province: string
  tel: string
}

export interface GetShopsRequest {
  max_ca?: string
  min_ca?: string
  p?: number
  pn?: number
  q?: string
}

export interface ShopForAdmin {
  address: ShopAddress
  averagePrice: number
  categories: string[]
  cover: ImageLink
  createdAt: Date
  deliveryPrice: number
  deliveryThreshold: number
  description: string
  detailImage: ImageLink
  id: string
  license: ImageLink
  maximumDistance: number
  name: string
  opened: boolean
  openTimeEnd: number
  openTimeStart: number
  owner: string
  rating: number
  sale: number
  verified: boolean
}

export type UpdateItemProfileData = Partial<{
  available: boolean
  categories: string[]
  description: string
  name: string
  price: number
  priceWithoutPromotion: number
  stockout: boolean
}>

export interface UpdateItemProfileResponse {
  available: boolean;
  categories: string[];
  description: string;
  name: string;
  price: number;
  priceWithoutPromotion: number;
  stockout: boolean;
}

/**
 * PATCH /shops/{id}/profile 的请求体类型 【新增】
 */
export type UpdateShopProfileData = Partial<{
  address?: Partial<ShopAddress>;
  categories?: string[];
  deliveryPrice?: number;
  deliveryThreshold?: number;
  description?: string;
  maximumDistance?: number;
  name?: string;
  opened?: boolean;
  openTimeEnd?: number;
  openTimeStart?: number;
  verified?: boolean;
}>;

/**
 * GET /shop/{id}/comments 的响应体中单个评价的类型 【新增】
 */
export interface Comment {
    content: string;
    createdAt: Date;
    id: string;
    order: string;
    rating: number;
    user: {
    avatar: ImageLink;
    id: string;
    name: string;
    };
}

/**
 * PATCH /comments/{id} 的请求体类型 【新增】
 */
export type UpdateCommentData = {
    content?: string;
    rating?: number;
}

/**
 * 订单状态枚举 【新增】
 */
export enum OrderStatus {
    Canceled = "canceled",
    Delivering = "delivering",
    Finished = "finished",
    Prepared = "prepared",
    Preparing = "preparing",
    Unpaid = "unpaid",
}

/**
 * GET /orders 的响应体中单个订单的类型 【新增】
 */
export interface AdminOrder {
    canceledAt: Date | null;
    createdAt: Date;
    customer: string | null;
    customerAddress: ShopAddress;
    deliveredAt: Date | null;
    delivery: { latitude: number; longitude: number } | null;
    deliveryFee: number;
    finishedAt: Date | null;
    id: string;
    items: {
        cover: ImageLink;
        id: string | null;
        name: string;
        price: number;
        quantity: number;
    }[];
    note: string;
    paidAt: Date | null;
    preparedAt: Date | null;
    rider: string | null;
    shop: string | null;
    shopAddress: ShopAddress;
    status: OrderStatus;
    total: number;
}

/**
 * GET /orders 的查询参数类型 【新增】
 */
export interface GetOrdersRequest {
    p?: number;
    pn?: number;
    s?: OrderStatus;
}


// =================================================================
// 2. API 请求函数
// =================================================================

const getToken = () => useTokenStore().token;

export const getShopsForAdmin = async (params?: GetShopsRequest) => {
  const res = await axios.get<ShopForAdmin[]>(`${apiRoot}/shops`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: params
  })
  return res.data
}

export const getShopItemsForAdmin = async (shopId: string, params?: { p?: number; pn?: number }) => {
  const res = await axios.get<ProductData[]>(`${apiRoot}/shops/${shopId}/items`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: params
  })
  return res.data
}

export const getItemDetailForAdmin = async (itemId: string) => {
  const res = await axios.get<ProductData>(`${apiRoot}/items/${itemId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

export const updateItemProfile = async (itemId: string, data: UpdateItemProfileData) => {
  const res = await axios.patch<UpdateItemProfileResponse>(`${apiRoot}/items/${itemId}/profile`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return res.data
}

/**
 * (管理员) 修改店铺资料 【新增】
 * @param shopId 店铺ID
 * @param data 要更新的店铺资料
 */
export const updateShopProfile = async (shopId: string, data: UpdateShopProfileData) => {
    const res = await axios.patch(`${apiRoot}/shops/${shopId}/profile`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
}

/**
 * (管理员) 获取店铺评价列表
 * @param shopId 店铺ID
 * @param params 分页参数
 */
export const getShopComments = async (shopId: string, params: { p: number; pn: number }) => {
    const res = await axios.get<Comment[]>(`${apiRoot}/shop/${shopId}/comments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
    });
    return res.data;
}

/**
 * (管理员) 删除评价
 * @param commentId 评价ID
 */
export const deleteComment = async (commentId: string) => {
    await axios.delete(`${apiRoot}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
}

/**
 * (管理员) 修改评价    
 * @param commentId 评价ID
 * @param data 要更新的评价内容
 */
export const updateComment = async (commentId: string, data: UpdateCommentData) => {
    const res = await axios.patch<Comment>(`${apiRoot}/comments/${commentId}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
}

/**
 * (管理员) 获取全部订单列表 【新增】
 * @param params 查询参数
 */
export const getOrdersForAdmin = async (params?: GetOrdersRequest) => {
    const res = await axios.get<AdminOrder[]>(`${apiRoot}/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
    });
    return res.data;
}

/**
 * (管理员) 获取单个订单详情 【新增】
 * @param orderId 订单ID
 */
export const getOrderDetailForAdmin = async (orderId: string) => {
    const res = await axios.get<AdminOrder>(`${apiRoot}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
}

/**
 * (管理员) 修改订单状态 【新增】
 * @param orderId 订单ID
 * @param status 新的状态
 */
export const updateOrderStatusForAdmin = async (orderId: string, status: OrderStatus) => {
    const res = await axios.patch<AdminOrder>(`${apiRoot}/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
}

/**
 * (管理员) 删除已取消的订单 【新增】
 * @param orderId 订单ID
 */
export const deleteCanceledOrderForAdmin = async (orderId: string) => {
    await axios.delete(`${apiRoot}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
}