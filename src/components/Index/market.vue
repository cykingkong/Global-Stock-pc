<script setup lang="ts">
import { ref, h, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Table, Button } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/table/style/css.js'
import '@arco-design/web-vue/es/button/style/css.js'
import { useMarketStore } from '@/stores/market'
import SparkLine from '@/components/SparkLine.vue'

const router = useRouter()
const { t } = useI18n()
const marketStore = useMarketStore()

interface StockItem {
  key: string
  rank: number
  name: string
  fullName: string
  symbol: string
  logoUrl: string
  close: number
  increase: string
  changeValue: number
  closePoints: number[]
  tradingview_name?: string
}

const stocks = computed(() => marketStore.stockList)
const loading = computed(() => marketStore.loading)

async function fetchMarkets() {
  await marketStore.fetchMarketList({ page: 1, size: 10, region: 'US' })
}

onMounted(() => {
  fetchMarkets()
})

const handleTrade = (record: StockItem) => {
  router.push({
    path: '/detail',
    query: {
      symbol: record.symbol,
      tradingview_name: record.tradingview_name,
    },
  })
}

const columns = computed(() => [
  {
    title: '#',
    dataIndex: 'rank',
    width: 60,
    align: 'center' as const,
    render: ({ record }: any) =>
      h('span', { class: 'text-zinc-400 font-medium text-base' }, record.rank),
  },
  {
    title: t('index.market.name'),
    dataIndex: 'name',
    render: ({ record }: any) =>
      h('div', { class: 'flex items-center gap-3.5' }, [
        record.logoUrl
          ? h('img', { src: record.logoUrl, class: 'w-9 h-9 rounded-full flex-shrink-0' })
          : h('div', { class: 'w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-500 flex-shrink-0' }, record.symbol?.charAt(0)),
        h('div', {}, [
          h('div', { class: 'font-semibold text-zinc-950 text-[15px] leading-none' }, record.fullName),
          h('div', { class: 'text-xs text-zinc-500 tracking-[0.6px] font-mono mt-0.5' }, record.symbol),
        ]),
      ]),
  },
  {
    title: t('index.market.price'),
    dataIndex: 'close',
    width: 150,
    align: 'right' as const,
    render: ({ record }: any) =>
      h('div', { class: 'font-semibold text-zinc-950 tabular-nums text-[15px]' },
        `$${Number(record.close).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ),
  },
  {
    title: t('index.market.change24h'),
    dataIndex: 'increase',
    width: 130,
    align: 'right' as const,
    render: ({ record }: any) => {
      const isUp = record.changeValue >= 0
      return h('span', {
        class: `font-medium text-sm tabular-nums ${isUp ? 'text-emerald-500' : 'text-red-500'}`,
      }, record.increase)
    },
  },
  {
    title: t('index.market.chart'),
    dataIndex: 'closePoints',
    width: 148,
    align: 'center' as const,
    render: ({ record }: any) =>
      h(SparkLine, {
        data: record.closePoints,
        increase: record.changeValue,
        width: 138,
        height: 42,
      }),
  },
  {
    title: t('index.market.trade'),
    width: 110,
    align: 'center' as const,
    render: ({ record }: any) =>
      h(Button, {
        type: 'outline',
        size: 'small',
        class: '!rounded-full !px-7 !h-8 text-sm font-medium border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50',
        onClick: () => handleTrade(record),
      }, () => t('index.market.trade')),
  },
])
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    <div class="max-w-[1180px] mx-auto px-8 py-12">
      <!-- Header -->
      <div class="flex items-center justify-between mb-9">
        <h1 class="text-[34px] font-semibold tracking-[-0.5px] text-zinc-950">{{ t('index.market.title') }}</h1>
        <button
          class="px-7 py-2.5 text-sm font-medium border border-zinc-200 hover:border-zinc-300 rounded-full transition-colors">
          {{ t('index.market.viewMore') }}
        </button>
      </div>

      <!-- Arco Table -->
      <Table :data="stocks" :columns="columns" :bordered="false" :pagination="false" :loading="loading"
        :row-class="() => 'hover:bg-zinc-50/70 transition-colors'" class="market-table" />
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
