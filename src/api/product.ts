// src/api/product.ts
import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import type {
  ProductData, // 确保从 @/types/product 导入
  ProductProfileData, // 确保从 @/types/product 导入
  ProductImageData, // 确保从 @/types/product 导入
  GetShopProductsByCategoryQueryParams,
  CreateProductBody,
  UpdateProductProfileBody,
  GetShopProductsByCategoryResponse,
  GetProductDetailResponse,
  GetShopAllProductsResponse,
  CreateProductResponse,
  UpdateProductProfileResponse,
  UpdateProductCoverResponse,
  DeleteProductResponse
} from '@/types/product'
import axios from 'axios'

const getToken = () => useTokenStore().token;

export const getShopProductsByCategory = async (shopId: string, categoryId: string, params?: GetShopProductsByCategoryQueryParams): Promise<GetShopProductsByCategoryResponse> => {
  const res = await axios.get<GetShopProductsByCategoryResponse>(`${apiRoot}/shops/${shopId}/item-categories/${categoryId}/items`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params
  });
  return res.data;
}

export const getProductDetail = async (productId: string): Promise<GetProductDetailResponse> => {
  const res = await axios.get<GetProductDetailResponse>(`${apiRoot}/items/${productId}`, { // API路径仍为 items
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

export const getShopAllProducts = async (shopId: string, params?: GetShopProductsByCategoryQueryParams): Promise<GetShopAllProductsResponse> => {
  const res = await axios.get<GetShopAllProductsResponse>(`${apiRoot}/shops/${shopId}/items`, { // API路径仍为 items
    headers: { Authorization: `Bearer ${getToken()}` },
    params
  });
  return res.data;
}

export const createProduct = async (shopId: string, data: CreateProductBody): Promise<CreateProductResponse> => {
  const res = await axios.post<CreateProductResponse>(`${apiRoot}/shops/${shopId}/items`, data, { // API路径仍为 items
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

export const updateProductProfile = async (productId: string, data: UpdateProductProfileBody): Promise<UpdateProductProfileResponse> => {
  const res = await axios.patch<UpdateProductProfileResponse>(`${apiRoot}/items/${productId}/profile`, data, { // API路径仍为 items
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

export const updateProductCover = async (productId: string, coverFile: File): Promise<UpdateProductCoverResponse> => {
  const formData = new FormData();
  formData.append('cover', coverFile);
  const res = await axios.patch<UpdateProductCoverResponse>(`${apiRoot}/items/${productId}/cover`, formData, { // API路径仍为 items
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}

export const deleteProduct = async (productId: string): Promise<DeleteProductResponse> => {
  await axios.delete(`${apiRoot}/items/${productId}`, { // API路径仍为 items
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}