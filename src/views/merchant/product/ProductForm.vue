<template>
    <div class="product-edit-form-page">
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
        <p>正在加载商品数据...</p>
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
            <n-form-item-gi :span="3" label="商品名称" path="name">
            <n-input v-model:value="formData.name" placeholder="请输入商品名称" />
            </n-form-item-gi>

            <n-form-item-gi :span="3" label="商品描述" path="description">
            <n-input
                v-model:value="formData.description"
                type="textarea"
                placeholder="请输入商品描述（可选）"
                :autosize="{ minRows: 3, maxRows: 5 }"
            />
            </n-form-item-gi>

            <n-form-item-gi :span="1" label="商品价格 (元)" path="price">
            <n-input-number
                v-model:value="formData.price"
                placeholder="请输入价格"
                :min="0"
                :precision="2"
                style="width: 100%"
            >
                <template #prefix>¥</template>
            </n-input-number>
            </n-form-item-gi>

            <n-form-item-gi :span="1" label="划线价 (元, 可选)" path="originalPrice">
            <n-input-number
                v-model:value="formData.originalPrice"
                placeholder="请输入划线价"
                :min="0"
                :precision="2"
                style="width: 100%"
            >
                <template #prefix>¥</template>
            </n-input-number>
            </n-form-item-gi>
            <n-gi :span="1" />


            <n-form-item-gi :span="3" label="商品封面（支持 PNG, JPG, GIF, WEBP 格式）" path="coverFile">
            <n-upload
                v-model:file-list="coverFileList"
                list-type="image-card"
                :max="1"
                accept="image/png, image/jpeg, image/gif, image/webp"
                :custom-request="handleCustomCoverRequest"
                @change="handleCoverChange"
                @remove="handleCoverRemove"
            >
                <n-upload-dragger>
                <div style="margin-bottom: 12px">
                    <n-icon size="48" :depth="3" :component="CloudUploadOutline" />
                </div>
                <n-p depth="3" style="margin: 8px 0 0 0">
                    点击或拖拽图片到此处上传
                </n-p>
                </n-upload-dragger>
            </n-upload>
            </n-form-item-gi>

            <n-form-item-gi :span="3" label="商品分类" path="categories">
            <n-select
                v-model:value="formData.categories"
                multiple
                filterable
                tag
                placeholder="请选择或输入商品分类"
                :options="productCategoryOptions"
                :max-tag-count="5"
            />
            </n-form-item-gi>

            <n-form-item-gi label="上架状态" path="available">
            <n-switch v-model:value="formData.available">
                <template #checked>已上架</template>
                <template #unchecked>已下架</template>
            </n-switch>
            </n-form-item-gi>

            <n-form-item-gi label="缺货状态" path="stockout">
            <n-switch v-model:value="formData.stockout">
                <template #checked>缺货</template>
                <template #unchecked>有货</template>
            </n-switch>
            </n-form-item-gi>
        </n-grid>
        </n-form>
    </n-card>
    <n-empty v-else description="无法加载商品信息进行编辑" style="margin-top: 40px;" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    NPageHeader, NSpace, NButton, NCard, NForm, NFormItemGi, NInput, NInputNumber,
    NSelect, NSpin, NEmpty, NGrid, NSwitch, NGi,
    NUpload, NUploadDragger, NIcon, NP, useMessage,
    type FormInst, type FormRules, type FormItemRule, type UploadFileInfo, type UploadCustomRequestOptions, type SelectOption
} from 'naive-ui'
import { CloudUploadOutline } from '@vicons/ionicons5'

// --- 数据模型定义 ---
interface ProductEditable {
    id: string;
    shopId: string; // To know which shop this product belongs to
    name: string;
    description?: string;
    price: number | null; // In Yuan for display, convert to cents for backend
    originalPrice?: number | null; // In Yuan for display
    coverUrl?: string;
    categories: string[]; // Category IDs or names
    available: boolean;
    stockout: boolean;
    // Add other fields like SKU, stock quantity etc. if needed
}

const route = useRoute()
const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)

// Assuming productId is passed as a route param, similar to shopId
const productId = computed(() => route.params.productId as string)
// You might also need shopId if creating a new product or for context
const shopId = computed(() => route.params.shopId as string);


const formData = ref<ProductEditable | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)

// Cover image upload
const coverFileList = ref<UploadFileInfo[]>([])
const newCoverFile = ref<File | null>(null)

const pageTitle = computed(() => {
    if (isLoading.value) return '加载中...'
    // For a new product, productId might not exist yet, title could be "添加新商品"
    // This example assumes editing existing product.
    return formData.value ? `编辑商品 - ${formData.value.name}` : '编辑商品信息'
})

// --- Mock Product Category Options ---
// Replace with your actual category fetching logic
const productCategoryOptions: SelectOption[] = [
    { label: '热销爆款', value: 'hot_sale' },
    { label: '主食', value: 'staple_food' },
    { label: '饮品', value: 'drinks' },
    { label: '小吃', value: 'snacks' },
    { label: '套餐', value: 'combo_meal' },
];

// --- Mock Product Database ---
// Replace with your actual API calls
const mockProductDatabase: Record<string, ProductEditable> = {
    'product-123': {
    id: 'product-123', shopId: 'shop-1', name: '招牌牛肉堡', description: '多汁牛肉饼，新鲜蔬菜，秘制酱料。',
    price: 25.00, originalPrice: 30.00,
    coverUrl: 'https://picsum.photos/seed/product-123/200/200',
    categories: ['staple_food', 'hot_sale'],
    available: true, stockout: false,
    },
    'product-456': {
    id: 'product-456', shopId: 'shop-1', name: '香辣鸡腿翅', description: '外酥里嫩，香辣可口。',
    price: 18.50,
    coverUrl: 'https://picsum.photos/seed/product-456/200/200',
    categories: ['snacks'],
    available: true, stockout: true,
    },
};

const fetchProductData = async (id: string) => {
    isLoading.value = true;
    console.log(`Fetching product data for ID: ${id}, Shop ID: ${shopId.value}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    const data = mockProductDatabase[id]; // In a real app, this would be an API call: getProductDetail(id)

    if (data) {
    formData.value = JSON.parse(JSON.stringify(data)); // Deep copy
    
    // Initialize cover image file list if coverUrl exists
    if (formData.value && formData.value.coverUrl) {
        coverFileList.value = [{
        id: 'current-cover', name: '当前封面', status: 'finished', url: formData.value.coverUrl,
        }];
    } else {
        coverFileList.value = [];
    }
    newCoverFile.value = null; // Reset any previously selected new file
    } else {
    message.error('无法找到该商品数据');
    formData.value = null;
    // Optionally navigate back or to an error page
    // router.replace(`/merchant/shops/${shopId.value}/products`); 
    }
    isLoading.value = false;
};

onMounted(() => {
    if (productId.value) { // Assuming we are always editing an existing product in this form
    fetchProductData(productId.value);
    } else {
    // Handle new product creation: Initialize formData with default values
    // isLoading.value = false;
    // formData.value = {
    //   id: '', // Will be generated by backend or leave empty
    //   shopId: shopId.value, // Important for associating with the shop
    //   name: '',
    //   price: null,
    //   categories: [],
    //   available: true,
    //   stockout: false,
    // };
    // coverFileList.value = [];
    // newCoverFile.value = null;
    // pageTitle.value = '添加新商品'; // Update title
    message.error('无效的商品ID。此表单用于编辑现有商品。');
    // router.replace(`/merchant/shops/${shopId.value}/products` || '/merchant/dashboard'); // Adjust redirect as needed
    }
});

const formRules: FormRules = {
    name: [{ required: true, message: '请输入商品名称', trigger: ['input', 'blur'] }],
    price: [
    { required: true, type: 'number', message: '请输入商品价格', trigger: ['input', 'blur'] },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: ['input', 'blur'] }
    ],
    originalPrice: [
    { type: 'number', validator: (rule: FormItemRule, value: number | null) => {
        if (value !== null && value < 0) {
            return new Error('划线价不能为负数');
        }
        if (value !== null && formData.value?.price !== null && formData.value?.price !== undefined && value <= formData.value.price) {
            return new Error('划线价必须大于当前价格');
        }
        return true;
        },
        trigger: ['input', 'blur']
    }
    ],
    categories: [{ type: 'array', required: true, min: 1, message: '请至少选择一个商品类型', trigger: 'change' }],
    // coverFile: [{ validator: () => newCoverFile.value || (formData.value && formData.value.coverUrl), message: '请上传商品封面'}] // More complex validation if needed
};


const handleCustomCoverRequest = ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
    // This is where you would typically upload the file to your server
    // For now, we'll just simulate success as we are handling the file in `handleSave`
    console.log('自定义请求处理了封面文件:', file.name);
    // Simulate upload
    setTimeout(() => {
    // If real upload: get URL from server response
    // For mock:
    // file.url = URL.createObjectURL(file.file as File) 
    onFinish(); 
    }, 300);
    // If error: onError();
};

const handleCoverChange = (data: { file: UploadFileInfo, fileList: UploadFileInfo[] }) => {
    if (data.file.status === 'pending' || data.file.status === 'uploading') {
    if (data.file.file) { // Check if file.file is not null
        newCoverFile.value = data.file.file; // Store the actual file object
        message.info(`已选择新封面: ${data.file.name}`);
    }
    } else if (data.file.status === 'removed') {
    // Handled by handleCoverRemove
    } else if (data.file.status === 'finished') {
    // If customRequest uploads immediately, you might get the URL here.
    // For this example, we assume final upload happens on save.
    }
    // Keep only the latest file in the list for a single upload scenario
    coverFileList.value = data.fileList.slice(-1);
};

const handleCoverRemove = () => {
    newCoverFile.value = null;
    if (formData.value) formData.value.coverUrl = undefined; // Clear existing URL if user removes it
    coverFileList.value = []; // Clear the file list
    message.info('封面已移除');
    return true; // Important to return true for Naive UI
};


const handleSave = (e: MouseEvent) => {
    e.preventDefault();
    if (!formData.value) {
        message.error('商品数据不存在，无法保存');
        return;
    }

    formRef.value?.validate(async (errors) => {
    if (!errors && formData.value) {
        isSaving.value = true;
        
        const productDataToSave: ProductEditable = JSON.parse(JSON.stringify(formData.value));
        
        // Convert price to cents if your backend expects it
        // if (productDataToSave.price !== null) {
        //   productDataToSave.price = Math.round(productDataToSave.price * 100);
        // }
        // if (productDataToSave.originalPrice !== null && productDataToSave.originalPrice !== undefined) {
        //   productDataToSave.originalPrice = Math.round(productDataToSave.originalPrice * 100);
        // }


        console.log('待保存的商品数据:', productDataToSave);

        // --- Simulate API Call ---
        // 1. If newCoverFile.value exists, upload it first.
        if (newCoverFile.value) {
        console.log('新封面文件待上传:', newCoverFile.value.name, newCoverFile.value.type);
        // actualCoverUploadFunction(newCoverFile.value).then(url => productDataToSave.coverUrl = url);
        // For mock, let's generate a new picsum URL
        productDataToSave.coverUrl = `https://picsum.photos/seed/${productDataToSave.id}-${Date.now()}/200/200`;
        message.success('封面模拟上传成功!');
        } else if (coverFileList.value.length === 0) {
        // If cover was removed and no new one selected
        productDataToSave.coverUrl = undefined;
        }
        
        // 2. Save product data (including new coverUrl if applicable)
        // await updateProductApi(productDataToSave.id, productDataToSave); // Example API call
        if (mockProductDatabase[productDataToSave.id]) {
        mockProductDatabase[productDataToSave.id] = productDataToSave;
        }


        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API latency
        isSaving.value = false;
        message.success('商品信息保存成功！');
        
        // Optionally, refresh data or navigate
        fetchProductData(productDataToSave.id); // Refresh data to show saved state (e.g., new cover URL)
        // router.push(`/merchant/shops/${shopId.value}/products/${productId.value}/detail`); // Or to product list
        
    } else if (errors) {
        message.error('请检查表单输入项！');
        console.log("Validation Errors:", errors);
    } else {
        message.error('无法保存，商品数据不存在。');
        isSaving.value = false;
    }
    });
};

const handleCancel = () => {
    // Navigate back, possibly to the product list or product detail page for this shop
    if (shopId.value && productId.value) {
    // router.push(`/merchant/shops/${shopId.value}/products/${productId.value}/detail`);
    router.back(); // Or simply go back
    } else if (shopId.value) {
    // router.push(`/merchant/shops/${shopId.value}/products`);
    router.back();
    } else {
    router.back();
    }
};

</script>

<style scoped>
.product-edit-form-page {
    padding: 16px;
    background-color: #f8f8f8; /* Light gray background for the page */
}
.n-page-header {
    background-color: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 20px; /* Space between header and form card */
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); /* Subtle shadow like antd */
}
.form-card {
    padding: 24px; /* Inner padding for the form content */
    border-radius: 8px; /* Rounded corners for the card */
}
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px; /* Ensure it takes some space */
    color: var(--text-color2); /* Naive UI secondary text color */
}
.loading-container p {
    margin-top: 10px;
}
</style>