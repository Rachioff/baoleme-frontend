<script setup lang="ts">
import { patchUserProfile } from '@/api/user';
import { useTokenStore } from '@/stores/token';
import { type UserData, type UserProfile, getDisplayUserName } from '@/types/user';
import { NButton, NForm, NFormItem, NCard, NInput, NSelect, NCheckbox, type FormInst, useMessage } from 'naive-ui'
import { ref } from 'vue';

interface Props {
    userId: string
    userData?: UserData
}
const props = defineProps<Props>()
const tokenStore = useTokenStore()
const roleOptions = [
    {
        label: '顾客',
        value: 'customer',
    },
    {
        label: '商家',
        value: 'merchant',
    },
    {
        label: '骑手',
        value: 'rider',
    },
]
if (tokenStore.admin) {
    roleOptions.push({
        label: '管理员',
        value: 'admin',
    })
}

const message = useMessage()

const editName = ref(getDisplayUserName(props.userData?.name, props.userData?.id))
const editDescription = ref(props.userData?.description)
const editRole = ref(props.userData?.role)
const editEmailVisible = ref(props.userData?.emailVisible)
const editCreatedAtVisible = ref(props.userData?.createdAtVisible)

const emit = defineEmits<{
    (e: 'finish', profile: UserProfile): void
}>()

const handleSubmit = async () => {
    try {
        const profile = await patchUserProfile(props.userId, {
            name: editName.value,
            description: editDescription.value,
            role: editRole.value,
            emailVisible: editEmailVisible.value,
            createdAtVisible: editCreatedAtVisible.value,
        })
        emit('finish', profile)
    } catch (e: any) {
        message.error(e.message)
    }
}

</script>
<template>
    <n-card id="container" style="width: 400px;">
        <n-form label-placement="left">
            <n-form-item label="昵称" path="name">
                <n-input v-model:value="editName" />
            </n-form-item>
            <n-form-item label="简介" path="description">
                <n-input v-model:value="editDescription" />
            </n-form-item>
            <n-form-item label="身份" path="role">
                <n-select v-model:value="editRole" :options="roleOptions" />
            </n-form-item>
            <n-form-item path="emailVisible">
                <n-checkbox v-model:checked="editEmailVisible">公开邮箱</n-checkbox>
            </n-form-item>
            <n-form-item path="createdAtVisible">
                <n-checkbox v-model:checked="editCreatedAtVisible">公开注册时间</n-checkbox>
            </n-form-item>
            <n-button style="width: 100%;" type="primary" @click="handleSubmit">提交</n-button>
        </n-form>
    </n-card>
</template>