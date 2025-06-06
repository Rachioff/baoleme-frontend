import type { Address } from './address'
/**
 * 订单
 */
export interface OrderList {
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

export interface OrderInfo {
    /**
     * 取消时间，订单状态变为 canceled 的时间
     */
    canceledAt: Date | null;
    /**
     * 创建时间
     */
    createdAt: Date | null;
    /**
     * 客户 ID
     */
    customer?: null | string;
    customerAddress: Address;
    /**
     * 配送开始时间，订单状态由 prepared 变为 delivering 的时间
     */
    deliveredAt?: Date | null;
    delivery?: null | Delivery;
    /**
     * 配送费，分
     */
    deliveryFee: number;
    /**
     * 配送完成时间，订单状态由 delivering 变为 delivered 的时间
     */
    finishedAt?: Date | null;
    /**
     * 订单 ID
     */
    id: string;
    /**
     * 商品列表
     */
    items?: Item[];
    /**
     * 备注
     */
    note?: string;
    /**
     * 付款时间，订单状态由 unpaid 变为 preparing 的时间
     */
    paidAt?: Date | null;
    /**
     * 准备完成时间，订单状态由 preparing 变为 prepared 的时间
     */
    preparedAt: Date | null;
    /**
     * 骑手 ID
     */
    rider?: null | string;
    /**
     * 店铺 ID
     */
    shop?: null | string;
    shopAddress: Address;
    /**
     * 状态
     */
    status: Status;
    /**
     * 总付款，分
     */
    total?: number;
    [property: string]: any;
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