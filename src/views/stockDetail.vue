<template>
  <div class="detail w-full min-h-screen bg-[#F1F2F4]">
    <Nav />
    <deal2>
      <div class="order w-full bg-white rounded-lg p-4 lg:p-6">
        <!-- Tab Selection -->
        <div class="flex items-center gap-8 mb-6">
          <button
            class="text-[13px] font-medium transition-all text-[#23262F] font-semibold"
          >
            {{ t('stockDetail.holdingsTitle') }}
          </button>
          <!--
          <button v-for="tab in tabs" :key="tab.key" @click="activeOrderTab = tab.key"
            class="text-[13px] font-medium transition-all" :class="activeOrderTab === tab.key
                ? 'text-[#23262F] font-semibold'
                : 'text-[#777E90] hover:text-gray-600'
              ">
            {{ tab.label }}
          </button>
          -->
        </div>

        <!-- Table -->
        <div v-if="loading" class="py-12 text-center text-[#777E90]">{{ t('stockDetail.loading') }}</div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[1000px]">
            <!-- Table Header -->
            <thead class="bg-[#F8F9FA]">
              <tr>
                <th v-for="column in currentTableColumns" :key="column.key"
                  class="text-left py-3 px-4 text-[13px] font-normal text-[#777E90] first:pl-6 last:pr-6" :class="column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : ''
                    ">
                  {{ column.label }}
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="bg-white">
              <tr v-for="(row, index) in currentTableData" :key="index"
                class="border-b border-[#F1F2F4] hover:bg-[#FAFAFA] transition-colors">
                <td v-for="column in currentTableColumns" :key="column.key"
                  class="py-4 px-4 text-[14px] first:pl-6 last:pr-6" :class="column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : ''
                    ">
                  <!-- Stock Name (持仓页面特殊处理 - 两行) -->
                  <div
                    v-if="column.key === 'stock' && activeOrderTab === 'holdings'"
                    class="flex items-center gap-3"
                  >
                    <div v-if="row.logoUrl" class="w-8 h-8 rounded-full overflow-hidden bg-[#F3F4F6] shrink-0">
                      <img :src="row.logoUrl" alt="" class="w-full h-full object-cover">
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-normal text-[14px] text-[#23262F] truncate">{{ row.stock }}</span>
                      <span class="text-[12px] text-[#777E90] truncate">{{ row.stockName }}</span>
                    </div>
                  </div>

                  <!-- Stock Name (普通) -->
                  <div
                    v-else-if="column.key === 'stock'"
                    class="flex items-center gap-3"
                  >
                    <div v-if="row.logoUrl" class="w-8 h-8 rounded-full overflow-hidden bg-[#F3F4F6] shrink-0">
                      <img :src="row.logoUrl" alt="" class="w-full h-full object-cover">
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-normal text-[14px] text-[#23262F] truncate">{{ row.stock }}</span>
                      <span v-if="row.stockName" class="text-[12px] text-[#777E90] truncate">{{ row.stockName }}</span>
                    </div>
                  </div>

                  <!-- Direction -->
                  <span v-else-if="column.key === 'direction'"
                    class="inline-block px-2.5 py-1 rounded text-[12px] font-normal text-white"
                    :class="row.direction === 'buy' ? 'bg-[#FF3B30]' : 'bg-[#34C759]'">
                    {{ row.direction }}
                  </span>

                  <!-- 现价/成本 (两行) -->
                  <div v-else-if="column.key === 'priceAndCost'" class="flex flex-col gap-0.5">
                    <span class="font-normal text-[14px] text-[#34C759]">$ {{ row.currentPrice }}</span>
                    <span class="font-normal text-[14px] text-[#23262F]">$ {{ row.costPrice }}</span>
                  </div>

                  <!-- 持仓/可用 (两行) -->
                  <div v-else-if="column.key === 'holdingAndAvailable'" class="flex flex-col gap-0.5">
                    <span class="font-normal text-[14px] text-[#23262F]">{{ row.holding }}</span>
                    <span class="font-normal text-[14px] text-[#23262F]">{{ row.available }}</span>
                  </div>

                  <!-- 市值 -->
                  <span v-else-if="column.key === 'marketValue'" class="font-normal text-[14px] text-[#23262F]">
                    $ {{ row.marketValue }}
                  </span>

                  <!-- 仓位 -->
                  <span v-else-if="column.key === 'position'" class="font-normal text-[14px] text-[#23262F]">
                    {{ row.position }}
                  </span>

                  <!-- 持仓盈亏 (两行) -->
                  <div v-else-if="column.key === 'profit' && activeOrderTab === 'holdings'"
                    class="flex flex-col gap-0.5">
                    <span class="font-normal text-[14px]" :class="parseFloat(row.profitAmount) >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'"
">
                      {{ row.profitAmount }}
                    </span>
                    <span class="font-normal text-[14px]"
                      :class="parseFloat(row.profitRate) >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'">
                      {{ row.profitRate }}
                    </span>
                  </div>

                  <!-- 操作按钮 -->
                  <div v-else-if="column.key === 'actions'" class="flex items-center gap-2">
                    <button
                      class="px-4 py-1 bg-[#58BD7D] text-white text-[12px] font-normal rounded hover:opacity-90 transition-opacity">
                      {{ t('stockDetail.buy') }}
                    </button>
                    <button
                      class="px-4 py-1 bg-[#58BD7D] text-white text-[12px] font-normal rounded hover:opacity-90 transition-opacity">
                      {{ t('stockDetail.sell') }}
                    </button>
                  </div>

                  <!-- Price (委托价/成交价) -->
                  <span v-else-if="column.key === 'price' || column.key === 'tradePrice'"
                    class="font-semibold text-[14px] text-[#23262F]">
                    {{ row[column.key] === '--' ? '--' : `$ ${row[column.key]}` }}
                  </span>

                  <!-- Quantity/Volume (委托量/成交量) -->
                  <span v-else-if="
                    column.key === 'quantity' ||
                    column.key === 'filled' ||
                    column.key === 'tradeQuantity'
                  " class="font-normal text-[14px] text-[#23262F]">
                    {{ row[column.key] }}
                  </span>

                  <!-- 成交额 -->
                  <span v-else-if="column.key === 'tradeAmount'" class="font-normal text-[14px] text-[#23262F]">
                    {{ row.tradeAmount === '--' ? '--' : `$ ${row.tradeAmount}` }}
                  </span>

                  <!-- 手续费 -->
                  <span v-else-if="column.key === 'fee'" class="font-normal text-[14px] text-[#23262F]">
                    {{ row.fee === '--' ? '--' : `$ ${row.fee}` }}
                  </span>

                  <!-- Time -->
                  <span v-else-if="column.key === 'time'" class="font-normal text-[14px] text-[#23262F]">
                    {{ row.time }}
                  </span>

                  <!-- Status -->
                  <span v-else-if="column.key === 'status'"
                    class="inline-block px-2.5 py-1 rounded text-[12px] font-normal text-white"
                    :class="row.status === '已成交' ? 'bg-[#58BD7D]' : 'bg-[#F59E0B]'">
                    {{ row.status }}
                  </span>

                  <!-- Default -->
                  <span v-else class="font-normal text-[14px] text-[#23262F]">
                    {{ row[column.key] }}
                  </span>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="currentTableData.length === 0">
                <td :colspan="currentTableColumns.length" class="py-12 text-center text-[#777E90]">
                  <div class="flex flex-col items-center gap-2">
                    <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span class="text-[14px]">{{ t('stockDetail.noData') }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </deal2>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import deal2 from '@/components/deal-2.vue'
import Nav from '@/components/Nav.vue'
import { orderList } from '@/api/stock'

const activeOrderTab = ref('holdings')
const loading = ref(false)
const { t } = useI18n()
// const currentOrdersData = ref([])
const holdingsData = ref([])

// const tabs = [
//   { key: 'current', label: '当前委托' },
//   { key: 'holdings', label: '我的持仓' },
//   { key: 'all', label: '全部订单' },
// ]

const tableColumnsConfig = {
  // current: [
  //   { key: 'stock', label: '股票', align: 'left' },
  //   { key: 'direction', label: '方向', align: 'left' },
  //   { key: 'price', label: '委托价', align: 'left' },
  //   { key: 'quantity', label: '委托量', align: 'left' },
  //   { key: 'filled', label: '已成交', align: 'left' },
  //   { key: 'time', label: '时间', align: 'left' },
  //   { key: 'status', label: '状态', align: 'left' },
  // ],
  holdings: [
    { key: 'stock', label: '股票', align: 'left' },
    { key: 'priceAndCost', label: '现价/成本', align: 'left' },
    { key: 'holdingAndAvailable', label: '持仓/可用', align: 'left' },
    { key: 'marketValue', label: '市值', align: 'left' },
    { key: 'position', label: '仓位', align: 'left' },
    { key: 'profit', label: '持仓盈亏', align: 'left' },
    { key: 'actions', label: '操作', align: 'left' },
  ],
  // all: [
  //   { key: 'stock', label: '股票', align: 'left' },
  //   { key: 'direction', label: '方向', align: 'left' },
  //   { key: 'tradePrice', label: '成交价', align: 'left' },
  //   { key: 'tradeQuantity', label: '成交量', align: 'left' },
  //   { key: 'tradeAmount', label: '成交额', align: 'left' },
  //   { key: 'fee', label: '手续费', align: 'left' },
  //   { key: 'time', label: '时间', align: 'left' },
  // ],
}

function formatNumber(value, digits = 2) {
  const num = Number(value || 0)
  return num.toFixed(digits)
}

function formatSignedNumber(value, digits = 2) {
  const num = Number(value || 0)
  const formatted = num.toFixed(digits)
  return num > 0 ? `+${formatted}` : formatted
}

function formatPercent(value, digits = 2) {
  const num = Number(value || 0)
  const formatted = `${num.toFixed(digits)}%`
  return num > 0 ? `+${formatted}` : formatted
}

function mapDirection(type) {
  return type === 'sell' ? t('stockDetail.sell') : t('stockDetail.buy')
}

function mapStatus(status) {
  const statusMap = {
    pending: t('stockDetail.status.pending'),
    completed: t('stockDetail.status.completed'),
    filled: t('stockDetail.status.completed'),
    cancelled: t('stockDetail.status.cancelled'),
    canceled: t('stockDetail.status.cancelled'),
    rejected: t('stockDetail.status.rejected'),
  }

  return statusMap[status] || status || '--'
}

// function mapCurrentOrder(item) {
//   const price = Number(item?.price || item?.current_price || 0)
//   const filled = Number(item?.filled_quantity || 0)
//
//   return {
//     stock: item?.stock_symbol || item?.symbol || '--',
//     stockName: item?.stock_full_name || item?.full_name || item?.name || '--',
//     logoUrl: item?.logo_url || '',
//     direction: mapDirection(item?.type),
//     price: formatNumber(price),
//     quantity: item?.quentity ?? '--',
//     filled: item?.filled_quantity ?? '--',
//     time: item?.created_at || '--',
//     status: mapStatus(item?.status),
//     tradePrice: formatNumber(price),
//     tradeQuantity: filled || '--',
//     tradeAmount: filled ? formatNumber(price * filled) : '--',
//     fee: '--',
//   }
// }

function mapHolding(item) {
  return {
    stock: item?.stock_symbol || item?.symbol || '--',
    stockName: item?.stock_full_name || item?.full_name || item?.stock_name || item?.name || '--',
    logoUrl: item?.logo_url || '',
    currentPrice: formatNumber(item?.symbol_price ?? item?.current_price ?? item?.close),
    costPrice: formatNumber(item?.average_price),
    holding: item?.positions_num ?? item?.quantity ?? '--',
    available: item?.quantity ?? '--',
    marketValue: formatNumber(item?.market_value),
    position: `${Number(item?.positions_ratio || 0).toFixed(2)}%`,
    profitAmount: formatSignedNumber(item?.profit_loss),
    profitRate: formatPercent(item?.profit_loss_ratio ?? item?.profit_loss_percent),
  }
}

async function fetchTableData() {
  loading.value = true
  try {
    const { data: holdingsRes } = await orderList({ page: 1, size: 20 })
    const holdingsList = holdingsRes?.list || holdingsRes?.positions || []

    holdingsData.value = holdingsList.map(mapHolding)
  }
  catch (error) {
    console.error('获取股票详情表格数据失败:', error)
    Message.error(error?.message || t('stockDetail.loadFailed'))
    holdingsData.value = []
  }
  finally {
    loading.value = false
  }
}

const tableDataConfig = computed(() => ({
  // current: currentOrdersData.value,
  holdings: holdingsData.value,
  // all: currentOrdersData.value,
}))

const currentTableColumns = computed(() => tableColumnsConfig[activeOrderTab.value] || [])
const currentTableData = computed(() => tableDataConfig.value[activeOrderTab.value] || [])

onMounted(() => {
  fetchTableData()
})
</script>
