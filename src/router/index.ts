// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Login from '@/views/user/auth/Login.vue'

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
    component: () => import('@/views/user/auth/ForgotPassword.vue')
  },

  // 用户主页面
  {
    path: '/user/home',
    name: 'UserHome',
    // 使用懒加载
    component: () => import('@/views/user/home/Home.vue')
  }
  // 其他路由将在后续添加
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router