<!-- src/views/user/auth/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-header">
      <!-- 后续替换logo？ -->
      <!-- <img src="@/assets/logo.png" alt="饱了么" class="logo"> -->
      <h1 class="title">饱了么</h1>
      <p class="slogan">让校园生活更便捷</p>
    </div>
    
    <n-card class="login-card">
      <n-tabs type="line" animated>
        <n-tab-pane name="login" tab="登录">
          <n-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-placement="left"
          >
            <n-form-item path="email" label="邮箱">
              <n-input 
                v-model:value="loginForm.email" 
                placeholder="请输入邮箱"
              >
                <template #prefix>
                  <n-icon><mail-outlined /></n-icon>
                </template>
              </n-input>
            </n-form-item>
            
            <n-form-item path="password" label="密码">
              <n-input 
                v-model:value="loginForm.password" 
                type="password" 
                placeholder="请输入密码"
                show-password-on="click"
              >
                <template #prefix>
                  <n-icon><lock-outlined /></n-icon>
                </template>
              </n-input>
            </n-form-item>
            
            <div class="action-area">
              <n-checkbox v-model:checked="rememberMe">
                记住密码
              </n-checkbox>
              <n-button text class="forgot-btn">
                忘记密码
              </n-button>
            </div>
            
            <n-button 
              type="primary" 
              block 
              @click="handleLogin"
              :loading="loading"
              class="submit-btn"
            >
              登录
            </n-button>
          </n-form>
        </n-tab-pane>
        
        <n-tab-pane name="register" tab="注册">
          <n-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-placement="left"
          >
            <n-form-item path="email" label="邮箱">
              <n-input 
                v-model:value="registerForm.email" 
                placeholder="请输入邮箱"
              >
                <template #prefix>
                  <n-icon><mail-outlined /></n-icon>
                </template>
              </n-input>
            </n-form-item>
            
            <n-form-item path="verificationCode" label="验证码">
              <div class="verification-code">
                <n-input 
                  v-model:value="registerForm.verificationCode" 
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
            
            <n-form-item path="password" label="密码">
              <n-input 
                v-model:value="registerForm.password" 
                type="password" 
                placeholder="请设置密码（6-20位字母和数字）"
                show-password-on="click"
              >
                <template #prefix>
                  <n-icon><lock-outlined /></n-icon>
                </template>
              </n-input>
            </n-form-item>
            
            <n-form-item path="confirmPassword" label="确认密码">
              <n-input 
                v-model:value="registerForm.confirmPassword" 
                type="password" 
                placeholder="请确认密码"
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
              @click="handleRegister"
              :loading="loading"
              class="submit-btn"
            >
              注册
            </n-button>
          </n-form>
        </n-tab-pane>
      </n-tabs>
      
      <div class="other-login">
        <div class="divider">
          <span class="line"></span>
          <span class="text">其他登录方式</span>
          <span class="line"></span>
        </div>
        <div class="icons">
          <n-button quaternary circle class="icon-btn">
            <n-icon size="24"><wechat-filled /></n-icon>
          </n-button>
          <n-button quaternary circle class="icon-btn">
            <n-icon size="24"><alipay-circle-filled /></n-icon>
          </n-button>
        </div>
      </div>
    </n-card>
    
    <div class="agreement">
      登录/注册即表示您已同意
      <n-button text class="link">《用户服务协议》</n-button>
      和
      <n-button text class="link">《隐私政策》</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MailOutlined, 
  LockOutlined, 
  WechatFilled, 
  AlipayCircleFilled 
} from '@vicons/antd'
import { FormInst, FormRules } from 'naive-ui'

const router = useRouter()
const loading = ref(false)
const rememberMe = ref(false)
const codeCooldown = ref(0)

// 登录表单
const loginFormRef = ref<FormInst | null>(null)
const loginForm = reactive({
  email: '',
  password: ''
})

// 注册表单
const registerFormRef = ref<FormInst | null>(null)
const registerForm = reactive({
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ]
}

const registerRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value) => value === registerForm.password, 
      message: '两次输入的密码不一致', 
      trigger: 'blur' 
    }
  ]
}

// 获取验证码
const getVerificationCode = () => {
  if (codeCooldown.value > 0) return
  
  registerFormRef.value?.validate(['email'], (errors) => {
    if (!errors) {
      // 模拟发送验证码
      codeCooldown.value = 60
      const timer = setInterval(() => {
        codeCooldown.value--
        if (codeCooldown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
      
      // TODO: 调用发送验证码API
      console.log('发送验证码到:', registerForm.email)
    }
  })
}

// 登录
const handleLogin = () => {
  loginFormRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      
      // 模拟登录请求
      setTimeout(() => {
        loading.value = false
        console.log('登录信息:', loginForm)
        router.push('/user/home')
      }, 1000)
    }
  })
}

// 注册
const handleRegister = () => {
  registerFormRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      
      // 模拟注册请求
      setTimeout(() => {
        loading.value = false
        console.log('注册信息:', registerForm)
        router.push('/user/home')
      }, 1000)
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #ffebee, #ffffff);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  margin-top: 40px;
}

.logo {
  width: 80px;
  height: 80px;
}

.title {
  font-size: 28px;
  color: #ff6b01;
  margin: 10px 0 5px;
}

.slogan {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.action-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.forgot-btn {
  font-size: 14px;
  color: #999;
}

.submit-btn {
  margin-top: 10px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  background-color: #ff6b01;
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

.other-login {
  margin-top: 24px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.line {
  flex: 1;
  height: 1px;
  background-color: #eee;
}

.text {
  padding: 0 12px;
  font-size: 14px;
  color: #999;
}

.icons {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.icon-btn {
  width: 48px;
  height: 48px;
}

.agreement {
  margin-top: 20px;
  font-size: 12px;
  color: #999;
  text-align: center;
}

.link {
  font-size: 12px;
  color: #ff6b01;
}
</style>