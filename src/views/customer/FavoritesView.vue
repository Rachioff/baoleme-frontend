<template>
  <div>
    <n-page-header title="我的收藏" @back="handleBack" />
    <n-card :bordered="false" style="margin-top: 16px">
      <n-tabs type="line" animated>
        <n-tab-pane name="shop-favorites" tab="收藏的店铺">
          <ShopFavorites />
        </n-tab-pane>
        <n-tab-pane name="item-favorites" tab="收藏的商品">
          <ItemFavorites />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane, NPageHeader } from 'naive-ui'
import ShopFavorites from './favorites/ShopFavorites.vue'
import ItemFavorites from './favorites/ItemFavorites.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>