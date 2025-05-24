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

// 这里是订单上的商品信息，后面还需要再
interface Item {
    id: number
    name: string
    price: number
    quantity: number
    image: string
    remark: string
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