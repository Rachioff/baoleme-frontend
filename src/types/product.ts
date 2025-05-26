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