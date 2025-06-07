<template>
  <n-space align="center" :wrap="false">
    <n-button 
      v-if="quantity > 0" 
      size="small" 
      circle 
      strong 
      secondary 
      @click.stop="$emit('remove')"
    >
      <template #icon><n-icon><MinusOutlined /></n-icon></template>
    </n-button>
    <span v-if="quantity > 0" class="quantity-text">{{ quantity }}</span>
    <n-button 
      size="small" 
      circle 
      type="primary" 
      @click.stop="$emit('add')"
    >
      <template #icon><n-icon><PlusOutlined /></n-icon></template>
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { NSpace, NButton, NIcon } from 'naive-ui';
import { PlusOutlined, MinusOutlined } from '@vicons/antd';

defineProps({
  quantity: {
    type: Number,
    required: true,
    default: 0
  }
});

defineEmits(['add', 'remove']);
</script>

<style scoped>
.quantity-text {
  font-size: 16px;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
}
</style>