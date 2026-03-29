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

onMounted(() => {
  fetchMarkets()
})

onUnmounted(() => {
  unsubscribeAllQuotes()
})
</script>

<template>
  <div class="market-list-page min-h-screen bg-[#FCFCFD] flex flex-col">
    <Nav />
    <div class="flex-1">
      <div class="max-w-[1180px] mx-auto px-8 py-12">
        <!-- Header -->
        <div class="market-header mb-9">
          <div>
            <h1 class="text-[34px] font-semibold tracking-[-0.5px] text-zinc-950">{{ t('index.market.title') }}</h1>
            <p class="text-sm text-zinc-500 mt-2">{{ t('index.market.viewMore') }}</p>
          </div>
        </div>

        <!-- Table -->
        <Table :data="stocks" :columns="columns" :bordered="false" :pagination="false" :loading="loading"
          :row-class="() => 'hover:bg-zinc-50/70 transition-colors'" class="market-table" style="min-height: 520px;" />

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

.market-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 24px 28px;
  border: 1px solid #e6e8ec;
  border-radius: 16px;
  background: linear-gradient(130deg, #ffffff, #f9fafb);
}
</style>
