<template>
    <n-card class="product-card" hoverable>
        <div class="image-wrapper">
            <n-avatar :size="130" :src=product.image alt="商品图片" />
            <n-tag class="discount-tag" type="error" size="small" v-if="product.discount">
                {{ product.discount }}
            </n-tag>
        </div>

        <div class="product-info">
            <div style="flex-direction: row; display: flex; gap: 6px">
                <h3 class="name">{{ product.name }}</h3>
                <p class="category">{{ product.category }}</p>
            </div>

            <div class="rating-price">
                <n-rate :value="product.rating" readonly size="small" allow-half />
                <div class="price-and-cart">
                    <span class="price">￥{{ product.price.toFixed(2) }}</span>
                    <div class="add-cart">
                        <n-button text @click="addToCart">
                            <n-icon size="20">
                                <plus-outlined />
                            </n-icon>
                        </n-button>
                    </div>
                </div>
            </div>
        </div>
    </n-card>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@vicons/antd'
import { useDialog, useMessage } from 'naive-ui';

const message = useMessage()
const dialog = useDialog()
const props = defineProps<{
    product: {
        image: string
        name: string
        category: string
        rating: number
        price: number
        discount?: string
    }
}>()

const addToCart = () => {
    console.log(`加入购物车：${props.product.name}`)
    // TODO: 调用购物车逻辑

    dialog.success({
        title: '加入购物车',
        content: '你确定？',
        positiveText: '确定',
        negativeText: '不确定',
        draggable: true,
        onPositiveClick: () => {
            message.success('确定')
            alert("Not implemented")
        },
        onNegativeClick: () => {
            message.error('不确定')
            alert("Not implemented")
        }
    })
}
</script>

<style scoped>
.product-card {
    width: 180px;
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    justify-content: center;
    align-items: center;
    /* 保证图片是正方形 */
    overflow: hidden;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.discount-tag {
    position: absolute;
    top: 8px;
    left: 8px;
}

.product-info {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.name {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.category {
    font-size: 10px;
    color: #888;
}

.rating-price {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.price-and-cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    color: #ff4d4f;
    font-weight: bold;
}

.add-cart {
    text-align: right;
}
</style>
