<template>
  <n-config-provider>
    <n-message-provider>
      <div class="app-container">
        <router-view></router-view>
        <bottom-navigation v-if="showBottomNav" />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import BottomNavigation from './components/layout/BottomNavigation.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 控制底部导航栏显示的逻辑
// 在登录、注册等页面不显示底部导航
const showBottomNav = computed(() => {
  // 不需要显示底部导航的路由列表
  const hideNavRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password'
  ]
  return !hideNavRoutes.includes(route.path)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  overflow-y: scroll; /* 始终显示滚动条 */
  scrollbar-gutter: stable; /* 为滚动条保留空间，防止布局偏移 */
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 56px; /* 为底部导航腾出空间，与导航栏高度一致 */
}

/* 在不显示底部导航的页面，移除底部内边距 */
.app-container:has(> .bottom-navigation:not([data-v-shown])) {
  padding-bottom: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>