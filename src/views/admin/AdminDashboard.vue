<template>
  <div>
    <n-h2>管理员仪表盘</n-h2>
    <n-text>请选择您要操作的功能模块。</n-text>
    <n-divider />
    <n-grid :x-gap="24" :y-gap="24" :cols="4" responsive="screen" item-responsive>
      <n-gi span="4 m:2 l:1" v-for="item in dashboardItems" :key="item.title">
        <router-link :to="item.path" class="dashboard-link">
          <n-card class="dashboard-card" hoverable>
            <n-space align="center">
              <n-icon :component="item.icon" size="32" />
              <n-space vertical :size="0">
                <n-h3 style="margin: 0;">{{ item.title }}</n-h3>
                <n-text depth="3">{{ item.description }}</n-text>
              </n-space>
            </n-space>
          </n-card>
        </router-link>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import { 
  NCard, 
  NGrid, 
  NGi, 
  NH2, 
  NH3,
  NText, 
  NIcon, 
  NSpace, 
  NDivider 
} from 'naive-ui';
import { 
  StorefrontOutline, 
  NewspaperOutline, 
  ChatboxEllipsesOutline 
} from '@vicons/ionicons5';

const dashboardItems = [
  {
    title: '商家管理',
    description: '审核商家，并管理店铺商品。', // 更新描述，涵盖商品管理
    icon: StorefrontOutline,
    path: '/admin/shops'
  },
  // {  // 【已移除】商品管理卡片
  //   title: '商品管理',
  //   description: '审核商品内容，处理违规商品。',
  //   icon: CubeOutline,
  //   path: '/admin/items' 
  // },
  {
    title: '订单管理',
    description: '查看平台所有订单的流转情况。',
    icon: NewspaperOutline,
    path: '/admin/orders'
  },
//   {  // 【已移除】
//     title: '评价管理',
//     description: '管理用户评价，移除不当内容。',
//     icon: ChatboxEllipsesOutline,
//     path: '/admin/comments' // 待开发
//   }
];
</script>

<style scoped>
.dashboard-link {
  text-decoration: none;
  color: inherit;
}

.dashboard-card {
  transition: all 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.n-h3 {
    margin-bottom: 4px;
}
</style>