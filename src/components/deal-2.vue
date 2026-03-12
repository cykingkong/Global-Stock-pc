<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

// 骨架屏加载状态
const isLoading = ref(true)

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
    isUp: true,
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
  {
    pair: 'EOS/BTC',
    base: 'EOS',
    quote: 'BTC',
    price: '0.0022',
    volume: '1,578',
    isUp: true,
    isFavorite: false,
  },
  {
    pair: 'BTC/BTC',
    base: 'BTC',
    quote: 'BTC',
    price: '36,779',
    volume: '3,477,216',
    isUp: true,
    isFavorite: false,
  },
  {
    pair: 'GAS/BTC',
    base: 'GAS',
    quote: 'BTC',
    price: '0.0002',
    volume: '4,189',
    isUp: true,
    isFavorite: false,
  },
])

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 页面加载完成后隐藏骨架屏
onMounted(() => {
  // 等待数据和组件渲染完成
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>

<template>
  <div class="w-full bg-[#F1F2F4] relative">
    <!-- 骨架屏 -->
    <div v-if="isLoading" class="skeleton-container">
      <!-- Chart Skeleton -->
      <div class="skeleton-chart mb-[5px]"></div>

      <!-- Two Column Section Skeleton -->
      <div class="flex gap-[5px]">
        <div class="skeleton-list flex-1"></div>
        <div class="skeleton-trade flex-1"></div>
      </div>
    </div>

    <!-- 真实内容 -->
    <div v-show="!isLoading" class="transition-opacity duration-300" :class="{ 'opacity-100': !isLoading, 'opacity-0': isLoading }">
    <div class="w-full flex flex-col lg:flex-row gap-[7px]">
      <container :symbol="'AAPL'" :theme="'light'" :height="560" class="w-full lg:flex-1" />
    </div>
    <div class="flex w-full gap-[5px] mt-[5px]">
      <!-- 交易对列表 -->
      <div
        class="stock-list w-full lg:w-[50%] bg-white rounded-lg p-4 lg:p-6 border border-gray-100"
      >
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
        <div class="mb-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Search"
              class="w-full h-[40px] pl-4 pr-10 rounded-lg border border-[#E6E8EC] border-solid text-[13px] text-[#23262F] placeholder:text-[#777E90] focus:outline-none focus:border-[#58BD7D] transition-colors"
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 text-[#777E90]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div class="grid grid-cols-3 gap-4 px-3 py-2 mb-2">
          <div
            class="flex items-center gap-1 cursor-pointer text-[13px] font-normal text-[#777E90]"
          >
            Pair
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
          <div
            class="flex items-center gap-1 cursor-pointer text-[13px] font-normal text-[#777E90]"
          >
            Price
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
          <div
            class="flex items-center gap-1 cursor-pointer justify-end text-[13px] font-normal text-[#777E90]"
          >
            Volume
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
        </div>

        <!-- Trade Pairs List -->
        <div class="max-h-[400px] overflow-y-auto">
          <div
            v-for="(item, index) in tradePairs"
            :key="index"
            class="grid grid-cols-3 gap-4 px-3 py-2.5 hover:bg-[#F8F9FA] transition-colors cursor-pointer rounded"
          >
            <!-- Pair Column -->
            <div class="flex items-center gap-2">
              <component
                :is="IconStar"
                :class="item.isFavorite ? 'text-[#FFC107] fill-[#FFC107]' : 'text-[#B1B5C3]'"
                class="w-4 h-4 flex-shrink-0"
              />
              <div class="text-[13px] font-normal">
                <span class="text-[#23262F] font-medium">{{ item.base }}</span>
                <span class="text-[#777E90]">/{{ item.quote }}</span>
              </div>
            </div>

            <!-- Price Column -->
            <div
              class="text-[13px] font-normal"
              :class="item.isUp ? 'text-[#58BD7D]' : 'text-[#FF6838]'"
            >
              {{ item.price }}
            </div>

            <!-- Volume Column -->
            <div class="text-[13px] font-normal text-[#23262F] text-right">
              {{ item.volume }}
            </div>
          </div>
        </div>
      </div>
      <!-- Buy/Sell Content -->
      <div
        class="buy-content w-full lg:w-[50%] bg-white rounded-lg p-4 lg:p-6 border border-gray-100"
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
    <!-- 真实内容结束 -->
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

/* 骨架屏样式 */
.skeleton-container {
  width: 100%;
  animation: fadeIn 0.3s ease-in;
}

.skeleton-chart,
.skeleton-list,
.skeleton-trade {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 8px;
}

.skeleton-chart {
  height: 560px;
  background: white;
  position: relative;
}

.skeleton-chart::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 3px solid #e0e0e0;
  border-top-color: #58BD7D;
  border-radius: 50%;
  animation: skeleton-spin 1s linear infinite;
}

.skeleton-list {
  height: 560px;
  background: white;
}

.skeleton-trade {
  height: 560px;
  background: white;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes skeleton-spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
