<!-- src/views/customer/auth/ForgotPassword.vue -->
<template>
  <div class="forgot-password-container">
    <div class="header">
      <n-button quaternary circle class="back-btn" @click="router.push('/login')">
        <n-icon><arrow-left-outlined /></n-icon>
      </n-button>
      <h1 class="title">找回密码</h1>
    </div>
    
    <n-card class="forgot-password-card">
      <n-steps :current="currentStep" :status="currentError ? 'error' : undefined">
        <n-step title="验证邮箱" description="发送验证码至邮箱" />
        <n-step title="重置密码" description="设置新密码" />
        <n-step title="完成" description="密码重置成功" />
      </n-steps>
      
      <!-- 第一步：验证邮箱 -->
      <div v-show="currentStep === 0" class="step-content">
        <n-form
          ref="emailFormRef"
          :model="emailForm"
          :rules="emailRules"
          label-placement="left"
        >
          <n-form-item path="email" label="邮箱">
            <n-input 
              v-model:value="emailForm.email" 
              placeholder="请输入账户所绑定的邮箱"
              :disabled="codeSent"
            >
              <template #prefix>
                <n-icon><mail-outlined /></n-icon>
              </template>
            </n-input>
          </n-form-item>
          
          <n-form-item v-if="codeSent" path="verificationCode" label="验证码">
            <div class="verification-code">
              <n-input 
                v-model:value="emailForm.verificationCode" 
                placeholder="请输入验证码"
              />
              <n-button 
                :disabled="codeCooldown > 0" 
                @click="getVerificationCode"
                class="code-btn"
              >
                {{ codeCooldown > 0 ? `重新获取(${codeCooldown}s)` : '获取验证码' }}
              </n-button>
            </div>
          </n-form-item>
          
          <n-button 
            type="primary" 
            block 
            @click="codeSent ? verifyCode() : getVerificationCode()"
            :loading="loading"
            class="action-btn"
          >
            {{ codeSent ? '验证' : '获取验证码' }}
          </n-button>
        </n-form>
      </div>
      
      <!-- 第二步：重置密码 -->
      <div v-show="currentStep === 1" class="step-content">
        <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-placement="left"
        >
          <n-form-item path="password" label="新密码">
            <n-input 
              v-model:value="passwordForm.password" 
              type="password" 
              placeholder="请设置新密码（6-20位字母和数字）"
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
              placeholder="请确认新密码"
              show-password-on="click"
            >
              <template #prefix>
                <n-icon><lock-outlined /></n-icon>
              </template>
            </n-input>
          </n-form-item>
          
          <n-button 
            type="primary" 
            block 
            @click="resetPassword"
            :loading="loading"
            class="action-btn"
          >
            确认修改
          </n-button>
        </n-form>
      </div>
      
      <!-- 第三步：完成 -->
      <div v-show="currentStep === 2" class="step-content">
        <div class="success-message">
          <n-icon size="48" color="#52c41a">
            <check-circle-filled />
          </n-icon>
          <h3>密码重置成功</h3>
          <p>您已成功重置密码，请使用新密码登录</p>
          <n-button 
            type="primary" 
            block 
            @click="router.push('/login')"
            class="action-btn"
          >
            返回登录
          </n-button>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MailOutlined, 
  LockOutlined, 
  ArrowLeftOutlined,
  CheckCircleFilled
} from '@vicons/antd'
import { FormInst, FormRules } from 'naive-ui'

const router = useRouter()
const loading = ref(false)
const currentStep = ref(0)
const currentError = ref(false)
const codeSent = ref(false)
const codeCooldown = ref(0)

// 邮箱验证表单
const emailFormRef = ref<FormInst | null>(null)
const emailForm = reactive({
  email: '',
  verificationCode: ''
})

// 密码重置表单
const passwordFormRef = ref<FormInst | null>(null)
const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const emailRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  password: [
    { required: true, message: '请设置新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value) => value === passwordForm.password, 
      message: '两次输入的密码不一致', 
      trigger: 'blur' 
    }
  ]
}

// 获取验证码
const getVerificationCode = () => {
  if (codeCooldown.value > 0) return
  
  emailFormRef.value?.validate(['email'], (errors) => {
    if (!errors) {
      loading.value = true
      
      // 模拟发送验证码
      setTimeout(() => {
        loading.value = false
        codeSent.value = true
        codeCooldown.value = 60
        const timer = setInterval(() => {
          codeCooldown.value--
          if (codeCooldown.value <= 0) {
            clearInterval(timer)
          }
        }, 1000)
        
        // TODO: 调用发送验证码API
        console.log('发送验证码到:', emailForm.email)
      }, 1000)
    }
  })
}

// 验证验证码
const verifyCode = () => {
  emailFormRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      
      // 模拟验证
      setTimeout(() => {
        loading.value = false
        currentStep.value = 1
        // TODO: 调用验证验证码API
        console.log('验证码:', emailForm.verificationCode)
      }, 1000)
    }
  })
}

// 重置密码
const resetPassword = () => {
  passwordFormRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      
      // 模拟重置密码
      setTimeout(() => {
        loading.value = false
        currentStep.value = 2
        // TODO: 调用重置密码API
        console.log('新密码:', passwordForm.password)
      }, 1000)
    }
  })
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #ffebee, #ffffff);
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
}

.title {
  flex: 1;
  text-align: center;
  font-size: 24px;
  color: #333;
  margin: 0;
}

.forgot-password-card {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.step-content {
  margin-top: 30px;
}

.verification-code {
  display: flex;
  gap: 12px;
}

.code-btn {
  width: 120px;
  white-space: nowrap;
  font-size: 14px;
}

.action-btn {
  margin-top: 20px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  background-color: #ff6b01;
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 0;
}

.success-message h3 {
  margin: 16px 0 8px;
  font-size: 20px;
  color: #333;
}

.success-message p {
  margin-bottom: 24px;
  color: #666;
}
</style>