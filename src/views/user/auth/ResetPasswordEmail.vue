<template>
    <n-card title="重设密码" style="max-width: 400px; margin: auto; margin-top: 50px;">
    <n-form ref="formRef" :model="formValue" :rules="rules" @submit.prevent="handleResetPassword">
        <n-form-item-row label="新密码" path="newPassword">
        <n-input
            type="password"
            v-model:value="formValue.newPassword"
            placeholder="请输入新密码 (至少6位)"
            show-password-on="click"
        />
        </n-form-item-row>
        <n-form-item-row label="确认新密码" path="confirmPassword">
        <n-input
            type="password"
            v-model:value="formValue.confirmPassword"
            placeholder="请再次输入新密码"
            show-password-on="click"
            :disabled="!formValue.newPassword"
        />
        </n-form-item-row>
        <n-button type="primary" attr-type="submit" block :loading="loading">
        确认重设密码
        </n-button>
    </n-form>
    </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    NCard,
    NForm,
    NFormItemRow,
    NInput,
    NButton,
    useMessage,
    type FormInst,
    type FormRules,
    type FormItemRule
} from 'naive-ui';
import { resetPassword, type ResetPasswordRequest } from '@/api/auth';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const formValue = ref({
    newPassword: '',
    confirmPassword: ''
});
const token = ref<string | null>(null);

onMounted(() => {
    const routeToken = route.params.token;
    if (typeof routeToken === 'string' && routeToken) {
    token.value = routeToken;
    } else {
    message.error('无效的重置链接或令牌已过期。');
    router.push('/login');
    }
});

const validatePasswordSame = (rule: FormItemRule, value: string): boolean => {
    return value === formValue.value.newPassword;
};

const rules: FormRules = {
    newPassword: [
    {
        required: true,
        message: '请输入新密码',
        trigger: ['input', 'blur']
    },
    {
        min: 6,
        message: '密码长度不能少于6位',
        trigger: ['input', 'blur']
    }
    ],
    confirmPassword: [
    {
        required: true,
        message: '请再次输入新密码',
        trigger: ['input', 'blur']
    },
    {
        validator: (rule, value) => {
        if (value !== formValue.value.newPassword) {
            return new Error('两次输入的密码不一致');
        }
        return true;
        },
        trigger: ['input', 'blur']
    }
    ]
};

const handleResetPassword = () => {
    formRef.value?.validate(async (errors) => {
    if (!errors) {
        if (!token.value) {
        message.error('令牌无效，无法重设密码。');
        return;
        }
        loading.value = true;
        try {
        await resetPassword({
            token: token.value,
            newPassword: formValue.value.newPassword
        } as ResetPasswordRequest);
        message.success('密码重设成功！现在您可以使用新密码登录。');
        router.push({ name: 'Login' }); // 重设成功后跳转到登录页
        } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            message.error(`重设密码失败: ${error.response.data.message}`);
        } else {
            message.error('重设密码失败，可能是链接已过期或无效，请重试。');
        }
        console.error('重设密码错误:', error);
        } finally {
        loading.value = false;
        }
    } else {
        console.log('表单验证失败:', errors);
        message.error('请正确填写表单');
    }
    });
};
</script>

<style scoped>

</style>