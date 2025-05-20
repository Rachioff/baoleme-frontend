// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Login from '@/views/customer/auth/Login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },

  // 登录
  {
    path: '/login',
    name: 'Login',
    component: Login
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
  // 订单
  {
    path: '/customer/order',
    name: 'CustomerOrder',
    component: () => import('@/views/customer/order/Order.vue')
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router