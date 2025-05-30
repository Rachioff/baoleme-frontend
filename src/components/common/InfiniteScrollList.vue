<template>
    <div ref="scrollComponent" class="infinite-scroll-list">
    <div v-if="items.length > 0" class="list-container">
        <div v-for="(item, index) in items" :key="getItemKey(item, index)" class="list-item-wrapper">
        <slot name="item" :item="item" :index="index"></slot>
        </div>
    </div>

    <div v-if="isLoading" class="indicator loading-indicator">
        <slot name="loading">
        <n-spin size="small" />
        <span class="indicator-text">加载中...</span>
        </slot>
    </div>

    <div v-if="!hasMore && items.length > 0 && !isLoading" class="indicator no-more-indicator">
        <slot name="noMore">
        <span class="indicator-text">没有更多了</span>
        </slot>
    </div>

    <div v-if="items.length === 0 && !isLoading && !hasMore" class="indicator empty-indicator">
        <slot name="empty">
        <span class="indicator-text">暂无数据</span>
        </slot>
    </div>

    <div ref="sentinel" class="sentinel"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { NSpin } from 'naive-ui'

interface Props {
    items: any[]
    loadMore: () => Promise<void>
    hasMore: boolean
    isLoading: boolean
    itemKey?: string | ((item: any) => string | number)
    threshold?: number // 距离底部多少像素触发 (用于 IntersectionObserver的rootMargin)
}

const props = withDefaults(defineProps<Props>(), {
    hasMore: true,
    isLoading: false,
    threshold: 100,
})

const scrollComponent = ref<HTMLElement | null>(null)
const sentinel = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

const getItemKey = (item: any, index: number): string | number => {
    if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
    }
    if (typeof props.itemKey === 'string' && item && typeof item === 'object' && props.itemKey in item) {
    return item[props.itemKey]
    }
    return `infinite-item-${index}` // 确保 key 的唯一性，尤其在没有 itemKey 时
}

const initializeObserver = () => {
    if (!sentinel.value || !props.hasMore || props.isLoading) {
    disconnectObserver(); // 先断开，避免重复观察
    return;
    }

    // 如果已经有一个 observer，先断开它
    if (observer) {
    disconnectObserver();
    }

    observer = new IntersectionObserver(
    (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && props.hasMore && !props.isLoading) {
        props.loadMore()
        }
    },
    {
        root: null, // 默认为浏览器视口，如果你的列表在特定容器内滚动，这里应设为该容器
        rootMargin: `0px 0px ${props.threshold}px 0px`,
        threshold: 0.01, // 哨兵元素有1%进入视野即触发，可以根据需要调整
    }
    )
    observer.observe(sentinel.value)
}

const disconnectObserver = () => {
    if (observer) {
    observer.disconnect()
    observer = null
    }
}

onMounted(() => {
    nextTick(() => {
    initializeObserver()
    })
})

onUnmounted(() => {
    disconnectObserver()
})

watch(
    () => [props.hasMore, props.isLoading, props.items.length], // 监听 items.length 变化，以便在列表变空时重新评估
    () => {
    // 使用 nextTick 确保 DOM 更新后再进行操作
    nextTick(() => {
        if (props.hasMore && !props.isLoading && sentinel.value) {
        // 如果条件允许，且观察器未初始化或已断开，则重新初始化
        if (!observer) {
            initializeObserver()
        }
        } else {
        // 否则，断开观察器
        disconnectObserver()
        }
    })
    },
    { deep: false } // items.length 是基本类型，不需要 deep watch props.items 数组本身
)

// 如果列表是在一个特定 div 内滚动，而不是整个窗口滚动，需要提供配置该滚动父元素的能力
// 目前的 root: null 是针对窗口滚动的。
// 如果要在特定元素内滚动，父组件需要传递该元素的引用，或者 IntersectionObserver 的 root 选项需要动态设置。
</script>

<style scoped>
.list-item-wrapper {
    /* 为每个列表项外部包裹一层 div，方便统一添加间距 */
    /* 具体的项内样式由父组件通过 #item 插槽定义 */
    /* 你可以根据项目UI规范在这里加一个默认的 margin-bottom */
    margin-bottom: 16px; /* 例如，符合 Naive UI Card 之间常见的间距感 */
}
/* 移除最后一个子元素的下外边距，使整体布局更美观 */
.list-item-wrapper:last-child {
    margin-bottom: 0;
}

.indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0; /* 上下留出足够空间 */
    text-align: center;
    color: var(--vt-c-text-light-2); /* 使用 base.css 中的次要文字颜色 */
    font-size: 14px;
}

.loading-indicator .indicator-text,
.no-more-indicator .indicator-text,
.empty-indicator .indicator-text {
    margin-left: 8px; /* 微调 Spin 与文字之间的间距 */
}

.no-more-indicator .indicator-text,
.empty-indicator .indicator-text {
    margin-left: 0; /* 对于没有图标的提示，不需要左边距 */
}


.sentinel {
    height: 1px; /* 哨兵元素本身不需要高度，但必须存在于DOM中 */
    width: 100%;
    /* background-color: transparent; */ /* 确保不可见 */
}
</style>