<template>
    <div class="shop-detail-page">
    <n-page-header :title="shop?.name || '店铺详情'" @back="goBack">
        <template #avatar>
        <n-avatar v-if="shop?.avatar" :src="shop.avatar" round :size="40" />
        <n-icon v-else :component="StorefrontOutline" :size="32" />
        </template>
        <template #extra>
        <n-space>
            <n-button type="primary" @click="handleEditShop">
            <template #icon><n-icon :component="CreateOutline" /></template>
            编辑店铺信息
            </n-button>
            </n-space>
        </template>
        <template #footer v-if="shop">
        <n-tabs v-model:value="currentTab" type="line" animated>
            <n-tab-pane name="overview" tab="店铺概览">
            </n-tab-pane>
            <n-tab-pane name="products" tab="商品管理">
            <n-text>商品管理功能开发中...</n-text>
            </n-tab-pane>
            <n-tab-pane name="orders" tab="订单处理">
            <n-text>订单处理功能开发中...</n-text>
            </n-tab-pane>
            <n-tab-pane name="settings" tab="店铺设置">
            <n-text>店铺设置功能开发中...</n-text>
            </n-tab-pane>
        </n-tabs>
        </template>
    </n-page-header>

    <div v-if="isLoading" class="loading-container">
        <n-spin size="large" />
        <p>正在加载店铺信息...</p>
    </div>

    <div v-else-if="!shop" class="empty-container">
        <n-empty description="未能找到该店铺信息。" size="huge" />
    </div>

    <div v-else class="shop-content-container">
        <div v-if="currentTab === 'overview'">
        <n-grid :x-gap="20" :y-gap="20" cols="1 s:1 m:2" responsive="screen">
            <n-gi>
            <n-card title="基本信息" class="detail-card">
                <template #header-extra>
                <n-tag :type="getShopStatusType(shop.status)">{{ formatShopStatus(shop.status) }}</n-tag>
                </template>
                <n-descriptions label-placement="top" bordered :column="1">
                <n-descriptions-item label="店铺名称">
                    {{ shop.name }}
                </n-descriptions-item>
                <n-descriptions-item label="店铺ID">
                    {{ shop.id }}
                </n-descriptions-item>
                <n-descriptions-item label="店铺地址">
                    <n-icon :component="LocationOutline" /> {{ shop.address }}
                </n-descriptions-item>
                <n-descriptions-item label="联系电话">
                    <n-icon :component="CallOutline" /> {{ shop.phone || '暂未提供' }}
                </n-descriptions-item>
                <n-descriptions-item label="平均评分">
                    <n-rate readonly :default-value="shop.rating" size="small" /> ({{ shop.rating }})
                </n-descriptions-item>
                <n-descriptions-item label="创建日期">
                    {{ formatDate(shop.createdAt) }}
                </n-descriptions-item>
                </n-descriptions>
            </n-card>
            </n-gi>

            <n-gi>
            <n-card title="营业信息" class="detail-card">
                <n-descriptions label-placement="top" bordered :column="1">
                <n-descriptions-item label="店铺简介">
                    <n-ellipsis expand-trigger="click" line-clamp="3" :tooltip="{ width: 300 }">
                    {{ shop.description || '店主很懒，什么都没留下...' }}
                    </n-ellipsis>
                </n-descriptions-item>
                <n-descriptions-item label="营业时间">
                    <div v-if="shop.businessHours && Object.keys(shop.businessHours).length > 0">
                    <n-tag v-for="(time, day) in shop.businessHours" :key="day" type="info" style="margin-right: 5px; margin-bottom: 5px;">
                        {{ formatDay(day) }}: {{ time }}
                    </n-tag>
                    </div>
                    <span v-else>暂未设置</span>
                </n-descriptions-item>
                </n-descriptions>
            </n-card>
            </n-gi>
        </n-grid>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    NPageHeader, NSpace, NButton, NIcon, NAvatar, NCard, NDescriptions,
    NDescriptionsItem, NSpin, NEmpty, NTag, NRate, NGrid, NGi, NEllipsis,
    NTabs, NTabPane, NText, useMessage
} from 'naive-ui'
import {
    CreateOutline, StorefrontOutline, LocationOutline, CallOutline, StarOutline,
    ArrowBackOutline // for goBack if not using n-page-header's default
} from '@vicons/ionicons5'
import { format } from 'date-fns' // 用于日期格式化

// 店铺数据接口定义
interface Shop {
    id: string
    name: string
    address: string
    rating: number
    description?: string
    avatar?: string
    phone?: string
    businessHours?: Record<string, string> // 例如: { "monday": "09:00-21:00", "tuesday": "09:00-21:00" }
    status?: string // 例如: 'active', 'pending_review', 'closed_temporarily', 'closed_permanently'
    createdAt?: string
}

const route = useRoute()
const router = useRouter()
const message = useMessage()

const shopId = computed(() => route.params.shopId as string)
const shop = ref<Shop | null>(null)
const isLoading = ref(true)
const currentTab = ref('overview') // 默认选中的 Tab

// 模拟的店铺数据，实际应从API获取
const mockShopDatabase: Record<string, Shop> = {
    'shop-1': {
    id: 'shop-1',
    name: '我的美味店铺 1',
    address: '创意路 1 号',
    rating: 4.5,
    description: '这是一家充满特色和美味的店铺，提供各种令人垂涎的佳肴。店铺 1 的目标是为每一位顾客带来难忘的用餐体验。我们注重食材的新鲜和菜品的创新，希望您能在这里找到心仪的美食。',
    avatar: 'https://picsum.photos/seed/shop-1/200/200',
    phone: '13800138001',
    businessHours: { monday: '09:00 - 21:00', tuesday: '09:00 - 21:00', wednesday: '09:00 - 21:00', thursday: '09:00 - 21:00', friday: '09:00 - 23:00', saturday: '10:00 - 23:00', sunday: '10:00 - 20:00' },
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30天前
    },
    'shop-2': {
    id: 'shop-2',
    name: '我的美味店铺 2',
    address: '创意路 2 号',
    rating: 4.2,
    description: '店铺 2 以其独特的家常菜闻名，每一道菜都充满了温馨的味道。',
    avatar: 'https://picsum.photos/seed/shop-2/200/200',
    phone: '13900139002',
    businessHours: { monday: '10:00 - 20:00', tuesday: '10:00 - 20:00', wednesday: '10:00 - 20:00', thursday: '10:00 - 20:00', friday: '10:00 - 22:00' },
    status: 'pending_review',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5天前
    },
    // 可以按需添加更多模拟数据，确保 ShopList.vue 中生成的 ID 能对应上
}

const fetchShopDetails = async (id: string) => {
    isLoading.value = true
    console.log(`模拟获取店铺 ${id} 的详细信息...`)
    await new Promise(resolve => setTimeout(resolve, 700)) // 模拟网络延迟

    const foundShop = mockShopDatabase[id] || Object.values(mockShopDatabase).find(s => s.id.startsWith(id))

    if (foundShop) {
    shop.value = foundShop
    } else {
    shop.value = null
    message.error('店铺信息加载失败或店铺不存在')
    }
    isLoading.value = false
}

onMounted(() => {
    if (shopId.value) {
    fetchShopDetails(shopId.value)
    } else {
    message.error('无效的店铺ID')
    isLoading.value = false
    // router.push('/merchant/shops'); // 或者跳转回列表页
    }
})

const goBack = () => {
    router.back() // 或 router.push('/merchant/shops')
}

const handleEditShop = () => {
    if (!shop.value) return
    message.info(`功能开发中：编辑店铺 - ${shop.value.name}`)
    // router.push(`/merchant/shops/edit/${shop.value.id}`)
}

// 工具函数 - 格式化日期
const formatDate = (dateString?: string) => {
    if (!dateString) return '未知'
    try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
    } catch (e) {
    return dateString // 解析失败则返回原始字符串
    }
}

// 工具函数 - 格式化星期
const formatDay = (dayKey: string) => {
    const dayMap: Record<string, string> = {
    monday: '周一', tuesday: '周二', wednesday: '周三', thursday: '周四',
    friday: '周五', saturday: '周六', sunday: '周日',
    }
    return dayMap[dayKey.toLowerCase()] || dayKey
}

// 工具函数 - 获取店铺状态对应的标签类型
const getShopStatusType = (status?: string): ('success' | 'warning' | 'error' | 'info' | 'default') => {
    switch (status) {
    case 'active': return 'success'
    case 'pending_review': return 'warning'
    case 'closed_temporarily': return 'info'
    case 'closed_permanently': return 'error'
    default: return 'default'
    }
}
// 工具函数 - 格式化店铺状态显示文本
const formatShopStatus = (status?: string): string => {
    switch (status) {
    case 'active': return '营业中'
    case 'pending_review': return '审核中'
    case 'closed_temporarily': return '暂停营业'
    case 'closed_permanently': return '已关闭'
    default: return status || '未知状态'
    }
}

</script>

<style scoped>
.shop-detail-page {
    padding: 16px;
    background-color: #f8f8f8;
}

.n-page-header {
    background-color: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    /* margin-bottom: 20px; */ /* Tabs 作为 footer 时，这个 mb 可以去掉或调整 */
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.loading-container, .empty-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding: 20px;
    color: var(--text-color2);
}
.loading-container p {
    margin-top: 10px;
}

.shop-content-container {
    margin-top: 20px; /* 与 PageHeader 的 Tabs 分隔开 */
}

.detail-card {
    margin-bottom: 20px; /* 如果有多个卡片纵向排列 */
}
.n-descriptions-item-label {
    font-weight: bold;
}
</style>