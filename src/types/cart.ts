export interface CartInfo {
  total: number;
  totalWithoutPromotion: number;
  settlable: boolean;
}

export interface CartItem {
  item: {
    id: string;
    shopId: string;
    createdAt: string;
    name: string;
    description: string;
    available: boolean;
    stockout: boolean;
    price: number;
    priceWithoutPromotion: number;
    categories: string[];
    cover: {
      origin: string;
      thumbnail: string;
    };
    rating: number;
    sale: number;
  };
  quantity: number;
}