<script setup lang="ts">
import { ref, h, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Table, Button, Pagination } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/table/style/css.js'
import '@arco-design/web-vue/es/button/style/css.js'
import '@arco-design/web-vue/es/pagination/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import SparkLine from '@/components/SparkLine.vue'
import { getMarketList } from '@/api/market'
import { subscribeQuotes, unsubscribeAllQuotes } from '@/utils/quoteSubscription'

const router = useRouter()
const { t } = useI18n()

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

const stocks = ref<StockItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

async function fetchMarkets() {
  loading.value = true
  try {
    const { data, code } = await getMarketList({ page: currentPage.value, size: pageSize.value, region: '200' })
    if (code === 200) {
      const list: any[] = []
      if (data.groups && Array.isArray(data.groups)) {
        data.groups.forEach((group: any) => {
          group.categories?.forEach((category: any) => {
            category.stocks?.forEach((stock: any) => list.push(stock))
          })
        })
      }
      stocks.value = list.map((item: any, index: number) => ({
        key: String(item.id),
        rank: (currentPage.value - 1) * pageSize.value + index + 1,
        name: item.name,
        fullName: item.full_name,
        symbol: item.symbol,
        logoUrl: item.logo_url || '',
        close: item.close,
        increase: item.increase,
        changeValue: item.changeValue,
        closePoints: item.close_points || [],
        tradingview_name: item.tradingview_name || `NASDAQ:${item.symbol}`,
      }))
      total.value = data.total || list.length
      subscribeQuotes(stocks.value, (symbol, data) => {
        const target = stocks.value.find((s) => s.symbol === symbol)
        if (target) {
          if (data.close !== undefined) target.close = data.close
          if (data.increase !== undefined) target.increase = data.increase
          if (data.changeValue !== undefined) target.changeValue = data.changeValue
        }
      })
    }
  } catch (e) {
    console.error('获取股票列表失败', e)
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  unsubscribeAllQuotes()
  currentPage.value = page
  fetchMarkets()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleTrade = (record: StockItem) => {
  router.push({
    path: '/detail',
    query: { symbol: record.symbol, tradingview_name: record.tradingview_name },
  })
}

const columns = computed(() => [
  {
    title: '#',
    dataIndex: 'rank',
    width: 60,
    align: 'center' as const,
    render: ({ record }: any) =>
      h('span', { class: 'text-wise-muted font-medium text-base' }, record.rank),
  },
  {
    title: t('index.market.name'),
    dataIndex: 'name',
    render: ({ record }: any) =>
      h('div', { class: 'flex items-center gap-3.5' }, [
        record.logoUrl
          ? h('img', { src: record.logoUrl, class: 'w-9 h-9 rounded-full flex-shrink-0' })
          : h('div', { class: 'w-9 h-9 rounded-full bg-wise-soft flex items-center justify-center text-sm font-bold text-wise-accentForeground flex-shrink-0' }, record.symbol?.charAt(0)),
        h('div', {}, [
          h('div', { class: 'font-semibold text-wise-text text-[15px] leading-none' }, record.fullName),
          h('div', { class: 'text-xs text-wise-muted tracking-[0.6px] font-mono mt-0.5' }, record.symbol),
        ]),
      ]),
  },
  {
    title: t('index.market.price'),
    dataIndex: 'close',
    width: 150,
    align: 'right' as const,
    render: ({ record }: any) =>
      h('div', { class: 'font-semibold text-wise-text tabular-nums text-[15px]' },
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
        class: `font-medium text-sm tabular-nums ${isUp ? 'text-trend-up' : 'text-trend-down'}`,
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
        class: '!rounded-[9999px] !px-7 !h-9 text-sm font-semibold border-wise-border bg-wise-surface text-wise-text hover:!border-wise-accent hover:!bg-wise-hover hover:!text-wise-accentForeground',
        onClick: () => handleTrade(record),
      }, () => t('index.market.trade')),
  },
])

onMounted(() => {
  fetchMarkets()
})

onUnmounted(() => {
  unsubscribeAllQuotes()
})
</script>

<template>
  <div class="market-list-page min-h-screen bg-wise-page text-wise-text flex flex-col [font-feature-settings:'calt']">
    <Nav />
    <div class="flex-1">
      <div class="max-w-[1180px] mx-auto w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <!-- Header -->
        <div class="market-header mb-9">
          <div>
            <h1 class="text-[34px] font-black leading-[0.92] tracking-[-0.04em] text-wise-text">{{ t('index.market.title') }}</h1>
            <p class="mt-2 text-sm text-wise-muted">{{ t('index.market.viewMore') }}</p>
          </div>
        </div>

        <!-- Table -->
        <Table :data="stocks" :columns="columns" :bordered="false" :pagination="false" :loading="loading"
          :row-class="() => 'hover:bg-wise-hover transition-colors'" class="market-table" style="min-height: 520px;" />

        <!-- Pagination -->
        <div class="flex justify-center mt-8" v-if="total > pageSize">
          <Pagination :total="total" :current="currentPage" :page-size="pageSize" show-total
            @change="handlePageChange" />
        </div>
      </div>
    </div>
    <IndexFooter />
  </div>
</template>

<style>
.market-table .arco-table {
  border-radius: 30px;
  border: 1px solid var(--wise-border);
  background: var(--wise-surface);
  box-shadow: 0 0 0 1px var(--wise-border);
  overflow: hidden;
}

.market-table .arco-table-th {
  color: var(--wise-muted);
  font-weight: 600;
  font-size: 13px;
  padding-bottom: 18px !important;
  background: var(--wise-surface) !important;
  border-bottom: 1px solid var(--wise-border) !important;
}

.market-table .arco-table-td {
  padding: 22px 12px !important;
  border-bottom: 1px solid var(--wise-border-soft);
}

.market-table .arco-table-tr:last-child .arco-table-td {
  border-bottom: none;
}

.market-table .arco-table-container {
  border-radius: 30px;
}

.market-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 28px 32px;
  border: 1px solid var(--wise-border);
  border-radius: 30px;
  background: var(--wise-surface);
  box-shadow: 0 0 0 1px var(--wise-border);
}
</style>
