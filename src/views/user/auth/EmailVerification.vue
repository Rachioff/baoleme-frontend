<template>
  <div class="email-verification-container">
    <n-card class="verification-card">
      <div v-if="verificationStatus === 'verifying'" class="status-content">
        <n-spin size="large" />
        <h3 class="status-title">正在验证您的邮箱...</h3>
        <p class="status-description">请稍候，我们正在为您完成注册流程。</p>
      </div>

      <div v-else-if="verificationStatus === 'success'" class="status-content">
        <n-icon size="64" color="#52c41a">
          <check-circle-filled />
        </n-icon>
        <h3 class="status-title">邮箱验证成功！</h3>
        <p class="status-description">现在就去登录吧！</p>
        <n-button type="primary" block @click="goToLogin" class="action-btn">
          前往登录
        </n-button>
      </div>

      <div v-else-if="verificationStatus === 'error'" class="status-content">
        <n-icon size="64" color="#ff4d4f">
          <close-circle-filled />
        </n-icon>
        <h3 class="status-title">验证失败</h3>
        <p class="status-description">{{ statusMessage }}</p>
        <n-button type="primary" block @click="goToLogin" class="action-btn">
          返回登录页
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NSpin, NIcon, NButton, useMessage } from 'naive-ui';
import { CheckCircleFilled, CloseCircleFilled } from '@vicons/antd';
import { verifyRegister } from '@/api/auth';

type VerificationStatus = 'verifying' | 'success' | 'error';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const verificationStatus = ref<VerificationStatus>('verifying');
const statusMessage = ref('链接无效或已过期，请重试。');

onMounted(async () => {
  // 修正：从 route.params 获取 token，而不是 route.query
  const token = route.params.token as string | undefined;

  if (token) {
    try {
      await verifyRegister(token); // 调用API
      verificationStatus.value = 'success';
      message.success('邮箱验证成功！3秒后将自动跳转到登录页。');

      // 验证成功后，3秒自动跳转到登录页
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error: any) {
      statusMessage.value = error.response?.data?.message || '邮箱验证失败，链接可能无效或已过期。';
      verificationStatus.value = 'error';
      message.error(statusMessage.value);
      console.error('Email verification failed:', error);
    }
  } else {
    statusMessage.value = '无效的验证链接，未找到Token。';
    verificationStatus.value = 'error';
    message.error(statusMessage.value);
  }
});

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.email-verification-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f2f5, #ffffff);
  padding: 20px;
}

.verification-card {
  width: 100%;
  max-width: 450px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
}

.status-title {
  font-size: 22px;
  margin: 20px 0 10px;
  color: #333;
  font-weight: 500;
}

.status-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.action-btn {
  height: 40px;
  font-size: 16px;
}
</style>