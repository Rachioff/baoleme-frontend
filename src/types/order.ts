import type { Address } from './address'
// 数据模型管理

export interface OrderItem {
  id: number
  storeName: string
  status: string
  time: string
  items: string[]
  total: number
  storeAvatar: string
  orderTime: string
}

export interface OrderDetail extends OrderItem {
  payTime?: string
  deliveryTime?: string
  receiveTime?: string
  address?: string
  phone?: string
  remark?: string
  discount: number
}

export interface RecommendItem {
  id: number
  image: string
  name: string
  category: string
  rating: number
  price: number
  discount: string
}

export interface createOrderreturn {
    id: string;
    status: OrderStatus;
    createdAt: Date;
    paidAt?: Date;
    preparedAt?: Date;
    deliveredAt?: Date;
    finishedAt?: Date;
    canceledAt?: Date;
    customer: string;
    shop: string;
    rider?: string;
    items: OrderItem[];
    deliveryFee: number;
    total: number;
    note?: string;
    delivery: {
        latitude: number;
        longitude: number;
    };
    shopAddress: Address;
    customerAddress: Address;
}

export enum OrderStatus {
    Unpaid = "unpaid",
    Preparing = "preparing",
    Prepared = "prepared",
    Delivering = "delivering",
    Finished = "finished",
    Canceled = "canceled"
}