// src/views/user/auth/EmailVerification.vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyRegister } from '@/api/auth' // 假设 verifyRegister 接受 token 字符串
import { useMessage } from 'naive-ui'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const verificationStatus = ref('')
const statusMessage = ref('')

onMounted(async () => {
  const token = route.query.token as string | undefined; // 从查询参数获取token

  if (token) {
    verificationStatus.value = 'verifying'
    statusMessage.value = '正在验证您的邮箱...'
    try {
      await verifyRegister(token) // 调用API
      verificationStatus.value = 'success'
      statusMessage.value = '邮箱验证成功！您现在可以登录了。'
      message.success(statusMessage.value)
      // 可选：几秒后跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      verificationStatus.value = 'failed'
      statusMessage.value = error.response?.data?.message || '邮箱验证失败，链接可能无效或已过期。'
      message.error(statusMessage.value)
      console.error('Email verification failed:', error)
    }
  } else {
    verificationStatus.value = 'failed'
    statusMessage.value = '无效的验证链接，未找到Token。'
    message.error(statusMessage.value)
  }
})
</script>

<template>
  <div class="email-verification-container">
    <h2>邮箱验证</h2>
    <p v-if="verificationStatus === 'verifying'">{{ statusMessage }}</p>
    <div v-if="verificationStatus === 'success'">
      <p style="color: green;">{{ statusMessage }}</p>
      <router-link to="/login">前往登录</router-link>
    </div>
    <div v-if="verificationStatus === 'failed'">
      <p style="color: red;">{{ statusMessage }}</p>
      <router-link to="/login">返回登录页</router-link>
    </div>
  </div>
</template>

<style scoped>
.email-verification-container {
  text-align: center;
  padding: 40px;
}
</style>