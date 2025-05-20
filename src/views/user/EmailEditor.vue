<script setup lang="ts">
import { updateEmail } from '@/api/auth';
import { NCard, NForm, NFormItem, NInput, NButton, type FormRules, c, useMessage, type FormInst } from 'naive-ui'
import { ref } from 'vue';


const editNewEmail = ref('')
const loginRules: FormRules = {
    newEmail: [
        { required: true, type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
}
const emit = defineEmits<{
    (e: 'finish'): void
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)

const handleSubmit = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (errors) {
            return
        }
        try {
            await updateEmail(editNewEmail.value)
            emit('finish')
        } catch (e: any) {
            message.error(e.message)
        }
    })
}

</script>
<template>
    <n-card id="container" style="width: 400px;">
        <n-form label-placement="left" ref="formRef" :rules="loginRules">
            <n-form-item label="新邮箱" path="newEmail">
                <n-input v-model:value="editNewEmail" />
            </n-form-item>
            <n-button style="width: 100%;" type="primary" @click="handleSubmit">提交</n-button>
        </n-form>
    </n-card>
</template>