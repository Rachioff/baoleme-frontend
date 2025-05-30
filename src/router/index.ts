// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Login from '@/views/customer/auth/Login.vue'
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
    component: () => import('@/views/customer/auth/Login.vue')
  },

  // 忘记密码
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/customer/auth/ForgotPassword.vue')
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
    path: '/merchant/shops/create', // 新增：创建店铺的路由
    name: 'MerchantShopCreate',
    component: () => import('@/views/merchant/ShopCreateForm.vue'),
  },
  {
    path: '/merchant/shops/:shopId/detail', // 商户的店铺详情页
    name: 'MerchantShopDetail',
    component: () => import('@/views/merchant/ShopDetail.vue'),
    props: true, // 将路由参数 shopId 作为 props 传递给组件
  },
  {
    path: '/merchant/shops/edit/:shopId', // 编辑店铺信息的路由
    name: 'MerchantShopEdit',
    component: () => import('@/views/merchant/ShopEditForm.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router