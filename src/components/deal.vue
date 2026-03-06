<script setup lang="ts">
import { ref } from 'vue'
import { IconClockCircle, IconCaretDown, IconStar } from '@arco-design/web-vue/es/icon'
import container from './container.vue'
// 定义数据接口
interface StatItem {
  label: string
  value: string
  isUp: boolean
}

// 定义交易对接口
interface TradePair {
  pair: string
  base: string
  quote: string
  price: string
  volume: string
  isUp: boolean
  isFavorite: boolean
}

// 模拟数据：右侧4个数据块
const stats = ref<StatItem[]>([
  { label: '24h High', value: '$ 520.80', isUp: true },
  { label: '24h Low', value: '$ 510.20', isUp: false },
  { label: 'Market Cap', value: '$ 1.2B', isUp: true },
  { label: 'Volume', value: '$ 520.80', isUp: true },
])

// 股票基础信息
const stockInfo = {
  name: 'TSLA',
  desc: 'Tesla, Inc.',
  price: '245.30',
  change: '+1.25%',
  isUp: true,
}

// 展开/收起状态
const isExpanded = ref(false)

// Tab 选择状态
const activeTab = ref<any>('all')

// Buy/Sell 切换状态
const tradeType = ref<'buy' | 'sell'>('buy')

// 交易表单数据
const tradeForm = ref({
  price: '36,641.20',
  quantity: '',
  balance: '10,098.36',
  orderTotal: '0',
  feeRate: '0.1',
})

// 滑块值
const sliderValue = ref(0)

// 模拟交易对数据
const tradePairs = ref<TradePair[]>([
  {
    pair: 'ETC/BTC',
    base: 'ETC',
    quote: 'BTC',
    price: '0.01052',
    volume: '4,189',
    isUp: true,
    isFavorite: false,
  },
  {
    pair: 'NULS/BTC',
    base: 'NULS',
    quote: 'BTC',
    price: '0.00001',
    volume: '16',
    isUp: false,
    isFavorite: false,
  },
  {
    pair: 'NEO/BTC',
    base: 'NEO',
    quote: 'BTC',
    price: '0.01057',
    volume: '199',
    isUp: true,
    isFavorite: false,
  },
  {
    pair: 'LINK/BTC',
    base: 'LINK',
    quote: 'BTC',
    price: '0.0007',
    volume: '1,371',
    isUp: false,
    isFavorite: false,
  },
  {
    pair: 'IOTA/BTC',
    base: 'IOTA',
    quote: 'BTC',
    price: '0.0003',
    volume: '186',
    isUp: false,
    isFavorite: false,
  },
  {
    pair: 'ETC/BTC',
    base: 'ETC',
    quote: 'BTC',
    price: '0.00017',
    volume: '833',
    isUp: false,
    isFavorite: false,
  },
  {
    pair: 'KNC/BTC',
    base: 'KNC',
    quote: 'BTC',
    price: '0.00022',
    volume: '160',
    isUp: false,
    isFavorite: false,
  },
  {
    pair: 'WTC/BTC',
    base: 'WTC',
    quote: 'BTC',
    price: '0.0002',
    volume: '32',
    isUp: false,
    isFavorite: true,
  },
])

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="w-full bg-[#F1F2F4]">
    <!-- 
      Header Container 
      lg:h-[96px] -> 桌面端固定高度
      lg:flex-row -> 桌面端横向排列
      flex-col -> 移动端纵向排列
      lg:items-center -> 桌面端垂直居中
    -->
    <div
      class="bg-[#fff] mb-[5px] flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 lg:px-[20px] py-4 lg:h-[96px] w-full border-b border-gray-100"
    >
      <!-- Left Section: Stock Info -->
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-[32px] w-full lg:w-auto mb-4 lg:mb-0">
        <!-- Logo & Name -->
        <div class="flex items-center gap-3 lg:gap-4">
          <!-- Tag -->
          <div
            class="h-[24px] rounded-[40px] w-[40px] bg-[#58BD7D] flex justify-center items-center text-white text-[10px] font-bold shrink-0"
          >
            {{ stockInfo.name.substring(0, 2) }}
          </div>

          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <div class="stock-name font-bold text-[18px] lg:text-[24px] leading-tight">
                {{ stockInfo.name }}
              </div>
              <!-- Mobile Price Display (Moved next to name for mobile convenience) -->
              <div
                class="lg:hidden text-[14px] font-bold"
                :class="stockInfo.isUp ? 'text-[#FF6838]' : 'text-[#00C076]'"
              >
                {{ stockInfo.price }}
              </div>
            </div>
            <div class="desc font-medium text-[12px] text-[#777E90] mt-[2px]">
              {{ stockInfo.desc }}
            </div>
          </div>
        </div>

        <!-- Desktop Price & Trend (Hidden on Mobile) -->
        <div class="hidden lg:flex items-center gap-3 border-l border-gray-200 pl-[32px]">
          <div
            class="font-bold text-[24px]"
            :class="stockInfo.isUp ? 'text-[#FF6838]' : 'text-[#00C076]'"
          >
            {{ stockInfo.price }}
          </div>
          <!-- Arco Icon Caret Down for Trend - Clickable -->
          <div
            class="p-1 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all"
            @click="toggleExpand"
          >
            <component
              :is="IconCaretDown"
              :class="[
                stockInfo.isUp ? 'text-[#FF6838]' : 'text-[#00C076]',
                'transition-transform duration-300',
                { 'rotate-180': isExpanded },
              ]"
            />
          </div>
        </div>

        <!-- Mobile Expand Button -->
        <div
          class="lg:hidden p-1 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all mt-2"
          @click="toggleExpand"
        >
          <component
            :is="IconCaretDown"
            :class="[
              'text-gray-600',
              'transition-transform duration-300',
              { 'rotate-180': isExpanded },
            ]"
          />
        </div>
      </div>

      <!-- Right Section: Stats Grid -->
      <!-- 
        Grid Layout:
        Mobile: grid-cols-2 (2列)
        Desktop: flex-row (横向排列)
      -->
      <div class="grid grid-cols-2 lg:flex gap-4 lg:gap-[24px] w-full lg:w-auto">
        <div
          v-for="(item, index) in stats"
          :key="index"
          class="flex flex-col justify-center min-w-[120px] lg:min-w-[160px]"
          :class="{
            'lg:border-r border-gray-200': index !== stats.length - 1, // 桌面端除了最后一个都加右边框
            'pr-4 lg:pr-0': index % 2 === 0 && index !== stats.length - 1, // 移动端网格列间距处理（可选，此处用gap处理）
          }"
        >
          <div class="flex items-center gap-[4px] text-[#777E90] mb-1">
            <IconClockCircle class="w-[14px] h-[14px]" />
            <span class="text-[12px] font-medium">{{ item.label }}</span>
          </div>
          <div
            class="num text-[14px] lg:text-[14px] font-bold"
            :class="item.isUp ? 'text-trend-up text-[#FF6838]' : 'text-trend-down text-[#00C076]'"
          >
            {{ item.value }}
            <span class="text-xs opacity-80">{{ item.isUp ? '+1.25%' : '-1.25%' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Expandable Trade Pairs Section -->
    <div
      class="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
      :style="{ maxHeight: isExpanded ? '500px' : '0' }"
    >
      <div class="w-full px-4 py-4 bg-gray-50">
        <!-- Tab Selection -->
        <div class="flex items-center gap-5 mb-4">
          <button
            v-for="tab in ['all', 'cross', 'isolated']"
            :key="tab"
            @click="activeTab = tab"
            class="text-[14px] transition-colors capitalize"
            :class="
              activeTab === tab
                ? 'text-[#23262F] font-semibold'
                : 'text-[#777E90] font-normal hover:text-gray-600'
            "
          >
            {{ tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>

        <!-- Search Box -->
        <div class="mb-3">
          <div class="relative">
            <input
              type="text"
              placeholder="Search"
              class="w-full h-[36px] pl-3 pr-9 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-[#58BD7D] transition-colors"
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Table Header -->
        <div
          class="grid grid-cols-3 gap-2 px-3 py-2 text-[11px] font-medium text-[#777E90] border-b border-gray-200"
        >
          <div class="flex items-center gap-1 cursor-pointer">
            Pair
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
          <div class="flex items-center gap-1 cursor-pointer">
            Price
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
          <div class="flex items-center gap-1 cursor-pointer justify-end">
            Volume
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
        </div>

        <!-- Trade Pairs List -->
        <div class="max-h-[320px] overflow-y-auto">
          <div
            v-for="(item, index) in tradePairs"
            :key="index"
            class="grid grid-cols-3 gap-2 px-3 py-2.5 hover:bg-white transition-colors cursor-pointer"
          >
            <!-- Pair Column -->
            <div class="flex items-center gap-1.5">
              <component
                :is="IconStar"
                :class="item.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                class="w-3.5 h-3.5 flex-shrink-0"
              />
              <div class="text-[12px] font-medium text-gray-900">
                <span class="font-bold">{{ item.base }}</span>
                <span class="text-gray-400">/{{ item.quote }}</span>
              </div>
            </div>

            <!-- Price Column -->
            <div
              class="text-[12px] font-medium"
              :class="item.isUp ? 'text-[#00C076]' : 'text-[#FF6838]'"
            >
              {{ item.price }}
            </div>

            <!-- Volume Column -->
            <div class="text-[12px] font-medium text-gray-900 text-right">
              {{ item.volume }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop: Absolute Positioned Trade Pairs Dropdown -->
    <div class="hidden lg:block relative">
      <div
        v-show="isExpanded"
        class="absolute left-[20px] top-[0px] w-[256px] bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-300"
        :class="{ 'opacity-100': isExpanded, 'opacity-0 pointer-events-none': !isExpanded }"
      >
        <!-- Tab Selection -->
        <div class="flex items-center gap-5 px-4 pt-4 mb-3">
          <button
            v-for="tab in ['all', 'cross', 'isolated']"
            :key="tab"
            @click="activeTab = tab"
            class="text-[14px] transition-colors capitalize"
            :class="
              activeTab === tab
                ? 'text-[#23262F] font-semibold'
                : 'text-[#777E90] font-normal hover:text-gray-600'
            "
          >
            {{ tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>

        <!-- Search Box -->
        <div class="mb-3 px-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Search"
              class="w-full h-[36px] pl-3 pr-9 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-[#58BD7D] transition-colors"
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Table Header -->
        <div
          class="grid grid-cols-3 gap-2 px-4 py-2 text-[11px] font-medium text-[#777E90] border-b border-gray-200"
        >
          <div class="flex items-center gap-1 cursor-pointer">
            Pair
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
          <div class="flex items-center gap-1 cursor-pointer">
            Price
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
          <div class="flex items-center gap-1 cursor-pointer justify-end">
            Volume
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
        </div>

        <!-- Trade Pairs List -->
        <div class="max-h-[400px] overflow-y-auto pb-2">
          <div
            v-for="(item, index) in tradePairs"
            :key="index"
            class="grid grid-cols-3 gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <!-- Pair Column -->
            <div class="flex items-center gap-1.5">
              <component
                :is="IconStar"
                :class="item.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                class="w-3.5 h-3.5 flex-shrink-0"
              />
              <div class="text-[12px] font-medium text-gray-900">
                <span class="font-bold">{{ item.base }}</span>
                <span class="text-gray-400">/{{ item.quote }}</span>
              </div>
            </div>

            <!-- Price Column -->
            <div
              class="text-[12px] font-medium"
              :class="item.isUp ? 'text-[#00C076]' : 'text-[#FF6838]'"
            >
              {{ item.price }}
            </div>

            <!-- Volume Column -->
            <div class="text-[12px] font-medium text-gray-900 text-right">
              {{ item.volume }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col lg:flex-row gap-[7px]">
      <container :symbol="'AAPL'" :theme="'light'" :height="560" class="w-full lg:flex-1" />

      <!-- Buy/Sell Content -->
      <div
        class="buy-content w-full lg:w-[360px] bg-white rounded-lg p-4 lg:p-6 border border-gray-100"
      >
        <!-- Buy/Sell Toggle -->
        <div class="flex items-center gap-2 mb-6">
          <button
            @click="tradeType = 'buy'"
            class="px-6 py-2 rounded-full text-[14px] font-medium transition-all"
            :class="
              tradeType === 'buy'
                ? 'bg-gray-200 text-gray-900'
                : 'bg-transparent text-[#777E90] hover:text-gray-600'
            "
          >
            Buy
          </button>
          <button
            @click="tradeType = 'sell'"
            class="px-6 py-2 rounded-full text-[14px] font-medium transition-all"
            :class="
              tradeType === 'sell'
                ? 'bg-gray-200 text-gray-900'
                : 'bg-transparent text-[#777E90] hover:text-gray-600'
            "
          >
            Sell
          </button>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-[20px] lg:text-[24px] font-bold text-gray-900">
            {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} {{ stockInfo.name }}
          </h3>
          <div class="flex items-center gap-1.5 text-[14px] text-gray-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span class="font-medium">$ {{ tradeForm.balance }}</span>
          </div>
        </div>

        <!-- Price Input -->
        <div class="mb-4">
          <div
            class="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <span class="text-[14px] text-[#777E90]">价格</span>
            <span class="text-[14px] font-medium text-gray-900">$ {{ tradeForm.price }}</span>
          </div>
        </div>

        <!-- Quantity Input -->
        <div class="mb-4">
          <div
            class="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 focus-within:border-[#58BD7D]"
          >
            <span class="text-[14px] text-[#777E90]">数量</span>
            <div class="flex items-center gap-2">
              <input
                v-model="tradeForm.quantity"
                type="text"
                placeholder=""
                class="text-right text-[14px] font-medium text-gray-900 outline-none border-none bg-transparent w-24"
              />
              <span class="text-[14px] text-[#58BD7D] font-medium">{{ stockInfo.name }}</span>
            </div>
          </div>
        </div>

        <!-- Slider -->
        <div class="mb-6">
          <input
            v-model="sliderValue"
            type="range"
            min="0"
            max="100"
            class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <!-- Order Total -->
        <div class="mb-6">
          <div
            class="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <span class="text-[14px] text-[#777E90]">订单价格</span>
            <span class="text-[14px] font-medium text-gray-900">$ {{ tradeForm.orderTotal }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          class="w-full py-3.5 rounded-xl text-[16px] font-semibold text-white transition-all hover:opacity-90"
          :class="tradeType === 'buy' ? 'bg-[#58BD7D]' : 'bg-[#FF6838]'"
        >
          {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} {{ stockInfo.name }}
        </button>

        <!-- Fee Rate -->
        <div class="flex items-center justify-between mt-4 text-[13px]">
          <span class="text-[#777E90]">手续费率(%)</span>
          <span class="text-gray-900 font-medium">{{ tradeForm.feeRate }}%</span>
        </div>
      </div>
    </div>
    <div class="w-full order-list mt-[5px]">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Custom Slider Styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #58bd7d;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #58bd7d;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
