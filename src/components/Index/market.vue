<script setup lang="ts">
import { ref, h, computed, defineComponent, type PropType, onMounted, onBeforeUnmount } from 'vue'
import { Table, Button } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/table/style/css.js'
import '@arco-design/web-vue/es/button/style/css.js'

// Minimal ECharts (only LineChart + SVGRenderer)
import { init, use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

use([LineChart, GridComponent, SVGRenderer])

interface Coin {
  key: string
  rank: number
  name: string
  symbol: string
  logoBg: string
  logoContent: string
  price: string
  change: number
  chartData: number[]
}

const coins = ref<Coin[]>([
  {
    key: '1',
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    logoBg: '#F7931A',
    logoContent: '₿',
    price: '$36,201.34',
    change: 1.71,
    chartData: [34200, 34800, 34500, 35200, 35500, 35300, 36000, 36250, 36100, 36300, 36250, 36201],
  },
  {
    key: '2',
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    logoBg: '#627EEA',
    logoContent: 'Ξ',
    price: '$2,605.95',
    change: 2.04,
    chartData: [2450, 2490, 2470, 2530, 2560, 2540, 2580, 2600, 2595, 2610, 2608, 2606],
  },
  {
    key: '3',
    rank: 3,
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    logoBg: '#4CC947',
    logoContent: '₿',
    price: '$939.20',
    change: -0.74,
    chartData: [955, 950, 952, 945, 940, 942, 937, 935, 938, 933, 940, 939],
  },
  {
    key: '4',
    rank: 4,
    name: 'Ripple',
    symbol: 'XRP',
    logoBg: '#23292F',
    logoContent: 'X',
    price: '$1.02',
    change: 1.2,
    chartData: [0.95, 0.97, 0.96, 0.98, 10.99, 12.0, 1.01, -1.025, 12.02, 1.03, 1.02, 1.02],
  },
  {
    key: '5',
    rank: 5,
    name: 'Chainlink',
    symbol: 'LINK',
    logoBg: '#2A5ADA',
    logoContent: '🔗',
    price: '$30.56',
    change: -3.84,
    chartData: [33.5, 32.8, 33.2, 131.8, 31.2, 31.5, 30.8, 30.4, 30.9, 30.1, 30.7, 30.56],
  },
])

const tabs = ['美股', '墨西哥股', '巴西股', '尼日股', '港股']
const activeTab = ref('美股')

// Sparkline component (fully componentized, SVG renderer)
const Sparkline = defineComponent({
  props: {
    data: { type: Array as PropType<number[]>, required: true },
    color: { type: String, default: '#22c55e' },
  },
  setup(props) {
    const chartRef = ref<HTMLElement | null>(null)
    let instance: any = null

    onMounted(() => {
      if (!chartRef.value) return
      instance = init(chartRef.value, undefined, { renderer: 'svg', width: 118, height: 44 })

      const option = {
        animation: false,
        grid: { left: 4, right: 4, top: 6, bottom: 6 },
        xAxis: { type: 'category' as const, show: false, data: props.data.map((_, i) => i) },
        yAxis: { type: 'value' as const, show: false },
        series: [
          {
            type: 'line',
            data: props.data,
            smooth: 0.35,
            showSymbol: false,
            lineStyle: { width: 2.5, color: props.color },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: props.color + '0D' },
                  { offset: 1, color: '#fff' },
                ],
              },
            },
          },
        ],
      }
      instance.setOption(option)
    })

    onBeforeUnmount(() => {
      instance?.dispose()
    })

    return () => h('div', { ref: chartRef })
  },
})

// Table columns
const columns = computed(() => [
  {
    title: '#',
    dataIndex: 'rank',
    width: 68,
    align: 'center' as const,
    render: ({ record }: any) =>
      h('span', { class: 'text-zinc-400 font-medium text-base' }, record.rank),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 260,
    render: ({ record }: any) =>
      h('div', { class: 'flex items-center gap-3.5' }, [
        h(
          'div',
          {
            class:
              'w-9 h-9 rounded-2xl flex items-center justify-center text-[26px] font-bold text-white shadow flex-shrink-0',
            style: { backgroundColor: record.logoBg },
          },
          record.logoContent,
        ),
        h('div', {}, [
          h('div', { class: 'font-semibold text-zinc-950 text-[15px] leading-none' }, record.name),
          h(
            'div',
            { class: 'text-xs text-zinc-500 tracking-[0.6px] font-mono mt-0.5' },
            record.symbol,
          ),
        ]),
      ]),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: 150,
    align: 'right' as const,
    render: ({ record }: any) =>
      h('div', { class: 'font-semibold text-zinc-950 tabular-nums text-[15px]' }, record.price),
  },
  {
    title: '24h change',
    dataIndex: 'change',
    width: 130,
    align: 'right' as const,
    render: ({ record }: any) => {
      const isUp = record.change >= 0
      return h(
        'span',
        {
          class: `font-medium text-sm tabular-nums ${isUp ? 'text-emerald-500' : 'text-red-500'}`,
        },
        `${isUp ? '+' : ''}${record.change.toFixed(2)}%`,
      )
    },
  },
  {
    title: 'Chart',
    dataIndex: 'chart',
    width: 138,
    align: 'center' as const,
    render: ({ record }: any) =>
      h(Sparkline, {
        data: record.chartData,
        color: record.change >= 0 ? '#22c55e' : '#ef4444',
      }),
  },
  {
    title: 'Trade',
    width: 110,
    align: 'center' as const,
    render: () =>
      h(
        Button,
        {
          type: 'outline',
          size: 'small',
          class:
            '!rounded-full !px-7 !h-8 text-sm font-medium border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50',
        },
        () => 'Trade',
      ),
  },
])
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    <div class="max-w-[1180px] mx-auto px-8 py-12">
      <!-- Header -->
      <div class="flex items-center justify-between mb-9">
        <h1 class="text-[34px] font-semibold tracking-[-0.5px] text-zinc-950">Market trend</h1>
        <button
          class="px-7 py-2.5 text-sm font-medium border border-zinc-200 hover:border-zinc-300 rounded-full transition-colors"
        >
          View more
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-8">
        <div
          v-for="tab in tabs"
          :key="tab"
          :class="[
            'px-7 py-2.5 text-sm font-medium rounded-3xl cursor-pointer transition-all whitespace-nowrap',
            activeTab === tab
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100',
          ]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </div>
      </div>

      <!-- Arco Table -->
      <Table
        :data="coins"
        :columns="columns"
        :bordered="false"
        :pagination="false"
        :row-class="() => 'hover:bg-zinc-50/70 transition-colors'"
        class="market-table"
      />
    </div>
  </div>
</template>

<style>
.market-table .arco-table-th {
  color: #64748b;
  font-weight: 500;
  font-size: 13px;
  padding-bottom: 18px !important;
  background: #fff !important;
  border-bottom: 1px solid #e6e8ec !important;
}
.market-table .arco-table-td {
  padding: 22px 12px !important;
  border-bottom: 1px solid #f1f1f1;
}
.market-table .arco-table-tr:last-child .arco-table-td {
  border-bottom: none;
}
</style>
