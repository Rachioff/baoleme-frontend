<template>
  <n-card :title="cardTitle" style="max-width: 600px; margin: 50px auto; text-align: center;">
    <n-spin :show="loading">
      <n-result
        :status="resultStatus"
        :title="resultTitle"
        :description="resultDescription"
      >
        <template #footer>
          <n-button v-if="showLoginButton" type="primary" @click="goToLogin">
            前往登录
          </n-button>
        </template>
      </n-result>
    </n-spin>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NSpin, NResult, NButton, useMessage } from 'naive-ui'
import { verifyRegister } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(true)
const verificationStatus = ref<'success' | 'error' | 'processing'>('processing')
const errorMessage = ref<string | null>(null)

const cardTitle = '邮箱验证'

onMounted(async () => {
  const token = route.query.token as string | undefined;
  console.log(token)
  if (token) {
    verificationStatus.value = 'verifying'
    statusMessage.value = '正在验证您的邮箱...'
    try {
      await verifyRegister(token)
      verificationStatus.value = 'success'
      statusMessage.value = '邮箱验证成功！您现在可以登录了。'
      message.success(statusMessage.value)
      setTimeout(() => {
        router.push({ name: 'Login' })
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

const resultStatus = computed(() => {
    if (verificationStatus.value === 'success') return 'success'
    if (verificationStatus.value === 'error') return 'error'
    return undefined 
})

const resultTitle = computed(() => {
    if (verificationStatus.value === 'success') return '验证成功！🎉'
    if (verificationStatus.value === 'error') return '验证失败 😟'
    return '正在验证您的邮箱...'
})

const resultDescription = computed(() => {
    if (verificationStatus.value === 'success') return '您的邮箱已成功验证。现在您可以登录到您的账户。'
    if (verificationStatus.value === 'error') return errorMessage.value || '抱歉，我们无法验证您的邮箱。请检查链接是否正确，或尝试重新注册。'
    return '请稍候，我们正在处理您的请求。'
})

const showLoginButton = computed(() => verificationStatus.value === 'success')

// 注册成功之后可以点那个按钮返回登录
const goToLogin = () => {
    router.push({ name: 'Login' })
}
</script>

<style scoped>
.n-card {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
</style>