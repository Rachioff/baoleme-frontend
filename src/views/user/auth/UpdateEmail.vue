<template>
  <div class="update-email-container">
    <div class="header">
      <n-button quaternary circle class="back-btn" @click="router.back()">
        <n-icon><arrow-left-outlined /></n-icon>
      </n-button>
      <h1 class="title">修改邮箱</h1>
    </div>

    <n-card class="update-email-card">
      <div v-if="!emailSentSuccessfully">
        <p style="margin-bottom: 20px; text-align: center; color: #555;">
          请输入您的新邮箱地址。我们会向这个新地址发送一封验证邮件，点击邮件中的链接即可完成修改。
        </p>
        <n-form
          ref="emailFormRef"
          :model="emailForm"
          :rules="emailRules"
          label-placement="left"
          @submit.prevent="handleSendVerificationEmail"
        >
          <n-form-item path="email" label="新邮箱">
            <n-input
              v-model:value="emailForm.email"
              placeholder="请输入新的邮箱地址"
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
            发送验证邮件
          </n-button>
        </n-form>
      </div>
      <div v-else class="step-content success-message">
        <n-icon size="48" color="#52c41a">
          <check-circle-filled />
        </n-icon>
        <h3>验证邮件已发送</h3>
        <p>
          验证链接已发送至 <strong>{{ emailForm.email }}</strong>，请检查您的收件箱并点击链接以完成邮箱修改。
          链接有效期通常为15分钟。
        </p>
        <n-button
          type="primary"
          block
          @click="router.push('/login')"
          class="action-btn"
        >
          完成，返回登录
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { MailOutlined, ArrowLeftOutlined, CheckCircleFilled } from '@vicons/antd';
import { NCard, NForm, NFormItem, NInput, NButton, NIcon, useMessage, type FormInst, type FormRules } from 'naive-ui';
import { updateEmail } from '@/api/auth'; // 确保路径正确

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
    { required: true, message: '请输入新邮箱地址', trigger: ['input', 'blur'] },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'input'] }
  ],
};

const handleSendVerificationEmail = () => {
  emailFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true;
      try {
        await updateEmail(emailForm.email);
        message.success('验证邮件已成功发送！');
        emailSentSuccessfully.value = true;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || '发送邮件失败，请稍后再试。';
        message.error(errorMessage);
        console.error('发送修改邮箱验证邮件错误:', error);
      } finally {
        loading.value = false;
      }
    } else {
      message.error('请输入有效的邮箱地址。');
    }
  });
};
</script>

<style scoped>
/* 复用之前的样式 */
.update-email-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f2f5, #ffffff);
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
  font-size: 22px;
  color: #333;
  margin: 0;
  font-weight: 500;
}
.update-email-card {
  width: 100%;
  max-width: 480px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
}
.action-btn {
  margin-top: 20px;
  height: 40px;
  font-size: 16px;
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
}
.success-message p {
  margin-bottom: 24px;
  color: #555;
  line-height: 1.6;
}
</style>