<script setup lang="ts">
import { NFlex, NH1, NSelect, NCard, NH2, NGrid, NGridItem, NSpin, useMessage, c } from 'naive-ui'
import { ref, computed, watch } from 'vue'
import {
    Chart as ChartJS,
    ArcElement,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip,
} from 'chart.js'

import { Line, Pie } from 'vue-chartjs'
import { getOrderStats, getTopProducts } from '@/api/shop'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

interface Props {
    shopId: string
}
const props = defineProps<Props>()

ChartJS.register(
    Legend,
    Tooltip,
    ArcElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
)

const rangeOptions = [
    { label: "近 7 天", value: 7 },
    { label: "近 30 天", value: 30 },
    { label: "近 90 天", value: 90 },
]

const rangeValue = ref(7)

const rangeLabels = computed(() => {
    const value = rangeValue.value
    const today = new Date()
    const labels: string[] = []
    for (let i = value; i > 0; i--) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        labels.push(`${month}-${day}`)
    }
    return labels
})

const orderStatsSaleData = ref<number[]>([])
const orderStatsSale = computed(() => ({
    labels: rangeLabels.value,
    datasets: [{label: '销量', data: orderStatsSaleData.value}]
}))

const orderStatsIncomeData = ref<number[]>([])
const orderStatsIncome = computed(() => ({
    labels: rangeLabels.value,
    datasets: [{label: '收入', data: orderStatsIncomeData.value}]
}))

const topProductsSaleData = ref<{ name: string, value: number }[]>([])
const topProductsSale = computed(() => ({
    labels: topProductsSaleData.value.map(item => item.name),
    datasets: [{
        label: '销量',
        data: topProductsSaleData.value.map(item => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#7F7F7F']
    }]
}))

const topProductsIncomeData = ref<{ name: string, value: number }[]>([])
const topProductsIncome = computed(() => ({
    labels: topProductsIncomeData.value.map(item => item.name),
    datasets: [{
        label: '收入',
        data: topProductsIncomeData.value.map(item => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#7F7F7F']
    }]
}))

const loading = ref(true)

const message = useMessage()
const router = useRouter()

const updateData = async (range: number) => {
    loading.value = true
    try {
        orderStatsSaleData.value = []
        orderStatsIncomeData.value = []
        topProductsSaleData.value = []
        topProductsIncomeData.value = []
        const now = new Date()
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const start = new Date(end)
        start.setDate(end.getDate() - range)
        const [orderStats, topProducts] = await Promise.all([
            getOrderStats(props.shopId, start, end),
            getTopProducts(props.shopId, start, end, 5)])
        orderStatsSaleData.value = orderStats.sales
        orderStatsIncomeData.value = orderStats.incomes
        topProductsSaleData.value = topProducts.bySale.map(item => ({
            name: item.name,
            value: item.queriedSale
        }))
        topProductsSaleData.value.push({ name: '其他', value: topProducts.totalSale - topProducts.bySale.reduce((sum, item) => sum + item.queriedSale, 0) })
        topProductsIncomeData.value = topProducts.byIncome.map(item => ({
            name: item.name,
            value: item.queriedIncome
        }))
        topProductsIncomeData.value.push({ name: '其他', value: topProducts.totalIncome - topProducts.byIncome.reduce((sum, item) => sum + item.queriedIncome, 0) })
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.status === 401) { 
                message.error(`未登录`)
                router.push({ name: 'Login' })
            } else {
                message.error(`获取店铺统计信息失败 (${e.response?.data.message})`)
            }
        } else {
            message.error(`未知错误 (${e})`)
        }
    } finally {
        loading.value = false
    }
}

watch(rangeValue, updateData, { immediate: true })

</script>
<template>
    <n-flex id="card-container" style="width: 100%;" vertical align="center">
        <n-h1>店铺统计数据</n-h1>
        <n-select style="width: 200px;" v-model:value="rangeValue" :options="rangeOptions" />
        <n-spin :show="loading" description="加载中">
            <n-grid style="max-width: 1232px;" :cols="2">
                <n-grid-item>
                    <n-card class="card">
                        <n-h2>销量统计</n-h2>
                        <Line :data="orderStatsSale"/>
                    </n-card>
                </n-grid-item>
                <n-grid-item>
                    <n-card class="card">
                        <n-h2>收入统计</n-h2>
                        <Line :data="orderStatsIncome"/>
                    </n-card>
                </n-grid-item>
                <n-grid-item>
                    <n-card class="card">
                        <n-h2>热销商品（按销量）</n-h2>
                        <Pie :data="topProductsSale"/>
                    </n-card>
                </n-grid-item>
                <n-grid-item>
                    <n-card class="card">
                        <n-h2>热销商品（按收入）</n-h2>
                        <Pie :data="topProductsIncome"/>
                    </n-card>
                </n-grid-item>
            </n-grid>
        </n-spin>
        
    </n-flex>
</template>
<style>
.card {
    width: 100%;
    max-width: 600px;
    margin: 8px;
}
</style>