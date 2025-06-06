<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <div class="app-container">
          <router-view></router-view>
          <bottom-navigation v-if="showBottomNav" />
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
  <!-- 自定义滚动条元素 -->
  <div id="custom-scrollbar"></div>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import BottomNavigation from './components/layout/BottomNavigation.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'

const route = useRoute()

// 控制底部导航栏显示的逻辑
const showBottomNav = computed(() => {
  // 不需要显示底部导航的路由列表，注意，在feature-auth中由于更新了鉴权逻辑，所以这里的逻辑受牵连，若出现冲突，以此为准
  const hideNavRouteNames = [
    'Login',
    'ForgotPassword',
    'EmailVerification',
    'ResetPasswordEmail',
    'UpdateEmail',
    'VerifyUpdateEmail',
    
  ]
  if (route.path === '/' || (route.name && hideNavRouteNames.includes(route.name as string))) {
    return false
  }
  return true
})

// 滚动条相关逻辑
onMounted(() => {
  // 获取自定义滚动条元素
  const scrollbar = document.getElementById('custom-scrollbar');

  // 隐藏原生滚动条但保留滚动功能
  document.documentElement.style.scrollbarWidth = 'none'; // Firefox

  // 添加滚动事件监听
  let scrollTimer: number | null = null;
  let isScrolling = false;

  const updateScrollbar = () => {
    if (!scrollbar) return;

    // 计算滚动条高度和位置
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 只有当有可滚动内容时才显示滚动条
    if (documentHeight > windowHeight) {
      // 计算滚动条高度比例
      const scrollbarHeight = (windowHeight / documentHeight) * windowHeight;
      // 计算滚动条位置
      const scrollbarTop = (scrollTop / (documentHeight - windowHeight)) * (windowHeight - scrollbarHeight);

      // 设置滚动条样式
      scrollbar.style.height = `${scrollbarHeight}px`;
      scrollbar.style.top = `${scrollbarTop}px`;

      // 滚动时显示滚动条
      if (isScrolling) {
        scrollbar.style.opacity = '1';
      }
    } else {
      // 没有可滚动内容，隐藏滚动条
      scrollbar.style.opacity = '0';
    }
  };

  const handleScroll = () => {
    isScrolling = true;
    updateScrollbar();

    // 清除之前的定时器
    if (scrollTimer) clearTimeout(scrollTimer);

    // 设置新定时器，滚动停止后隐藏滚动条
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
      if (scrollbar) scrollbar.style.opacity = '0';
    }, 1000);
  };

  // 初始化滚动条位置
  updateScrollbar();

  // 添加事件监听
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateScrollbar);

  // 组件卸载时的清理函数
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateScrollbar);
    if (scrollTimer) clearTimeout(scrollTimer);
  });
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 隐藏原生滚动条但保留滚动功能 */
html::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
  /* 使滚动平滑 */
  scroll-behavior: smooth;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 56px;
  /* 为底部导航腾出空间，与导航栏高度一致 */
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

/* 自定义滚动条样式 */
#custom-scrollbar {
  position: fixed;
  top: 0;
  right: 4px;
  width: 8px;
  height: 100px;
  /* 初始高度，将被JS动态调整 */
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10000;
  pointer-events: none;
  /* 不拦截鼠标事件 */
}

/* 悬停效果 - 虽然不能直接点击，但当鼠标移到右侧时可以稍微加深颜色 */
#custom-scrollbar:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>