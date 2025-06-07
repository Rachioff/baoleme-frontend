<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <n-layout class="app-layout">
          <n-layout-content class="app-content">
            <router-view />
          </n-layout-content>

          <n-layout-footer v-if="showBottomNav" position="absolute" style="z-index: 100;">
            <BottomNavigation />
          </n-layout-footer>
        </n-layout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
  
  <div id="custom-scrollbar"></div>
</template>

<script setup lang="ts">
// 您的 script 部分完全无需改动
import { 
  NConfigProvider, 
  NMessageProvider, 
  NDialogProvider,
  NLayout,
  NLayoutContent,
  NLayoutFooter
} from 'naive-ui';
import BottomNavigation from './components/layout/BottomNavigation.vue';
import { useRoute } from 'vue-router';
import { computed, onMounted, onUnmounted } from 'vue';

const route = useRoute();

// 控制底部导航栏显示的逻辑
const showBottomNav = computed(() => {
  const hideNavRouteNames = [
    'Login',
    'ForgotPassword',
    'EmailVerification',
    'ResetPasswordEmail',
    'UpdateEmail',
    'VerifyUpdateEmail',
    'CustomerShopProducts',
    'AdminDashboard',
    'AdminShopReview',
    'AdminShopItemReview',
    'AdminShopCommentReview',
    'AdminOrderManagement',
    
  ];
  if (route.path === '/' || (route.name && hideNavRouteNames.includes(route.name as string))) {
    return false;
  }
  return true;
});

// 滚动条相关逻辑
onMounted(() => {
  const scrollbar = document.getElementById('custom-scrollbar');
  if (!scrollbar) return;

  document.documentElement.style.scrollbarWidth = 'none'; // Firefox

  let scrollTimer: number | null = null;
  let isScrolling = false;

  const updateScrollbar = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (documentHeight > windowHeight) {
      const scrollbarHeight = (windowHeight / documentHeight) * windowHeight;
      const scrollbarTop = (scrollTop / (documentHeight - windowHeight)) * (windowHeight - scrollbarHeight);

      scrollbar.style.height = `${scrollbarHeight}px`;
      scrollbar.style.top = `${scrollbarTop}px`;

      if (isScrolling) {
        scrollbar.style.opacity = '1';
      }
    } else {
      scrollbar.style.opacity = '0';
    }
  };

  const handleScroll = () => {
    isScrolling = true;
    updateScrollbar();
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
      if (scrollbar) scrollbar.style.opacity = '0';
    }, 1000);
  };

  updateScrollbar();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateScrollbar);

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateScrollbar);
    if (scrollTimer) clearTimeout(scrollTimer);
  });
});
</script>

<style>
/* 您的全局样式基本保持不变 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

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
  scroll-behavior: smooth;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* 4. 修改样式以适应新布局 */
.app-layout {
  min-height: 100vh;
}

.app-content {
  /* 当底部导航栏显示时，为其预留出空间，防止内容被遮挡 */
  padding-bottom: 56px; 
}

/* 当底部导航栏不显示时，内容区域占满全部空间 */
.app-layout:not(:has(.n-layout-footer)) .app-content {
  padding-bottom: 0;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* 您的自定义滚动条样式保持不变 */
#custom-scrollbar {
  position: fixed;
  top: 0;
  right: 4px;
  width: 8px;
  height: 100px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10000;
  pointer-events: none;
}

#custom-scrollbar:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>