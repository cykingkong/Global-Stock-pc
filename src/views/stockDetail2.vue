<template>
  <div class="detail w-full min-h-screen bg-[#F1F2F4]">
    <Nav />
    <deal>
      <div class="order w-full bg-white rounded-lg p-4 lg:p-6">
        <!-- Tab Selection -->
        <div class="flex items-center gap-8 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeOrderTab = tab.key"
            class="text-[13px] font-medium transition-all"
            :class="
              activeOrderTab === tab.key
                ? 'text-[#23262F] font-semibold'
                : 'text-[#777E90] hover:text-gray-600'
            "
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1000px]">
            <!-- Table Header -->
            <thead class="bg-[#F8F9FA]">
              <tr>
                <th
                  v-for="column in currentTableColumns"
                  :key="column.key"
                  class="text-left py-3 px-4 text-[13px] font-normal text-[#777E90] first:pl-6 last:pr-6"
                  :class="
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : ''
                  "
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="bg-white">
              <tr
                v-for="(row, index) in currentTableData"
                :key="index"
                class="border-b border-[#F1F2F4] hover:bg-[#FAFAFA] transition-colors"
              >
                <td
                  v-for="column in currentTableColumns"
                  :key="column.key"
                  class="py-4 px-4 text-[14px] first:pl-6 last:pr-6"
                  :class="
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : ''
                  "
                >
                  <!-- Stock Name (持仓页面特殊处理 - 两行) -->
                  <div
                    v-if="column.key === 'stock' && activeOrderTab === 'holdings'"
                    class="flex flex-col gap-0.5"
                  >
                    <span class="font-normal text-[14px] text-[#23262F]">{{ row.stock }}</span>
                    <span class="text-[12px] text-[#777E90]">{{ row.stockName }}</span>
                  </div>

                  <!-- Stock Name (普通) -->
                  <span
                    v-else-if="column.key === 'stock'"
                    class="font-normal text-[14px] text-[#23262F]"
                  >
                    {{ row.stock }}
                  </span>

                  <!-- Direction -->
                  <span
                    v-else-if="column.key === 'direction'"
                    class="inline-block px-2.5 py-1 rounded text-[12px] font-normal text-white"
                    :class="row.direction === '买入' ? 'bg-[#FF6838]' : 'bg-[#58BD7D]'"
                  >
                    {{ row.direction }}
                  </span>

                  <!-- 现价/成本 (两行) -->
                  <div v-else-if="column.key === 'priceAndCost'" class="flex flex-col gap-0.5">
                    <span class="font-normal text-[14px] text-[#58BD7D]"
                      >$ {{ row.currentPrice }}</span
                    >
                    <span class="font-normal text-[14px] text-[#23262F]"
                      >$ {{ row.costPrice }}</span
                    >
                  </div>

                  <!-- 持仓/可用 (两行) -->
                  <div
                    v-else-if="column.key === 'holdingAndAvailable'"
                    class="flex flex-col gap-0.5"
                  >
                    <span class="font-normal text-[14px] text-[#23262F]">{{ row.holding }}</span>
                    <span class="font-normal text-[14px] text-[#23262F]">{{ row.available }}</span>
                  </div>

                  <!-- 市值 -->
                  <span
                    v-else-if="column.key === 'marketValue'"
                    class="font-normal text-[14px] text-[#23262F]"
                  >
                    $ {{ row.marketValue }}
                  </span>

                  <!-- 仓位 -->
                  <span
                    v-else-if="column.key === 'position'"
                    class="font-normal text-[14px] text-[#23262F]"
                  >
                    {{ row.position }}
                  </span>

                  <!-- 持仓盈亏 (两行) -->
                  <div
                    v-else-if="column.key === 'profit' && activeOrderTab === 'holdings'"
                    class="flex flex-col gap-0.5"
                  >
                    <span
                      class="font-normal text-[14px]"
                      :class="
                        parseFloat(row.profitAmount) >= 0 ? 'text-[#58BD7D]' : 'text-[#FF6838]'
                      "
                    >
                      {{ row.profitAmount }}
                    </span>
                    <span
                      class="font-normal text-[14px]"
                      :class="parseFloat(row.profitRate) >= 0 ? 'text-[#58BD7D]' : 'text-[#FF6838]'"
                    >
                      {{ row.profitRate }}
                    </span>
                  </div>

                  <!-- 操作按钮 -->
                  <div v-else-if="column.key === 'actions'" class="flex items-center gap-2">
                    <button
                      class="px-4 py-1 bg-[#58BD7D] text-white text-[12px] font-normal rounded hover:opacity-90 transition-opacity"
                    >
                      买入
                    </button>
                    <button
                      class="px-4 py-1 bg-[#58BD7D] text-white text-[12px] font-normal rounded hover:opacity-90 transition-opacity"
                    >
                      卖出
                    </button>
                  </div>

                  <!-- Price (委托价/成交价) -->
                  <span
                    v-else-if="column.key === 'price' || column.key === 'tradePrice'"
                    class="font-semibold text-[14px] text-[#23262F]"
                  >
                    $ {{ row[column.key] }}
                  </span>

                  <!-- Quantity/Volume (委托量/成交量) -->
                  <span
                    v-else-if="
                      column.key === 'quantity' ||
                      column.key === 'filled' ||
                      column.key === 'tradeQuantity'
                    "
                    class="font-normal text-[14px] text-[#23262F]"
                  >
                    {{ row[column.key] }}
                  </span>

                  <!-- 成交额 -->
                  <span
                    v-else-if="column.key === 'tradeAmount'"
                    class="font-normal text-[14px] text-[#23262F]"
                  >
                    $ {{ row.tradeAmount }}
                  </span>

                  <!-- 手续费 -->
                  <span
                    v-else-if="column.key === 'fee'"
                    class="font-normal text-[14px] text-[#23262F]"
                  >
                    $ {{ row.fee }}
                  </span>

                  <!-- Time -->
                  <span
                    v-else-if="column.key === 'time'"
                    class="font-normal text-[14px] text-[#23262F]"
                  >
                    {{ row.time }}
                  </span>

                  <!-- Status -->
                  <span
                    v-else-if="column.key === 'status'"
                    class="inline-block px-2.5 py-1 rounded text-[12px] font-normal text-white bg-[#58BD7D]"
                  >
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
                    <svg
                      class="w-12 h-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <span class="text-[14px]">暂无数据</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </deal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import deal from '@/components/deal.vue'
import Nav from '@/components/Nav.vue'

// 当前激活的 tab
const activeOrderTab = ref('current')

// Tab 配置
const tabs = [
  { key: 'current', label: '当前委托' },
  { key: 'holdings', label: '我的持仓' },
  { key: 'all', label: '全部订单' },
]

// 不同 tab 对应的表头配置
const tableColumnsConfig = {
  current: [
    { key: 'stock', label: '股票', align: 'left' },
    { key: 'direction', label: '方向', align: 'left' },
    { key: 'price', label: '委托价', align: 'left' },
    { key: 'quantity', label: '委托量', align: 'left' },
    { key: 'filled', label: '已成交', align: 'left' },
    { key: 'time', label: '时间', align: 'left' },
    { key: 'status', label: '状态', align: 'left' },
  ],
  holdings: [
    { key: 'stock', label: '股票', align: 'left' },
    { key: 'priceAndCost', label: '现价/成本', align: 'left' },
    { key: 'holdingAndAvailable', label: '持仓/可用', align: 'left' },
    { key: 'marketValue', label: '市值', align: 'left' },
    { key: 'position', label: '仓位', align: 'left' },
    { key: 'profit', label: '持仓盈亏', align: 'left' },
    { key: 'actions', label: '操作', align: 'left' },
  ],
  all: [
    { key: 'stock', label: '股票', align: 'left' },
    { key: 'direction', label: '方向', align: 'left' },
    { key: 'tradePrice', label: '成交价', align: 'left' },
    { key: 'tradeQuantity', label: '成交量', align: 'left' },
    { key: 'tradeAmount', label: '成交额', align: 'left' },
    { key: 'fee', label: '手续费', align: 'left' },
    { key: 'time', label: '时间', align: 'left' },
  ],
}

// 模拟数据
const tableDataConfig = {
  current: [
    {
      stock: 'AAPL',
      direction: '买入',
      price: '127.07',
      quantity: '100',
      filled: '100',
      time: '2025-02-04 05:07:01',
      status: '已成交',
    },
    {
      stock: 'TSLA',
      direction: '卖出',
      price: '245.30',
      quantity: '50',
      filled: '50',
      time: '2025-02-04 04:15:23',
      status: '已成交',
    },
  ],
  holdings: [
    {
      stock: 'AAPL',
      stockName: 'Apple Inc',
      currentPrice: '127.07',
      costPrice: '127.01',
      holding: '100',
      available: '0',
      marketValue: '12707',
      position: '100%',
      profitAmount: '-8.00',
      profitRate: '-0.7%',
    },
    {
      stock: 'TSLA',
      stockName: 'Tesla Inc',
      currentPrice: '245.30',
      costPrice: '240.50',
      holding: '50',
      available: '50',
      marketValue: '12265',
      position: '85%',
      profitAmount: '+240.00',
      profitRate: '+2.0%',
    },
  ],
  all: [
    {
      stock: 'AAPL',
      direction: '买入',
      tradePrice: '127.07',
      tradeQuantity: '100',
      tradeAmount: '12707',
      fee: '12.707',
      time: '2025-02-04 05:07:01',
    },
    {
      stock: 'TSLA',
      direction: '卖出',
      tradePrice: '245.30',
      tradeQuantity: '50',
      tradeAmount: '12265',
      fee: '12.265',
      time: '2025-02-04 04:15:23',
    },
  ],
}

// 当前表头
const currentTableColumns = computed(() => tableColumnsConfig[activeOrderTab.value] || [])

// 当前表格数据
const currentTableData = computed(() => tableDataConfig[activeOrderTab.value] || [])
</script>
