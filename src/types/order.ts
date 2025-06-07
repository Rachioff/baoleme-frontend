import type { Address } from './address'
/**
 * 订单
 */
export interface Order {
    canceledAt: Date | null;
    createdAt: Date;
    paidAt: Date | null;
    deliveredAt: Date | null;
    preparedAt: Date | null;
    finishedAt: Date | null;
    customer: null | string;
    customerAddress: Address;
    delivery: null | Delivery;
    deliveryFee: number;
    id: string;
    items: NonNullable<Item[]>;
    note: string;
    rider: null | string;
    shop: null | string;
    shopAddress: Address;
    status: Status;
    total: number;
}



export interface Delivery {
    latitude: number;
    longitude: number;
}

export interface Item {
    cover: ImgURL;
    id: string;
    name: string;
    price: number;
    quantity: number;
}

/**
 * 商品封面
 *
 * ImgURL
 */
export interface ImgURL {
    /**
     * 原始图像的 URL
     */
    origin: string;
    /**
     * 缩略图的 URL
     */
    thumbnail: string;
}

/**
 * 状态
 */
export enum Status {
    Canceled = "canceled",
    Delivering = "delivering",
    Finished = "finished",
    Prepared = "prepared",
    Preparing = "preparing",
    Unpaid = "unpaid",
}

















// api 接口数据模型



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
    status: Status;
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

// 、、、、、、、、、、、、、、、、、、、、、、
export interface ItemBaseInfo {
    createdAt: Date;
    id: string; // 商品 ID
    shopId: string; // 商品所属店铺 ID
    [property: string]: any;
}

export interface ItemInfo extends ItemBaseInfo {
    available: boolean;//商品是否上架
    categories: string[];//商品类别 ID
    description: string;
    name: string;
    price: number;
    priceWithoutPromotion: number;
    stockout: boolean;
    [property: string]: any;
}

// 商家端显示的订单接口,给的数据只要满这个基本条件就行
export interface OrderInfoForShopAndrider {
    id: string;
    shopId: string;// 面对商家为null，面对骑手为店铺ID
    userId: string;
    items: ItemInfo[];
    status: string;
    address: string;
    distance: number;
    remark: string;
    total: number;
    createdAt: Date;
    [property: string]: any;
}