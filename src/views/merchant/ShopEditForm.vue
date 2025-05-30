<template>
    <div class="shop-edit-form-page">
    <n-page-header :title="pageTitle" @back="handleCancel">
        <template #extra>
        <n-space>
            <n-button @click="handleCancel">取消</n-button>
            <n-button type="primary" @click="handleSave" :loading="isSaving">保存更改</n-button>
        </n-space>
        </template>
    </n-page-header>

    <div v-if="isLoading" class="loading-container">
        <n-spin size="large" />
        <p>正在加载店铺数据...</p>
    </div>

    <n-card v-else-if="formData" class="form-card" :bordered="false">
        <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="top"
        label-width="auto"
        >
        <n-grid :x-gap="24" :y-gap="16" cols="1 s:1 m:2 l:3" responsive="screen">
            <n-form-item-gi :span="3" label="店铺名称" path="name">
            <n-input v-model:value="formData.name" placeholder="请输入店铺名称" />
            </n-form-item-gi>

            <n-form-item-gi :span="3" label="店铺简介" path="description">
            <n-input
                v-model:value="formData.description"
                type="textarea"
                placeholder="请输入店铺简介（可选）"
                :autosize="{ minRows: 3, maxRows: 5 }"
            />
            </n-form-item-gi>

            <n-form-item-gi :span="3" label="店铺头像" path="avatarFile">
            <n-upload
                v-model:file-list="avatarFileList"
                list-type="image-card"
                :max="1"
                accept="image/png, image/jpeg, image/gif, image/webp"
                :custom-request="handleCustomAvatarRequest"
                @change="handleAvatarChange"
                @remove="handleAvatarRemove"
            >
                <n-upload-dragger>
                <div style="margin-bottom: 12px">
                    <n-icon size="48" :depth="3" :component="CloudUploadOutline" />
                </div>
                <n-text style="font-size: 16px">点击或拖动图片到此处</n-text>
                <n-p depth="3" style="margin: 8px 0 0 0">
                    支持 PNG, JPG, GIF, WEBP 格式
                </n-p>
                </n-upload-dragger>
            </n-upload>
            </n-form-item-gi>

            <n-form-item-gi label="开业状态" path="opened">
            <n-switch v-model:value="formData.opened">
                <template #checked>营业中</template>
                <template #unchecked>休息中</template>
            </n-switch>
            </n-form-item-gi>

            <n-form-item-gi label="认证状态 (管理员审核)" path="verified">
            <n-tag :type="formData.verified ? 'success' : 'warning'" round>
                {{ formData.verified ? '已认证' : '未认证' }}
            </n-tag>
            </n-form-item-gi>
            <n-gi :span="1" />

            <n-form-item-gi label="营业开始时间" path="openTimeStart">
            <n-time-picker
                v-model:formatted-value="openTimeDisplay"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="选择开始时间"
                style="width: 100%;"
            />
            </n-form-item-gi>

            <n-form-item-gi label="营业结束时间" path="openTimeEnd">
            <n-time-picker
                v-model:formatted-value="closeTimeDisplay"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="选择结束时间"
                style="width: 100%;"
            />
            </n-form-item-gi>
            <n-gi :span="1" />

            <n-form-item-gi label="配送费用 (元)" path="deliveryPrice">
            <n-input-number v-model:value="formData.deliveryPrice" :min="0" placeholder="例如: 500 (代表5元)" style="width: 100%;" />
            </n-form-item-gi>

            <n-form-item-gi label="起送价格 (元)" path="deliveryThreshold">
            <n-input-number v-model:value="formData.deliveryThreshold" :min="0" placeholder="例如: 2000 (代表20元)" style="width: 100%;" />
            </n-form-item-gi>

            <n-form-item-gi label="最远配送距离 (公里)" path="maximumDistance">
            <n-input-number v-model:value="formData.maximumDistance" :min="0" :precision="1" placeholder="例如: 5.0" style="width: 100%;" />
            </n-form-item-gi>

            <n-form-item-gi :span="3" label="店铺类型" path="categories">
            <n-select
                v-model:value="formData.categories"
                multiple
                filterable
                tag
                placeholder="请选择或输入店铺类型"
                :options="categoryOptions"
                :max-tag-count="5"
            />
            </n-form-item-gi>
        </n-grid>

        <n-divider title-placement="left">店铺地址信息</n-divider>
        <n-grid :x-gap="24" :y-gap="16" cols="1 s:1 m:2 l:3" responsive="screen">
            <n-form-item-gi label="联系人姓名" path="address.name">
                <n-input v-model:value="formData.address.name" placeholder="请输入联系人姓名" />
            </n-form-item-gi>
            <n-form-item-gi label="联系人电话" path="address.tel">
                <n-input v-model:value="formData.address.tel" placeholder="请输入联系人电话" />
            </n-form-item-gi>
            <n-gi :span="1" />


            <n-form-item-gi label="省级行政区" path="address.province">
                <n-input v-model:value="formData.address.province" placeholder="例如：北京市" />
            </n-form-item-gi>
            <n-form-item-gi label="地级行政区" path="address.city">
                <n-input v-model:value="formData.address.city" placeholder="例如：北京市" />
            </n-form-item-gi>
            <n-form-item-gi label="县级行政区" path="address.district">
                <n-input v-model:value="formData.address.district" placeholder="例如：海淀区" />
            </n-form-item-gi>
            <n-form-item-gi label="乡级行政区 (可选)" path="address.town">
                <n-input v-model:value="formData.address.town" placeholder="例如：中关村街道" />
            </n-form-item-gi>
            <n-form-item-gi :span="2" label="详细地址" path="address.address">
                <n-input v-model:value="formData.address.address" placeholder="请输入街道、楼牌号等" />
            </n-form-item-gi>

            <n-form-item-gi label="经度" path="address.coordinate.0">
                <n-input-number v-model:value="formData.address.coordinate[0]" :precision="6" placeholder="例如: 116.397128" style="width: 100%;" />
            </n-form-item-gi>
            <n-form-item-gi label="纬度" path="address.coordinate.1">
                <n-input-number v-model:value="formData.address.coordinate[1]" :precision="6" placeholder="例如: 39.916527" style="width: 100%;" />
            </n-form-item-gi>
        </n-grid>

        </n-form>
    </n-card>
    <n-empty v-else description="无法加载店铺信息进行编辑" style="margin-top: 40px;" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    NPageHeader, NSpace, NButton, NCard, NForm, NFormItemGi, NInput, NInputNumber,
    NSelect, NSpin, NEmpty, NGrid, NAvatar, NSwitch, NTag, NDivider, NTimePicker, // NTimePicker 添加
    NUpload, NUploadDragger, NIcon, NP, useMessage,
    type FormInst, type FormRules, type FormItemRule, type UploadFileInfo, type UploadCustomRequestOptions, type SelectOption
} from 'naive-ui'
import { CloudUploadOutline } from '@vicons/ionicons5'

// --- 数据模型定义 ---
interface 地址 {
    address: string;
    city: string;
    coordinate: [number | null, number | null]; // 允许 null 以便清空或未设置
    district: string;
    name: string;
    province: string;
    tel: string;
    town?: string;
}

interface 店铺资料Editable {
    id: string;
    name: string;
    description: string;
    avatarUrl?: string;
    opened: boolean;
    openTimeStart: number | null;
    openTimeEnd: number | null;
    deliveryPrice: number | null;
    deliveryThreshold: number | null;
    maximumDistance: number | null;
    categories: string[];
    address: 地址;
    verified: boolean;
}

const route = useRoute()
const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)

const shopId = computed(() => route.params.shopId as string)
const formData = ref<店铺资料Editable | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)

// 头像上传
const avatarFileList = ref<UploadFileInfo[]>([])
const newAvatarFile = ref<File | null>(null)

// --- 营业时间 HH:mm 格式的 ref ---
const openTimeDisplay = ref<string | null>(null)
const closeTimeDisplay = ref<string | null>(null)

const pageTitle = computed(() => {
    if (isLoading.value) return '加载中...'
    return formData.value ? `编辑店铺 - ${formData.value.name}` : '编辑店铺信息'
})

const categoryOptions: SelectOption[] = [
    { label: '快餐便当', value: 'fast_food' }, { label: '甜品饮品', value: 'dessert_drink' },
    { label: '川湘菜', value: 'sichuan_hunan' }, { label: '地方小吃', value: 'local_snacks' },
    { label: '日韩料理', value: 'japanese_korean' }, { label: '超市便利', value: 'supermarket' },
];

const mockShopDatabase: Record<string, 店铺资料Editable> = {
    'shop-1': {
    id: 'shop-1', name: '创意轻食坊', description: '健康美味，沙拉与三明治首选。',
    avatarUrl: 'https://picsum.photos/seed/shop-1/200/200',
    opened: true, openTimeStart: 540, openTimeEnd: 1200, // 09:00 - 20:00
    deliveryPrice: 5, deliveryThreshold: 20, maximumDistance: 3.0,
    categories: ['fast_food', 'local_snacks'],
    address: {
        name: '李经理', tel: '13800001111', province: '北京市', city: '北京市', district: '海淀区', town: '中关村街道',
        address: '宇宙中心五道口大厦101室', coordinate: [116.334935, 39.996249]
    },
    verified: true
    },
};

// --- 时间转换工具函数 ---
const minutesToHHMM = (minutes: number | null): string | null => {
    if (minutes === null || minutes < 0 || minutes > 1439) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
};

const hhMMToMinutes = (timeStr: string | null): number | null => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
};


const fetchShopData = async (id: string) => {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = mockShopDatabase[id];
    if (data) {
    formData.value = JSON.parse(JSON.stringify(data));
    // 初始化时间选择器的显示值
    if (formData.value) {
        openTimeDisplay.value = minutesToHHMM(formData.value.openTimeStart);
        closeTimeDisplay.value = minutesToHHMM(formData.value.openTimeEnd);
    }

    if (formData.value && formData.value.avatarUrl) {
        avatarFileList.value = [{
        id: 'current-avatar', name: '当前头像', status: 'finished', url: formData.value.avatarUrl,
        }];
    } else {
        avatarFileList.value = [];
    }
    newAvatarFile.value = null;
    } else {
    message.error('无法找到该店铺数据');
    formData.value = null;
    }
    isLoading.value = false;
};

onMounted(() => {
    if (shopId.value) {
    fetchShopData(shopId.value);
    } else {
    message.error('无效的店铺ID');
    router.replace('/merchant/shops');
    }
});

// 监听 HH:mm 字符串变化，同步更新 formData 中的分钟数
watch(openTimeDisplay, (newTime) => {
    if (formData.value) {
    formData.value.openTimeStart = hhMMToMinutes(newTime);
    }
});
watch(closeTimeDisplay, (newTime) => {
    if (formData.value) {
    formData.value.openTimeEnd = hhMMToMinutes(newTime);
    }
});


const formRules: FormRules = {
    name: [{ required: true, message: '请输入店铺名称', trigger: ['input', 'blur'] }],
    description: [{ required: true, message: '请输入店铺简介', trigger: ['input', 'blur'] }],
    openTimeStart: [ // 验证的是转换后的分钟数
    { type: 'number', required: true, message: '请选择营业开始时间', trigger: ['change', 'blur'] }
    ],
    openTimeEnd: [
    { type: 'number', required: true, message: '请选择营业结束时间', trigger: ['change', 'blur'] },
    { validator: (rule: FormItemRule, value: number) => { // value 是分钟数
        if (formData.value && formData.value.openTimeStart !== null && value !== null && value <= formData.value.openTimeStart) {
            return new Error('结束时间必须晚于开始时间');
        }
        return true;
        },
        trigger: ['change', 'blur'] // 当 openTimeStart 或 openTimeEnd 的分钟数变化时触发
    }
    ],
    deliveryPrice: [{ type: 'number', required: true, message: '请输入配送费用', trigger: ['input', 'blur'] }],
    deliveryThreshold: [{ type: 'number', required: true, message: '请输入起送价格', trigger: ['input', 'blur'] }],
    maximumDistance: [{ type: 'number', required: true, message: '请输入最远配送距离', trigger: ['input', 'blur'] }],
    categories: [{ type: 'array', required: true, min: 1, message: '请至少选择一个店铺类型', trigger: 'change' }],
    address: {
    name: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
    tel: [
        { required: true, message: '请输入联系人电话', trigger: 'blur' },
        { validator: (rule: FormItemRule, value: string) => /^1[3-9]\d{9}$/.test(value) || /^\d{3,4}-\d{7,8}$/.test(value), message: '请输入有效的手机或座机号码', trigger: ['input', 'blur'] }
    ],
    province: [{ required: true, message: '请输入省级行政区', trigger: 'blur' }],
    city: [{ required: true, message: '请输入地级行政区', trigger: 'blur' }],
    district: [{ required: true, message: '请输入县级行政区', trigger: 'blur' }],
    address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
    coordinate: [
        { type: 'array', required: true, validator: (rule: FormItemRule, value: [number | null, number | null]) => {
            if (value === null || value[0] === null || value[1] === null) return new Error('请输入经纬度');
            if (typeof value[0] !== 'number' || typeof value[1] !== 'number') return new Error('经纬度必须是数字');
            if (value[0] < -180 || value[0] > 180) return new Error('经度范围应在 -180 到 180 之间');
            if (value[1] < -90 || value[1] > 90) return new Error('纬度范围应在 -90 到 90 之间');
            return true;
        }, trigger: ['input', 'blur'] },
    ]
    }
};

// ... handleCustomAvatarRequest, handleAvatarChange, handleAvatarRemove 保持不变 ...
const handleCustomAvatarRequest = ({ file, onFinish }: UploadCustomRequestOptions) => {
    console.log('自定义请求处理了文件:', file.name);
    onFinish();
};

const handleAvatarChange = (data: { file: UploadFileInfo, fileList: UploadFileInfo[] }) => {
    if (data.file.status === 'pending' && data.file.file) {
    newAvatarFile.value = data.file.file;
    message.info(`已选择新头像: ${data.file.name}`);
    }
    avatarFileList.value = data.fileList.slice(-1);
};

const handleAvatarRemove = () => {
    newAvatarFile.value = null;
    if (formData.value) formData.value.avatarUrl = undefined;
    avatarFileList.value = [];
    message.info('头像已移除');
    return true;
};

const handleSave = (e: MouseEvent) => {
    e.preventDefault();
    // 在验证前，确保 formData 中的 openTimeStart/End 是最新的分钟数
    if (formData.value) {
        formData.value.openTimeStart = hhMMToMinutes(openTimeDisplay.value);
        formData.value.openTimeEnd = hhMMToMinutes(closeTimeDisplay.value);
    }

    formRef.value?.validate(async (errors) => {
    if (!errors && formData.value) {
        isSaving.value = true;
        console.log('待保存的店铺数据:', JSON.parse(JSON.stringify(formData.value)));
        if (newAvatarFile.value) {
        console.log('新头像文件待上传:', newAvatarFile.value.name, newAvatarFile.value.type);
        formData.value.avatarUrl = `https://picsum.photos/seed/${formData.value.id}-${Date.now()}/200/200`;
        }
        
        if (mockShopDatabase[formData.value.id]) {
        mockShopDatabase[formData.value.id] = JSON.parse(JSON.stringify(formData.value));
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        isSaving.value = false;
        message.success('店铺信息保存成功！');
        router.push(`/merchant/shops/${shopId.value}/detail`);
    } else {
        message.error('请检查表单输入项！');
    }
    });
};

const handleCancel = () => {
    router.back();
};

</script>

<style scoped>
.shop-edit-form-page {
    padding: 16px;
    background-color: #f8f8f8;
}
.n-page-header {
    background-color: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.form-card {
    padding: 24px;
    border-radius: 8px;
}
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    color: var(--text-color2);
}
.loading-container p {
    margin-top: 10px;
}
</style>