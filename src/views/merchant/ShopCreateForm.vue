<template>
    <div class="shop-create-form-page">
    <n-page-header title="创建新店铺" @back="handleCancel">
        <template #extra>
        <n-space>
            <n-button @click="handleCancel">取消</n-button>
            <n-button type="primary" @click="handleSave" :loading="isSaving">创建店铺</n-button>
        </n-space>
        </template>
    </n-page-header>

    <n-card class="form-card" :bordered="false">
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
                placeholder="请输入店铺简介"
                :autosize="{ minRows: 3, maxRows: 5 }"
            />
            </n-form-item-gi>

            <n-form-item-gi :span="3" label="店铺头像（支持 PNG, JPG, GIF, WEBP 格式）" path="avatarFile">
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
                <n-p depth="3" style="margin: 8px 0 0 0">  
                </n-p>
                </n-upload-dragger>
            </n-upload>
            </n-form-item-gi>

            <n-form-item-gi label="开业状态" path="opened">
            <n-switch v-model:value="formData.opened">
                <template #checked>立即开业</template>
                <template #unchecked>暂不开业</template>
            </n-switch>
            </n-form-item-gi>
            <n-gi :span="2" /> <n-form-item-gi label="营业开始时间" path="openTimeStart">
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
            <n-gi :span="1" /> <n-form-item-gi label="配送费用 (分)" path="deliveryPrice">
            <n-input-number v-model:value="formData.deliveryPrice" :min="0" placeholder="例如: 500 (代表5元)" style="width: 100%;" />
            </n-form-item-gi>

            <n-form-item-gi label="起送价格 (分)" path="deliveryThreshold">
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

            <n-form-item-gi label="经度 (通过定位获取)" path="address.coordinate.0">
                <n-input-number 
                  v-model:value="formData.address.coordinate[0]" 
                  :precision="6" 
                  placeholder="请点击下方按钮获取" 
                  style="width: 100%;" 
                  disabled />
            </n-form-item-gi>
            <n-form-item-gi label="纬度 (通过定位获取)" path="address.coordinate.1">
                <n-input-number 
                  v-model:value="formData.address.coordinate[1]" 
                  :precision="6" 
                  placeholder="请点击下方按钮获取" 
                  style="width: 100%;" 
                  disabled />
            </n-form-item-gi>
            <n-form-item-gi :span="3" style="display: flex; flex-direction: column; align-items: flex-start;">
                 <n-button @click="fetchCurrentLocation" :loading="isLocating" type="default" :block="false" style="margin-bottom: 5px;">
                    <template #icon><n-icon :component="LocateOutline" /></template>
                    获取店铺当前经纬度
                </n-button>
                <n-text v-if="geolocationError" type="error" style="font-size: 12px;">
                    定位失败: {{ geolocationError.message }}
                </n-text>
                <n-text v-else-if="formData.address.coordinate[0] !== null && formData.address.coordinate[1] !== null" :depth="3" style="font-size: 12px;">
                    已获取坐标。如需更改，请重新定位。
                </n-text>
                 <n-text v-else :depth="3" style="font-size: 12px;">
                    点击按钮获取店铺的精确地理位置。
                </n-text>
            </n-form-item-gi>
        </n-grid>

        </n-form>
    </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
    NPageHeader, NSpace, NButton, NCard, NForm, NFormItemGi, NInput, NInputNumber,
    NSelect, NSwitch, NDivider, NTimePicker,
    NUpload, NUploadDragger, NIcon, NP, useMessage,
    type FormInst, type FormRules, type FormItemRule, type UploadFileInfo, type UploadCustomRequestOptions, type SelectOption
} from 'naive-ui'
import { CloudUploadOutline, LocateOutline } from '@vicons/ionicons5'
import { useGeolocation, type GeolocationError } from '@/composables/useGeolocation';
import { v4 as uuidv4 } from 'uuid'; // 用于生成模拟 ID

// --- 数据模型定义 (与 ShopEditForm.vue 一致) ---
interface 地址 {
    address: string; city: string; coordinate: [number | null, number | null]; district: string;
    name: string; province: string; tel: string; town?: string;
}
interface 店铺资料Creatable { // 用于创建，ID 由后端生成或在保存时生成
    name: string; description: string; avatarUrl?: string; opened: boolean;
    openTimeStart: number | null; openTimeEnd: number | null; deliveryPrice: number | null;
    deliveryThreshold: number | null; maximumDistance: number | null; categories: string[];
    address: 地址;
    // verified 在创建时通常默认为 false，由管理员后续审核
}

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const isSaving = ref(false)

// 初始化表单数据
const initialAddress: 地址 = {
    name: '', tel: '', province: '', city: '', district: '', town: '',
    address: '', coordinate: [null, null]
};
const formData = ref<店铺资料Creatable>({
    name: '', description: '', opened: true, avatarUrl: undefined,
    openTimeStart: null, openTimeEnd: null, deliveryPrice: 0,
    deliveryThreshold: 0, maximumDistance: 3.0, categories: [],
    address: { ...initialAddress }
});

// 头像上传
const avatarFileList = ref<UploadFileInfo[]>([])
const newAvatarFile = ref<File | null>(null)

// 营业时间 HH:mm 格式的 ref
const openTimeDisplay = ref<string | null>(null)
const closeTimeDisplay = ref<string | null>(null)

const categoryOptions: SelectOption[] = [
    { label: '快餐便当', value: 'fast_food' }, { label: '甜品饮品', value: 'dessert_drink' },
    { label: '川湘菜', value: 'sichuan_hunan' }, { label: '地方小吃', value: 'local_snacks' },
    { label: '日韩料理', value: 'japanese_korean' }, { label: '超市便利', value: 'supermarket' },
];

// --- 时间转换工具函数 (与 ShopEditForm.vue 一致) ---
const hhMMToMinutes = (timeStr: string | null): number | null => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
};

watch(openTimeDisplay, (newTime) => {
    formData.value.openTimeStart = hhMMToMinutes(newTime);
});
watch(closeTimeDisplay, (newTime) => {
    formData.value.openTimeEnd = hhMMToMinutes(newTime);
});

const formRules: FormRules = {
    name: [{ required: true, message: '请输入店铺名称', trigger: ['input', 'blur'] }],
    description: [{ required: true, message: '请输入店铺简介', trigger: ['input', 'blur'] }],
    openTimeStart: [{ type: 'number', required: true, message: '请选择营业开始时间', trigger: ['change', 'blur'] }],
    openTimeEnd: [
    { type: 'number', required: true, message: '请选择营业结束时间', trigger: ['change', 'blur'] },
    { validator: (_: FormItemRule, value: number | null) => {
        if (formData.value.openTimeStart !== null && value !== null && value <= formData.value.openTimeStart) {
            return new Error('结束时间必须晚于开始时间');
        }
        return true;
        }, trigger: ['change', 'blur']
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
        { validator: (_: FormItemRule, value: string) => /^1[3-9]\d{9}$/.test(value) || /^\d{3,4}-\d{7,8}$/.test(value), message: '请输入有效的手机或座机号码', trigger: ['input', 'blur'] }
    ],
    province: [{ required: true, message: '请输入省级行政区', trigger: 'blur' }],
    city: [{ required: true, message: '请输入地级行政区', trigger: 'blur' }],
    district: [{ required: true, message: '请输入县级行政区', trigger: 'blur' }],
    address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
    coordinate: [
        { type: 'array', required: true, validator: (_: FormItemRule, value: [number | null, number | null] | undefined) => {
            if (!value || value[0] === null || value[1] === null) return new Error('请输入经纬度');
            if (typeof value[0] !== 'number' || typeof value[1] !== 'number') return new Error('经纬度必须是数字');
            if (value[0] < -180 || value[0] > 180) return new Error('经度范围应在 -180 到 180 之间');
            if (value[1] < -90 || value[1] > 90) return new Error('纬度范围应在 -90 到 90 之间');
            return true;
        }, trigger: ['input', 'blur'] },
    ]
    }
};

const {
  coordinates: currentLocation,
  error: geolocationError,
  isLocating,
  getCurrentLocation
} = useGeolocation();

const fetchCurrentLocation = async () => {
  try {
    // 请求高精度定位，超时时间10秒
    const coords = await getCurrentLocation({ enableHighAccuracy: true, timeout: 10000 });
    if (formData.value && formData.value.address) {
      // Geolocation API 返回的是 coords.longitude 和 coords.latitude
      formData.value.address.coordinate = [
        parseFloat(coords.longitude.toFixed(6)), // 保留6位小数
        parseFloat(coords.latitude.toFixed(6))
      ];
      message.success(`定位成功：经度 ${coords.longitude.toFixed(6)}, 纬度 ${coords.latitude.toFixed(6)}`);
      geolocationError.value = null; // 清除旧的错误信息
    }
  } catch (err) {
    // geolocationError ref 已经在 composable 内部被设置了
    // message.error(`定位失败: ${(err as GeolocationError).message}`); // composable 会设置 error.value
    console.error("Geolocation error from component:", err);
    // 可以在此处理特定于组件的错误反馈，如果 composable 中的错误处理不够的话
  }
};


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
    formData.value.avatarUrl = undefined;
    avatarFileList.value = [];
    message.info('头像已移除');
    return true;
};

const handleSave = (e: MouseEvent) => {
    e.preventDefault();
    formData.value.openTimeStart = hhMMToMinutes(openTimeDisplay.value);
    formData.value.openTimeEnd = hhMMToMinutes(closeTimeDisplay.value);

    formRef.value?.validate(async (errors) => {
    if (!errors) {
        isSaving.value = true;
        const newShopId = `shop-${uuidv4().slice(0,8)}`; // 生成一个模拟的新ID
        const shopToCreate = {
        ...formData.value,
        id: newShopId, // 添加ID
        verified: false, // 新店铺默认为未认证
        };

        if (newAvatarFile.value) {
        console.log('新头像文件待上传:', newAvatarFile.value.name);
        shopToCreate.avatarUrl = `https://picsum.photos/seed/${newShopId}-${Date.now()}/200/200`; // 模拟上传后URL
        }
        
        console.log('创建新店铺数据:', JSON.parse(JSON.stringify(shopToCreate)));
        // 在实际项目中，这里会调用 API 创建店铺
        // 模拟添加到 ShopEditForm 和 ShopDetail 中的 mockShopDatabase (如果它们是共享的或全局的)
        // ((window as any).mockShopDatabaseForEdit || {})[newShopId] = shopToCreate; // 这是一个hacky的模拟方式
        // 此处我们仅作演示，实际应更新后端或状态管理库

        await new Promise(resolve => setTimeout(resolve, 1000));
        isSaving.value = false;
        message.success(`店铺 “${shopToCreate.name}” 创建成功！`);
        // 创建成功后，可以跳转到新店铺的详情页或店铺列表页
        router.push(`/merchant/shops/${newShopId}/detail`); 
        // 或者 router.push('/merchant/shops');
    } else {
        message.error('请检查表单输入项！');
    }
    });
};

const handleCancel = () => {
    router.push('/merchant/shops'); // 取消则返回店铺列表
};

</script>

<style scoped>
.shop-create-form-page {
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
</style>