<template>
    <n-card title="订单提交" class="order-container">

        <div class="order-list">
            <div v-for="item in items" :key="item.id" class="order-item">
                <n-card class="order-card" :bordered="true">
                    <div class="order-content">
                        <div class="order-info">
                            <n-avatar :src="item.image" :size=120 :bordered="true" />
                            <div class="order-text">
                                <div class="item-name">{{ item.name }}</div>
                                <div class="item-price">单价：¥{{ item.price.toFixed(2) }}</div>
                                <div class="item-quantity">数量：{{ item.quantity }}</div>
                            </div>
                        </div>

                        <div class="order-actions">
                            <n-button size="small" @click="decrease(item)">-</n-button>
                            <span>{{ item.quantity }}</span>
                            <n-button size="small" @click="increase(item)">+</n-button>
                        </div>
                    </div>
                </n-card>

                <div class="remark-input">
                    <n-input v-model:value="item.remark" placeholder="备注：如不要辣，去冰等" size="small" clearable />
                </div>

                <n-divider />
            </div>
        </div>

        <div class="order-summary">
            <div>商品总价：¥{{ totalPrice.toFixed(2) }}</div>
            <div class="order-discount">优惠共减：¥{{ discount.toFixed(2) }}</div>
            <div class="order-payable">实付：¥{{ payable.toFixed(2) }}</div>
        </div>

        <div class="order-inputs">
            <n-input v-model:value="address" placeholder="请输入收货地址" clearable size="large">
                <template #prefix>📍</template>
            </n-input>
            <n-input v-model:value="note" type="textarea" placeholder="订单留言（如口味、时间等）" clearable />
        </div>

        <n-divider />

        <!-- 底部栏 -->
        <div class="order-footer">
            <div class="order-total">合计：¥{{ payable.toFixed(2) }}</div>
            <n-button type="primary" @click="submit(items)">提交订单</n-button>
            <!-- <n-modal v-model:show="showModal" preset="dialog" title="扫码付款" :closable="true" :mask-closable="false">
                <div class="qrcode-container">
                    <n-image width="200" :src="qrCodeUrl" alt="付款码" />
                    <p class="qrcode-text">请使用微信或支付宝扫码付款</p>
                </div>
            </n-modal> -->
        </div>

    </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NAvatar, NButton, NCard, NDivider, useMessage, NInput } from 'naive-ui'
import { type Item } from '@/types/order'
// import submitOrder from '@/api/orders'

// TODO:这里数据只是基本展示，实际应该从前端购物车获取，然后需要加上 remark字段
const items = ref<Item[]>([
    { id: 1, name: '炸鸡', price: 25, quantity: 1, image: 'https://via.placeholder.com/64', remark: '' },
    { id: 2, name: '奶茶', price: 15, quantity: 2, image: 'https://via.placeholder.com/64', remark: '' }
])

const address = ref('')
const note = ref('')

const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const discount = computed(() => (totalPrice.value >= 50 ? 5 : 0))
const payable = computed(() => totalPrice.value - discount.value)

function increase(item: Item) {
    item.quantity++
}

function decrease(item: Item) {
    if (item.quantity > 1) item.quantity--
}

const message = useMessage()
async function submit(items: Item[]) {
    // TODO: 这里直接跳转收费界面，设置订单状态就行了
    // showModal = true 
    try {
        // submitOrder(items)
        message.success(`订单提交成功，实付 ¥${payable.value.toFixed(2)}`)
    } catch (error) {
        message.error('订单提交失败')
    }
}

const showModal = ref(false)
// 二维码图片地址
// const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://pay.example.com/order/123456'
</script>

<style scoped>
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.qrcode-text {
  font-size: 14px;
  color: #666;
}
.order-container {
    max-width: 720px;
    margin: 32px auto;
    padding: 16px;
}

.order-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.order-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.order-card {
    padding: 8px;
}

.order-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background-color: #fffef9;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-content:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.order-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.order-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.item-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.item-price,
.item-quantity {
    font-size: 14px;
    color: #666;
}

.order-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 500;
}

.remark-input {
    padding: 0 8px;
}

.order-summary {
    text-align: right;
    font-size: 16px;
    padding-top: 12px;
}

.order-discount {
    color: #e53e3e;
    margin-top: 4px;
}

.order-payable {
    color: #b91c1c;
    font-size: 18px;
    font-weight: bold;
    margin-top: 4px;
}

.order-inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 24px;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
}

.order-total {
    font-size: 18px;
    font-weight: bold;
    color: #d83434;
}
</style>
