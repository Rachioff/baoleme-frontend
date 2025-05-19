<script lang="ts" setup>
import { NCard, NFlex, NAvatar, NLayout, NLayoutSider, NList, NListItem, NButton } from 'naive-ui'
import { computed } from 'vue';
interface Props {
    userId: string
}
const props = defineProps<Props>()

const isCurrentUser = computed(() => {
    return props.userId === '123' // TODO
})

const reload = async () => {
    
}

defineExpose({
    reload
})

</script>
<template>
    <div id="user-view">
        <n-flex id="card-container" vertical align="center">
            <h1 id="title">用户信息</h1>
            <n-card class="card" id="profile-card">
                <n-layout has-sider>
                    <n-layout-sider :width="120">
                        <n-flex vertical justify="center" style="width: 100%; height: 100%;">
                            <n-avatar
                                :size="96"
                            />
                        </n-flex>
                    </n-layout-sider>
                    <n-list style="width: 100%;">
                        <n-list-item>
                            <n-flex justify="space-between">
                                <span class="profile-key">昵称</span>
                                <span class="profile-value">{{ userId }}</span>
                            </n-flex>
                        </n-list-item>
                        <n-list-item>
                            <n-flex justify="space-between">
                                <span class="profile-key">简介</span>
                                <span class="profile-value">{{ userId }}</span>
                            </n-flex>
                        </n-list-item>
                        <n-list-item>
                            <n-flex justify="space-between">
                                <span class="profile-key">身份</span>
                                <span class="profile-value">{{ userId }}</span>
                            </n-flex>
                        </n-list-item>
                        <n-list-item>
                            <n-flex justify="space-between">
                                <span class="profile-key">ID</span>
                                <span class="profile-value">{{ userId }}</span>
                            </n-flex>
                        </n-list-item>
                        <n-list-item>
                            <n-flex justify="space-between">
                                <span class="profile-key">邮箱</span>
                                <span class="profile-value">{{ userId }}</span>
                            </n-flex>
                        </n-list-item>
                        <n-list-item>
                            <n-flex justify="space-between">
                                <span class="profile-key">注册时间</span>
                                <span class="profile-value">{{ userId }}</span>
                            </n-flex>
                        </n-list-item>
                    </n-list>
                </n-layout>
            </n-card>
            <n-button v-if="isCurrentUser">编辑资料</n-button>
        </n-flex>
    </div>
</template>

<style>
.card {
    width: 100%;
    max-width: 600px;
    margin: 8px;
}

#card-container {
    width: 100%;
}

.profile-value {
    opacity: 0.8;
}
</style>