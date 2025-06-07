export interface OrderStats {
    sales: number[]
    incomes: number[]
}

export interface TopProducts {
    totalSale: number
    totalIncome: number
    bySale: {
        name: string
        queriedSale: number
    }[]
    byIncome: {
        name: string
        queriedIncome: number
    }[]
}

export interface ShopInfo {
  id: string;
  owner: string;
  createdAt: string;
  name: string;
  description: string;
  categories: string[];
  address: {
    coordinate: number[];
    province: string;
    city: string;
    district: string;
    address: string;
    name: string;
    tel: string;
  };
  verified: boolean;
  opened: boolean;
  openTimeStart: number;
  openTimeEnd: number;
  deliveryThreshold: number;
  deliveryPrice: number;
  maximumDistance: number;
  cover: {
    origin: string;
    thumbnail: string;
  };
  detailImage: {
    origin: string;
    thumbnail: string;
  };
  license: {
    origin: string;
    thumbnail: string;
  };
  rating: number;
  sale: number;
  averagePrice: number;
}