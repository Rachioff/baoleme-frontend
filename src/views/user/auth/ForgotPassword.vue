<template>
  <div class="forgot-password-container">
    <div class="header">
      <n-button quaternary circle class="back-btn" @click="goBackToLogin">
        <n-icon><arrow-left-outlined /></n-icon>
      </n-button>
      <h1 class="title">忘记密码</h1>
    </div>

    <n-card class="forgot-password-card">
      <div v-if="!emailSentSuccessfully">
        <p style="margin-bottom: 20px; text-align: center; color: #555;">
          请输入您注册时使用的邮箱地址，我们将向该邮箱发送一封包含重置密码链接的邮件。
        </p>
        <n-form
          ref="emailFormRef"
          :model="emailForm"
          :rules="emailRules"
          label-placement="left"
          @submit.prevent="handleSendResetEmail"
        >
          <n-form-item path="email" label="邮箱">
            <n-input
              v-model:value="emailForm.email"
              placeholder="请输入邮箱地址"
            >
              <template #prefix>
                <n-icon><mail-outlined /></n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-button
            type="primary"
            block
            attr-type="submit"
            :loading="loading"
            class="action-btn"
          >
            发送重置邮件
          </n-button>
        </n-form>
      </div>
      <div v-else class="step-content success-message">
        <n-icon size="48" color="#52c41a">
          <check-circle-filled />
        </n-icon>
        <h3>邮件已发送</h3>
        <p>重置密码的链接已发送至您的邮箱 <strong>{{ emailForm.email }}</strong>，请检查您的收件箱（也请留意垃圾邮件文件夹），并按照邮件中的指示操作。</p>
        <n-button
          type="primary"
          block
          @click="goBackToLogin"
          class="action-btn"
        >
          返回登录
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled
} from '@vicons/antd';
import { NCard, NForm, NFormItem, NInput, NButton, NIcon, useMessage, type FormInst, type FormRules } from 'naive-ui';
import { forgotPassword, type ForgotPasswordRequest } from '@/api/auth'; // 确保路径正确

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const emailSentSuccessfully = ref(false);

const emailFormRef = ref<FormInst | null>(null);
const emailForm = reactive({
  email: '',
});

const emailRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: ['input', 'blur'] },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'input'] }
  ],
};

const handleSendResetEmail = () => {
  emailFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true;
      try {
        await forgotPassword({ email: emailForm.email } as ForgotPasswordRequest);
        message.success('重置密码邮件已成功发送！');
        emailSentSuccessfully.value = true;
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          message.error(`发送失败: ${error.response.data.message}`);
        } else {
          message.error('发送邮件失败，请检查邮箱地址或稍后再试。');
        }
        console.error('发送忘记密码邮件错误:', error);
      } finally {
        loading.value = false;
      }
    } else {
      message.error('请输入有效的邮箱地址。');
    }
  });
};

const goBackToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f2f5, #ffffff); /* 更柔和的背景 */
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 480px;
  margin-bottom: 30px;
  margin-top: 20px;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.title {
  flex: 1;
  text-align: center;
  font-size: 22px; /* 调整标题大小 */
  color: #333;
  margin: 0;
  font-weight: 500;
}

.forgot-password-card {
  width: 100%;
  max-width: 480px;
  border-radius: 8px; /* 调整圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09); /* 调整阴影 */
  padding: 20px; /* 为卡片内容增加内边距 */
}

.step-content {
  margin-top: 20px; /* 调整内容与标题/步骤条的间距 */
}

.action-btn {
  margin-top: 20px;
  height: 40px; /* 调整按钮高度 */
  font-size: 16px;
  /* background-color: #1890ff; Naive UI 主题色 */
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
}

.success-message h3 {
  margin: 16px 0 8px;
  font-size: 20px;
  color: #333;
  font-weight: 500;
}

.success-message p {
  margin-bottom: 24px;
  color: #555;
  line-height: 1.6;
}
</style>