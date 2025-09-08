<!-- WaterfallContainer.vue -->
<template>
    <div class="waterfall-container" :style="containerStyle">
        <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="waterfall-column" :style="columnStyle">
            <div v-for="(item, itemIndex) in column" :key="item.id || itemIndex" class="waterfall-item"
                :style="itemStyle">
                <slot name="item" :item="item">
                    {{ item }}
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    // 要显示的数据项数组
    items: {
        type: Array,
        required: true
    },
    // 列数，默认为3
    columnCount: {
        type: Number,
        default: 3
    },
    // 列间距，单位px
    gap: {
        type: Number,
        default: 20
    },
    // 每个项目的内边距，单位px
    itemPadding: {
        type: Number,
        default: 10
    }
})

// 计算分配到每列的数据
const columns = computed(() => {
    const cols = Array.from({ length: props.columnCount }, () => [])

    props.items.forEach((item, index) => {
        // 将项目分配到最短的列中
        const shortestColumnIndex = cols
            .map((col, i) => ({
                height: col.reduce((sum, item) => sum + (item.height || 0), 0),
                index: i
            }))
            .sort((a, b) => a.height - b.height)[0].index

        cols[shortestColumnIndex].push(item)
    })

    return cols
})

// 容器样式
const containerStyle = computed(() => ({
    display: 'flex',
    gap: `${props.gap}px`,
    padding: `${props.gap}px`,
}))

// 列样式
const columnStyle = computed(() => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: `${props.gap}px`,
}))

// 项目样式
const itemStyle = computed(() => ({
    padding: `${props.itemPadding}px`,
    background: 'var(--color-background-soft)',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
}))
</script>

<style scoped>
.waterfall-container {
    width: 100%;
    margin: 0 auto;
}

.waterfall-item {
    width: 100%;
    break-inside: avoid;
}

.waterfall-item:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .waterfall-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .waterfall-container {
        grid-template-columns: 1fr;
    }
}
</style>