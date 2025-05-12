<template>
  <div class="bottom-navigation">
    <div 
      v-for="(item, index) in navItems" 
      :key="index"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      @click="navigate(item.path)"
    >
      <n-icon size="20">
        <component :is="item.icon" />
      </n-icon>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  HomeFilled,
  FileTextOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@vicons/antd';

const router = useRouter();
const route = useRoute();

const navItems = ref([
  { 
    label: '首页', 
    icon: HomeFilled, 
    path: '/user/home' 
  },
  { 
    label: '订单', 
    icon: FileTextOutlined, 
    path: '/orders' 
  },
  { 
    label: '购物车', 
    icon: ShoppingCartOutlined, 
    path: '/cart' 
  },
  { 
    label: '我的', 
    icon: UserOutlined, 
    path: '/user/profile' 
  }
]);

const isActive = (path: string) => {
  // 简单匹配或者更复杂的前缀匹配
  return route.path === path || route.path.startsWith(path);
};

const navigate = (path: string) => {
  if (route.path !== path) {
    router.push(path);
  }
};
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  background-color: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}

.nav-item.active {
  color: #ff6b01;
}

.nav-item span {
  margin-top: 2px;
}
</style>