<template>
    <div class="shop-detail-page">
    <n-page-header :title="shop?.name || '店铺详情'" @back="goBack">
        <template #avatar>
        <n-avatar v-if="shop?.avatarUrl" :src="shop.avatarUrl" round :size="40" object-fit="cover" />
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
        <n-grid :x-gap="20" :y-gap="24" cols="1 s:1 m:2" responsive="screen">
            <n-gi>
            <n-card title="基本信息与状态" class="detail-card" :segmented="{ content: true }">
                <n-descriptions label-placement="left" bordered :column="1" size="small">
                <n-descriptions-item label="店铺ID">{{ shop.id }}</n-descriptions-item>
                <n-descriptions-item label="店铺名称">{{ shop.name }}</n-descriptions-item>
                <n-descriptions-item label="开业状态">
                    <n-tag :type="shop.opened ? 'success' : 'error'" round>
                    {{ shop.opened ? '营业中' : '休息中' }}
                    </n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="认证状态">
                    <n-tag :type="shop.verified ? 'success' : 'warning'" round>
                    {{ shop.verified ? '已认证' : '未认证' }}
                    </n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="营业时间 (每日)">
                    <span v-if="shop.openTimeStart !== null && shop.openTimeEnd !== null">
                    {{ minutesToHHMM(shop.openTimeStart) }} - {{ minutesToHHMM(shop.openTimeEnd) }}
                    </span>
                    <span v-else>未设置</span>
                </n-descriptions-item>
                <n-descriptions-item label="店铺简介">
                    <n-ellipsis expand-trigger="click" line-clamp="3" :tooltip="{ width: 300 }">
                    {{ shop.description || '店主很懒，什么都没留下...' }}
                    </n-ellipsis>
                </n-descriptions-item>
                </n-descriptions>
            </n-card>
            </n-gi>

            <n-gi>
            <n-card title="配送与费用" class="detail-card" :segmented="{ content: true }">
                <n-descriptions label-placement="left" bordered :column="1" size="small">
                <n-descriptions-item label="配送费用">
                    {{ formatPrice(shop.deliveryPrice) }}
                </n-descriptions-item>
                <n-descriptions-item label="起送价格">
                    {{ formatPrice(shop.deliveryThreshold) }}
                </n-descriptions-item>
                <n-descriptions-item label="最远配送距离">
                    {{ shop.maximumDistance !== null ? `${shop.maximumDistance} 公里` : '未设置' }}
                </n-descriptions-item>
                <n-descriptions-item label="店铺类型">
                    <n-space v-if="shop.categories && shop.categories.length > 0">
                        <n-tag v-for="cat in shop.categories" :key="cat" type="info" round>
                        {{ formatCategory(cat) }}
                        </n-tag>
                    </n-space>
                    <span v-else>未设置</span>
                </n-descriptions-item>
                </n-descriptions>
            </n-card>
            </n-gi>

            <n-gi :span="2">
            <n-card title="地址与联系方式" class="detail-card" :segmented="{ content: true }">
                <n-descriptions label-placement="left" bordered :column="1" size="small">
                <n-descriptions-item label="联系人">{{ shop.address.name }}</n-descriptions-item>
                <n-descriptions-item label="联系电话">{{ shop.address.tel }}</n-descriptions-item>
                <n-descriptions-item label="省份">{{ shop.address.province }}</n-descriptions-item>
                <n-descriptions-item label="城市">{{ shop.address.city }}</n-descriptions-item>
                <n-descriptions-item label="区/县">{{ shop.address.district }}</n-descriptions-item>
                <n-descriptions-item v-if="shop.address.town" label="街道/乡镇">
                    {{ shop.address.town }}
                </n-descriptions-item>
                <n-descriptions-item label="详细地址">{{ shop.address.address }}</n-descriptions-item>
                <n-descriptions-item label="坐标 (经度, 纬度)">
                    {{ shop.address.coordinate[0] }}, {{ shop.address.coordinate[1] }}
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    NPageHeader, NSpace, NButton, NIcon, NAvatar, NCard, NDescriptions,
    NDescriptionsItem, NSpin, NEmpty, NTag, NGrid, NGi, NEllipsis,
    NTabs, NTabPane, NText, useMessage
} from 'naive-ui'
import {
    CreateOutline, StorefrontOutline, LocationOutline, CallOutline, StarOutline, // StarOutline 可以替换为其他相关图标
    // ArrowBackOutline // n-page-header自带返回
} from '@vicons/ionicons5'
// import { format } from 'date-fns' // 如果需要更复杂的日期格式化

// --- 复用 ShopEditForm.vue 中的数据模型定义 ---
interface 地址 {
    address: string;
    city: string;
    coordinate: [number | null, number | null];
    district: string;
    name: string;
    province: string;
    tel: string;
    town?: string;
}

// 店铺资料接口 (与 ShopEditForm.vue 中的 店铺资料Editable 类似，但这里是展示用)
interface 店铺资料 {
    id: string;
    name: string;
    description: string;
    avatarUrl?: string; // 注意：这里是 avatarUrl，对应编辑表单的字段
    opened: boolean;
    openTimeStart: number | null;
    openTimeEnd: number | null;
    deliveryPrice: number | null;
    deliveryThreshold: number | null;
    maximumDistance: number | null;
    categories: string[];
    address: 地址;
    verified: boolean;
    // 如果还有其他只读字段，如评分、创建时间等，可以加回来
    rating?: number; // 假设有评分
    createdAt?: string; // 假设有创建时间
}


const route = useRoute()
const router = useRouter()
const message = useMessage()

const shopId = computed(() => route.params.shopId as string)
const shop = ref<店铺资料 | null>(null) // 使用更新后的接口
const isLoading = ref(true)
const currentTab = ref('overview')

// --- 复用 ShopEditForm.vue 中的模拟数据库和类型选项 ---
const mockShopDatabaseFromEdit: Record<string, 店铺资料> = { // 类型改为 店铺资料
    'shop-1': {
    id: 'shop-1', name: '创意轻食坊', description: '健康美味，沙拉与三明治首选。',
    avatarUrl: 'https://picsum.photos/seed/shop-1/200/200',
    opened: true, openTimeStart: 540, openTimeEnd: 1200,
    deliveryPrice: 500, deliveryThreshold: 2000, maximumDistance: 3.0,
    categories: ['fast_food', 'local_snacks'],
    address: {
        name: '李经理', tel: '13800001111', province: '北京市', city: '北京市', district: '海淀区', town: '中关村街道',
        address: '宇宙中心五道口大厦101室', coordinate: [116.334935, 39.996249]
    },
    verified: true, rating: 4.8, createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    'shop-2': {
    id: 'shop-2', name: '甜蜜角落咖啡馆', description: '手冲咖啡与精致甜点。',
    avatarUrl: 'https://picsum.photos/seed/shop-2/200/200',
    opened: false, openTimeStart: 600, openTimeEnd: 1080,
    deliveryPrice: 300, deliveryThreshold: 1500, maximumDistance: 2.0,
    categories: ['dessert_drink'],
    address: {
        name: '王老板', tel: '13911112222', province: '上海市', city: '上海市', district: '徐汇区',
        address: '衡山路123号', coordinate: [121.452323, 31.209175]
    },
    verified: false, rating: 4.2, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
};

// 模拟店铺类型选项 (与 ShopEditForm.vue 中保持一致，用于显示)
const categoryDisplayMap: Record<string, string> = {
    'fast_food': '快餐便当',
    'dessert_drink': '甜品饮品',
    'sichuan_hunan': '川湘菜',
    'local_snacks': '地方小吃',
    'japanese_korean': '日韩料理',
    'supermarket': '超市便利',
};


const fetchShopDetails = async (id: string) => {
    isLoading.value = true;
    console.log(`详情页: 模拟获取店铺 ${id} 的详细信息...`);
    await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟

    // 尝试从编辑表单的模拟数据库获取最新数据（如果它被更新了）
    // 注意：这仅用于演示目的，实际项目中应有统一数据源或状态管理
    const potentiallyUpdatedShop = (window as any).mockShopDatabaseForEdit?.[id]; // 假设编辑表单的mockDB暴露到window
    const data = potentiallyUpdatedShop || mockShopDatabaseFromEdit[id];


    if (data) {
    shop.value = JSON.parse(JSON.stringify(data)); // 深拷贝
    } else {
    shop.value = null;
    message.error('店铺信息加载失败或店铺不存在');
    }
    isLoading.value = false;
};

// --- 复用时间转换函数 ---
const minutesToHHMM = (minutes: number | null): string => {
    if (minutes === null || minutes < 0 || minutes > 1439) return '未设置';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
};

// 价格格式化 (分 -> 元)
const formatPrice = (priceInCents: number | null): string => {
    if (priceInCents === null || typeof priceInCents !== 'number') return '未设置';
    return `¥${(priceInCents / 100).toFixed(2)}`;
};

// 格式化分类显示
const formatCategory = (categoryKey: string): string => {
    return categoryDisplayMap[categoryKey] || categoryKey;
}


onMounted(() => {
    if (shopId.value) {
    fetchShopDetails(shopId.value);
    } else {
    message.error('无效的店铺ID');
    isLoading.value = false;
    }
});

// 监听路由参数变化，如果 shopId 变了，重新加载数据
watch(() => route.params.shopId, (newId) => {
    if (newId && typeof newId === 'string') {
        fetchShopDetails(newId);
        currentTab.value = 'overview'; // 重置 Tab
    }
});


const goBack = () => {
    router.back();
};

const handleEditShop = () => {
    if (!shop.value) return;
    router.push(`/merchant/shops/edit/${shop.value.id}`);
};

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
    margin-top: 20px;
}

.detail-card {
    margin-bottom: 20px; /* 在Grid布局中，y-gap会处理垂直间距，这里可以移除或保留作为独立卡片的间距 */
}

.n-descriptions .n-descriptions-item-label {
    font-weight: 500; /* 标签加粗一点点 */
    color: var(--n-text-color-secondary);
}
</style>