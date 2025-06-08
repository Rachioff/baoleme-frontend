<template>
  <div>
    <n-page-header title="我的足迹" @back="handleBack" />
    <n-card :bordered="false" style="margin-top: 16px">
      <n-tabs type="line" animated>
        <n-tab-pane name="shop-history" tab="店铺记录">
          <ShopHistory />
        </n-tab-pane>
        <n-tab-pane name="item-history" tab="商品记录">
          <ItemHistory />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane, NPageHeader } from 'naive-ui'
import ShopHistory from './records/ShopHistory.vue'
import ItemHistory from './records/ItemHistory.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>