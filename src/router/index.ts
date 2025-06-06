// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Login from '@/views/user/auth/Login.vue'
import { defineAsyncComponent } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },

  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/auth/Login.vue')
  },

  // 忘记密码
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/user/auth/ForgotPassword.vue')
  },
  // 修改密码验证
  {
    path: '/email-postprocess/reset-password',
    name: 'ResetPasswordEmail',
    component: () => import('@/views/user/auth/ResetPasswordEmail.vue'),
    props: route=> ({ query: route.query})
  },

  // 注册验证
  {
    path: '/email-postprocess/verify-register',
    name: 'EmailVerification',
    component: () => import('@/views/user/auth/EmailVerification.vue'),
    props: route => ({ query: route.query })
  },
  // 更新邮箱
  {
    path: '/user/update-email',
    name: 'UpdateEmail',
    component: () => import('@/views/user/auth/UpdateEmail.vue'),
    meta: { requiresAuth: true },
  },
  // 更新邮箱验证
  {
    path: '/email-postprocess/verify-email',
    name: 'VerifyUpdateEmail',
    component: () => import('@/views/user/auth/EmailVerification.vue'),
    props: true
  },

  // 用户主页面
  {
    path: '/customer/home',
    name: 'CustomerHome',
    // 使用懒加载
    component: () => import('@/views/customer/home/Home.vue')
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: () => import('@/views/user/UserView.vue'),
    props: true
  },
  // 订单
  {
    path: '/customer/order',
    name: 'CustomerOrder',
    component: () => import('@/views/customer/order/Order.vue')
  },
  // 订单详情，路由参数和api匹配
  {
    path: '/customer/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/customer/order/OrderInfo.vue')
  },
  {
    path: '/merchant/shops', // 商户的店铺列表
    name: 'MerchantShopList',
    component: () => import('@/views/merchant/ShopList.vue'),
  },
  {
    path: '/merchant/shops/create', // 创建店铺的路由
    name: 'MerchantShopCreate',
    component: () => import('@/views/merchant/ShopCreateForm.vue'),
  },
  {
    path: '/merchant/shops/:shopId/detail',
    name: 'MerchantShopDetail',
    component: () => import('@/views/merchant/ShopDetail.vue'),
    props: true,
    children: [
      {
        path: 'products',
        name: 'MerchantShopProductList',
        component: () => import('@/views/merchant/product/ProductList.vue'), // 商品列表组件
        props: true
      }
    ]
  },
  {
    path: '/merchant/shops/edit/:shopId', // 编辑店铺信息的路由
    name: 'MerchantShopEdit',
    component: () => import('@/views/merchant/ShopEditForm.vue'),
    props: true,
  },
  {
    path: '/merchant/shops/:shopId/products/create',
    name: 'MerchantProductCreate',
    component: () => import('@/views/merchant/product/ProductForm.vue'),
    props: true,
    meta: { requiresAuth: true, role: 'merchant' }
  },
  {
    path: '/merchant/products/:productId/edit', 
    name: 'MerchantProductEdit',
    component: () => import('@/views/merchant/product/ProductForm.vue'),
    props: true, // productId 会被传递
    meta: { requiresAuth: true, role: 'merchant' }
  },
  {
    path: '/merchant/products/:productId',
    name: 'MerchantProductDetail',
    component: () => import('@/views/merchant/product/ProductDetail.vue'),
    props: true, // productId 会被传递
    meta: { requiresAuth: true, role: 'merchant' }
  },
  {
    path: '/shop-statistics',
    name: 'ShopStatistics',
    component: () => import('@/views/merchant/shop/ShopStatistics.vue')
  },

    // 下单页面
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/customer/order/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rider/recommend',
    name: 'Recommend',
    component: () => import('@/views/rider/Recommend.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router