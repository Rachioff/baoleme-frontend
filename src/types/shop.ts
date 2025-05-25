import type { Product } from './product'

export interface Shop {
  id: string
  owner: string
  createdAt: string
  name: string
  description: string
  categories: string[]
  address: {
    coordinate: number[]
    province: string
    city: string
    district: string
    town: string
    address: string
    name: string
    tel: string
  }
  verified: boolean
  opened: boolean
  openTimeStart: number
  openTimeEnd: number
  deliveryThreshold: number
  deliveryPrice: number
  maximumDistance: number
  cover: {
    origin: string
    thumbnail: string
  }
  detailImage: {
    origin: string
    thumbnail: string
  }
  license: {
    origin: string
    thumbnail: string
  }
  rating: number
  sale: number
  averagePrice: number
  time: number
  distance: number
  recommends?: Product[]
}

export interface RecommendedShopsParams {
  p?: number 
  pn?: number 
  q?: string 
  c?: string[] 
  d?: number
  r?: number 
  t?: number 
  s?: string 
  rc?: number 
  a?: string 
}
