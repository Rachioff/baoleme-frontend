import type { imgURL } from "@/types/img";
import type { Address } from "./address";

export interface Response {
    /**
     * 店铺Address
     */
    address: Address;
    /**
     * 人均价格，分
     */
    averagePrice: number;
    /**
     * 店铺类型 ID 列表
     */
    categories: string[];
    /**
     * 封面
     */
    cover: imgURL;
    /**
     * 店铺创建时间
     */
    createdAt: Date;
    /**
     * 配送费用，分
     */
    deliveryPrice: number;
    /**
     * 起送价格，分
     */
    deliveryThreshold: number;
    /**
     * 店铺描述
     */
    description: string;
    /**
     * 详情图像
     */
    detailImage: imgURL;
    /**
     * 距离，公里
     */
    distance: number;
    /**
     * 店铺 ID
     */
    id: string;
    /**
     * 店铺执照
     */
    license: imgURL;
    /**
     * 最远允许配送的距离，公里
     */
    maximumDistance: number;
    /**
     * 店铺名称
     */
    name: string;
    /**
     * 开业状态，此属性可用于临时下架店铺
     */
    opened: boolean;
    /**
     * 营业结束时间（UTC），一天内的分钟数
     */
    openTimeEnd: number;
    /**
     * 营业开始时间（UTC），一天内的分钟数
     */
    openTimeStart: number;
    /**
     * 店铺所有者用户 ID
     */
    owner: string;
    /**
     * 评分，0~50
     */
    rating: number;
    /**
     * 推荐商品
     */
    recommends: Recommend[];
    /**
     * 月销量
     */
    sale: number;
    /**
     * 时间，分钟
     */
    time: number;
    /**
     * 认证状态，此属性只有管理员可以修改
     */
    verified: boolean;
    [property: string]: any;
}

export interface Recommend {
    /**
     * 商品是否上架
     */
    available: boolean;
    /**
     * 商品类别 ID
     */
    categories: string[];
    /**
     * 商品封面图
     */
    cover: imgURL;
    /**
     * 商品创建时间
     */
    createdAt: Date;
    /**
     * 商品描述
     */
    description: string;
    /**
     * 商品 ID
     */
    id: string;
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
     * 评分，0~50
     */
    rating: number;
    /**
     * 月销量
     */
    sale: number;
    /**
     * 商品所属店铺 ID
     */
    shopId: string;
    /**
     * 商品是否缺货
     */
    stockout: boolean;
    [property: string]: any;
}