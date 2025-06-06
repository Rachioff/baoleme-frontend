<template>
    <div class="reset-password-container">
      <div class="header">
        <n-button quaternary circle class="back-btn" @click="router.push('/login')">
          <n-icon><arrow-left-outlined /></n-icon>
        </n-button>
        <h1 class="title">设置新密码</h1>
      </div>
  
      <n-card class="reset-password-card">
        <div v-if="tokenValid">
          <p style="margin-bottom: 20px; text-align: center; color: #555;">
            请输入您的新密码。
          </p>
          <n-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-placement="left"
            @submit.prevent="handleResetPassword"
          >
            <n-form-item path="password" label="新密码">
              <n-input
                v-model:value="passwordForm.password"
                type="password"
                placeholder="请输入新密码 (至少6位)"
                show-password-on="click"
              >
                <template #prefix>
                  <n-icon><lock-outlined /></n-icon>
                </template>
              </n-input>
            </n-form-item>
  
            <n-form-item path="confirmPassword" label="确认密码">
              <n-input
                v-model:value="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password-on="click"
                :disabled="!passwordForm.password"
              >
                <template #prefix>
                  <n-icon><lock-outlined /></n-icon>
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
              确认修改密码
            </n-button>
          </n-form>
        </div>
        <div v-else class="step-content invalid-token-message">
           <n-icon size="48" color="#ff4d4f"> <close-circle-filled />
          </n-icon>
          <h3>链接无效或已过期</h3>
          <p>抱歉，此密码重置链接无效或已过期。请尝试重新发送忘记密码邮件。</p>
          <n-button
            type="primary"
            block
            @click="router.push('/forgot-password')"
            class="action-btn"
          >
            重新发送邮件
          </n-button>
           <n-button
            text
            style="margin-top: 15px;"
            @click="router.push('/login')"
          >
            返回登录
          </n-button>
        </div>
      </n-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    LockOutlined,
    ArrowLeftOutlined,
    CloseCircleFilled // Error icon
  } from '@vicons/antd';
  import { NCard, NForm, NFormItem, NInput, NButton, NIcon, useMessage, type FormInst, type FormRules } from 'naive-ui';
  import { resetPassword, type ResetPasswordRequest } from '@/api/auth'; // 确保路径正确
  
  const route = useRoute();
  const router = useRouter();
  const message = useMessage();
  
  const loading = ref(false);
  const token = ref<string | null>(null);
  const tokenValid = ref(false); // 用于控制是否显示表单
  
  const passwordFormRef = ref<FormInst | null>(null);
  const passwordForm = reactive({
    password: '',
    confirmPassword: '',
  });
  
  onMounted(() => {
    const routeToken = route.params.token;
    if (typeof routeToken === 'string' && routeToken) {
      token.value = routeToken;
      tokenValid.value = true; // 假设 token 存在即有效，后端API会做最终验证
    } else {
      tokenValid.value = false;
      // message.error('无效的重置链接或令牌缺失。'); // 提示已在模板中处理
    }
  });
  
  const passwordRules: FormRules = {
    password: [
      { required: true, message: '请输入新密码', trigger: ['input', 'blur'] },
      { min: 6, message: '密码长度至少为6位', trigger: ['input', 'blur'] },
      // 你可以根据需要添加更复杂的密码规则，例如包含字母和数字
      // { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: '密码必须包含字母和数字', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入新密码', trigger: ['input', 'blur'] },
      {
        validator: (rule, value) => value === passwordForm.password,
        message: '两次输入的密码不一致',
        trigger: ['blur', 'input'],
      },
    ],
  };
  
  const handleResetPassword = () => {
    if (!tokenValid.value || !token.value) {
      message.error('无法重置密码：令牌无效。');
      return;
    }
    passwordFormRef.value?.validate(async (errors) => {
      if (!errors) {
        loading.value = true;
        try {
          await resetPassword({
            token: token.value as string,
            newPassword: passwordForm.password,
          } as ResetPasswordRequest);
          message.success('密码已成功重置！您现在可以使用新密码登录。');
          router.push('/login');
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message) {
            message.error(`重置失败: ${error.response.data.message}`);
          } else {
            message.error('密码重置失败，链接可能已失效或网络错误。');
          }
          console.error('重置密码API错误:', error);
        } finally {
          loading.value = false;
        }
      } else {
        message.error('请正确填写密码信息。');
      }
    });
  };
  </script>
  
  <style scoped>
  .reset-password-container {
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
  
  .reset-password-card {
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
  
  .invalid-token-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 0;
  }
  
  .invalid-token-message h3 {
    margin: 16px 0 8px;
    font-size: 20px;
    color: #333;
    font-weight: 500;
  }
  
  .invalid-token-message p {
    margin-bottom: 24px;
    color: #555;
    line-height: 1.6;
  }
  </style>