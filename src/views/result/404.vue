<template>
  <div style="justify-content: center; align-items: center; display: flex; height: 100vh">
    <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-button @click="$router.push('/')">找点乐子吧</n-button>
      </template>
    </n-result>
  </div>
</template>