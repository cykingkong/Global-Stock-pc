<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconClockCircle, IconCaretDown, IconStar } from '@arco-design/web-vue/es/icon'
import { getStockDetail, buyStock, sellStock } from '@/api/market'
// @ts-ignore
import { useMarketStore } from '@/stores/market'
import { Message } from '@arco-design/web-vue'
import useUserStore from '@/stores/user'
import container from './container.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const router = useRouter()
const route = useRoute()
const marketStore = useMarketStore()

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
  symbol: string
  tradingview_name: string
}

// 模拟数据：右侧4个数据块
const stats = ref<StatItem[]>([
  { label: '24h High', value: '$ 520.80', isUp: true },
  { label: '24h Low', value: '$ 510.20', isUp: false },
  { label: 'Market Cap', value: '$ 1.2B', isUp: true },
  { label: 'Volume', value: '$ 520.80', isUp: true },
])
const userHasStockQuantity = ref(0)
// 当前股票 symbol
const currentSymbol = ref('AAPL')
const currentTradingViewName = ref('NASDAQ:AAPL')

// 股票基础信息
const stockInfo = ref({
  name: '',
  fullName: '',
  price: 0,
  change: '',
  isUp: true,
})

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

// 买入表单数据
const buyForm = ref({
  quantity: '',
})

// 卖出表单数据
const sellForm = ref({
  quantity: '',
})

// 滑块值
const sliderValue = ref(0)
const buySliderValue = ref(0)
const sellSliderValue = ref(0)

// 提交中状态
const submitting = ref(false)

// 骨架屏加载状态
const isLoading = ref(true)

// 从 store 获取股票列表并转换为交易对格式
const tradePairs = computed(() => {
  return marketStore.stockList.map((stock: any) => ({
    pair: `${stock.symbol}/USD`,
    base: stock.symbol,
    quote: 'USD',
    price: stock.close ? Number(stock.close).toFixed(2) : '0.00',
    volume: stock.closePoints?.length ? String(stock.closePoints.length * 1000) : '0',
    isUp: stock.changeValue >= 0,
    isFavorite: false,
    symbol: stock.symbol,
    tradingview_name: stock.tradingview_name || `NASDAQ:${stock.symbol}`,
  }))
})

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 切换到详情页（更新 symbol）
const goToDetail = async (item: TradePair) => {
  // 更新当前 symbol 和 tradingview_name
  currentSymbol.value = item.symbol
  currentTradingViewName.value = item.tradingview_name

  // 获取股票详情并更新相关信息
  await fetchStockDetail(item.symbol)

  // 更新 URL 参数（不刷新页面）
  router.replace({
    path: route.path,
    query: {
      symbol: item.symbol,
      tradingview_name: item.tradingview_name,
    },
  })
}

// 获取股票详情
const fetchStockDetail = async (symbol: string) => {
  try {
    const { data, code } = await getStockDetail(symbol)
    if (code === 200 && data) {
      // 更新股票信息
      stockInfo.value = {
        name: data.symbol || symbol,
        fullName: data.full_name || data.name || symbol,
        price: data.close || 0,
        change: data.increase || '0%',
        isUp: (data.changeValue || 0) >= 0,
      }

      // 更新当前 symbol
      currentSymbol.value = symbol
      currentTradingViewName.value = data.tradingview_name || `NASDAQ:${symbol}`

      // 更新交易表单价格
      if (data.close) {
        tradeForm.value.price = Number(data.close).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      }
    }
  } catch (error) {
    console.error('获取股票详情失败:', error)
  }
}

// 处理买入
const handleBuy = async () => {
  if (!buyForm.value.quantity || Number(buyForm.value.quantity) <= 0) {
    Message.warning('请输入有效的买入数量')
    return
  }

  if (!currentSymbol.value) {
    Message.warning('请选择股票')
    return
  }

  submitting.value = true
  try {
    const { code, message } = await buyStock({
      type: 'market', // 市价单
      symbol: currentSymbol.value,
      quantity: Number(buyForm.value.quantity),
    })

    if (code === 200) {
      Message.success('买入成功')
      // 清空表单
      buyForm.value.quantity = ''
      buySliderValue.value = 0
    } else {
      Message.error(message || '买入失败')
    }
  } catch (error: any) {
    console.error('买入失败:', error)
    Message.error(error.message || '买入失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 处理卖出
const handleSell = async () => {
  if (!sellForm.value.quantity || Number(sellForm.value.quantity) <= 0) {
    Message.warning('请输入有效的卖出数量')
    return
  }

  if (!currentSymbol.value) {
    Message.warning('请选择股票')
    return
  }

  submitting.value = true
  try {
    const { code, message } = await sellStock({
      type: 'market', // 市价单
      symbol: currentSymbol.value,
      quantity: Number(sellForm.value.quantity),
    })

    if (code === 200) {
      Message.success('卖出成功')
      // 清空表单
      sellForm.value.quantity = ''
      sellSliderValue.value = 0
    } else {
      Message.error(message || '卖出失败')
    }
  } catch (error: any) {
    console.error('卖出失败:', error)
    Message.error(error.message || '卖出失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 页面加载完成后隐藏骨架屏
onMounted(async () => {
  // 从 URL 获取 symbol 参数
  const urlSymbol = route.query.symbol as string
  const urlTradingViewName = route.query.tradingview_name as string

  // 获取股票列表（如果 store 中还没有数据）
  if (marketStore.stockList.length === 0) {
    await marketStore.fetchMarketList({ page: 1, size: 10, region: '200' })
  }

  if (urlSymbol) {
    // 如果有 symbol 参数，先获取股票详情
    await fetchStockDetail(urlSymbol)
    if (urlTradingViewName) {
      currentTradingViewName.value = urlTradingViewName
    }
  }

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
    <div v-show="!isLoading" class="transition-opacity duration-300"
      :class="{ 'opacity-100': !isLoading, 'opacity-0': isLoading }">
      <div class="w-full flex flex-col lg:flex-row gap-[7px]">
        <container :symbol="currentTradingViewName" :theme="'light'" :height="560" class="w-full lg:flex-1" />
      </div>
      <div class="flex w-full gap-[5px] mt-[5px]">
        <!-- 交易对列表 -->
        <div class="stock-list w-full lg:w-[50%] bg-white rounded-lg p-4 lg:p-6 border border-gray-100">
          <!-- Tab Selection -->
          <div class="flex items-center gap-5 mb-4">
            <button v-for="tab in ['all', 'cross', 'isolated']" :key="tab" @click="activeTab = tab"
              class="text-[14px] transition-colors capitalize" :class="activeTab === tab
                ? 'text-[#23262F] font-semibold'
                : 'text-[#777E90] font-normal hover:text-gray-600'
                ">
              {{ tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>

          <!-- Search Box -->
          <div class="mb-4">
            <div class="relative">
              <input type="text" placeholder="Search"
                class="w-full h-[40px] pl-4 pr-10 rounded-lg border border-[#E6E8EC] border-solid text-[13px] text-[#23262F] placeholder:text-[#777E90] focus:outline-none focus:border-[#58BD7D] transition-colors" />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 text-[#777E90]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Table Header -->
          <div class="grid grid-cols-3 gap-4 px-3 py-2 mb-2">
            <div class="flex items-center gap-1 cursor-pointer text-[13px] font-normal text-[#777E90]">
              Pair
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
            <div class="flex items-center gap-1 cursor-pointer text-[13px] font-normal text-[#777E90]">
              Price
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
            <div class="flex items-center gap-1 cursor-pointer justify-end text-[13px] font-normal text-[#777E90]">
              Volume
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <!-- Trade Pairs List -->
          <div class="max-h-[400px] overflow-y-auto">
            <div v-for="(item, index) in tradePairs" :key="index" @click="goToDetail(item)"
              class="grid grid-cols-3 gap-4 px-3 py-2.5 hover:bg-[#F8F9FA] transition-colors cursor-pointer rounded">
              <!-- Pair Column -->
              <div class="flex items-center gap-2">
                <component :is="IconStar" :class="item.isFavorite ? 'text-[#FFC107] fill-[#FFC107]' : 'text-[#B1B5C3]'"
                  class="w-4 h-4 flex-shrink-0" />
                <div class="text-[13px] font-normal">
                  <span class="text-[#23262F] font-medium">{{ item.base }}</span>
                  <span class="text-[#777E90]">/{{ item.quote }}</span>
                </div>
              </div>

              <!-- Price Column -->
              <div class="text-[13px] font-normal" :class="item.isUp ? 'text-[#58BD7D]' : 'text-[#FF6838]'">
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
        <div class="w-full lg:w-[50%] bg-[#fff] p-[16px] rounded-lg flex items-center">
          <div class="grid grid-cols-2 gap-[28px] w-full">
            <!-- Buy -->
            <section>
              <!-- 顶部 -->
              <div class="flex items-center justify-between mb-[18px]">
                <h3 class="text-[#23262F] text-[22px] leading-[1.05] font-[700] tracking-[-0.01em]">
                  Buy {{ currentSymbol || 'BTC' }}
                </h3>
                <div
                  class="flex items-center gap-[6px] text-[#23262F] text-[12px] leading-none font-[600] whitespace-nowrap">
                  <svg class="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="6.5" width="18" height="11" rx="2" stroke-width="1.8" />
                    <path d="M3 10.5h18" stroke-width="1.8" />
                  </svg>
                  <span>{{ userInfo.balance }} USDT</span>
                </div>
              </div>

              <!-- Amount -->
              <div class="mb-[18px]">
                <div
                  class="h-[48px] rounded-[16px] border border-[#D0D5DD] border-solid px-[18px] flex items-center justify-between bg-transparent">
                  <span class="text-[#7A8599] text-[14px] leading-none font-[500]">Amount</span>
                  <div class="flex items-center">
                    <input v-model="buyForm.quantity" type="number" step="1" min="0"
                      class="w-[120px] bg-transparent border-none outline-none text-right text-[#23262F] text-[28px] leading-none font-[500]" />
                    <span
                      class="ml-[14px] pl-[14px] border-l border-[#5D7CFF] text-[#7A8599] text-[14px] leading-none font-[500]">
                      {{ currentSymbol || 'BTC' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Slider -->
              <div class="mb-[20px]">
                <input v-model="buySliderValue" type="range" min="0" max="100" class="deal-slider w-full" />
              </div>

              <!-- Total -->
              <div class="mb-[18px]">
                <div
                  class="h-[48px] rounded-[16px] border border-[#D0D5DD] border-solid px-[18px] flex items-center justify-between bg-transparent">
                  <span class="text-[#7A8599] text-[14px] leading-none font-[500]">Total</span>
                  <span
                    class="ml-[14px] pl-[14px] border-l border-[#D0D5DD] text-[#7A8599] text-[14px] leading-none font-[500]">
                    USDT
                  </span>
                </div>
              </div>

              <!-- Button -->
              <button @click="handleBuy" :disabled="submitting"
                class="w-full h-[48px] rounded-[999px] bg-[#58BD7D] text-white text-[14px] leading-none font-[700] hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {{ submitting ? 'Processing...' : `Buy ${currentSymbol || 'BTC'}` }}
              </button>
            </section>

            <!-- Sell -->
            <section>
              <!-- 顶部 -->
              <div class="flex items-center justify-between mb-[18px]">
                <h3 class="text-[#23262F] text-[22px] leading-[1.05] font-[700] tracking-[-0.01em]">
                  Sell {{ currentSymbol || 'BTC' }}
                </h3>
                <div
                  class="flex items-center gap-[6px] text-[#23262F] text-[14px] leading-none font-[600] whitespace-nowrap">
                  <svg class="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="6.5" width="18" height="11" rx="2" stroke-width="1.8" />
                    <path d="M3 10.5h18" stroke-width="1.8" />
                  </svg>
                  <span>{{ userHasStockQuantity || 0 }} {{ currentSymbol || 'BTC' }}</span>
                </div>
              </div>

              <!-- Amount -->
              <div class="mb-[18px]">
                <div
                  class="h-[48px] rounded-[16px] border border-[#D0D5DD] border-solid px-[18px] flex items-center justify-between bg-transparent">
                  <span class="text-[#7A8599] text-[14px] leading-none font-[500]">Amount</span>
                  <div class="flex items-center">
                    <input v-model="sellForm.quantity" type="number" step="1" min="0"
                      class="w-[120px] bg-transparent border-none outline-none text-right text-[#23262F] text-[28px] leading-none font-[500]" />
                    <span
                      class="ml-[14px] pl-[14px] border-l border-[#D0D5DD] text-[#7A8599] text-[14px] leading-none font-[500]">
                      {{ currentSymbol || 'BTC' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Slider -->
              <div class="mb-[20px]">
                <input v-model="sellSliderValue" type="range" min="0" max="100" class="deal-slider w-full" />
              </div>

              <!-- Total -->
              <div class="mb-[18px]">
                <div
                  class="h-[48px] rounded-[16px] border border-[#D0D5DD] border-solid px-[18px] flex items-center justify-between bg-transparent">
                  <span class="text-[#7A8599] text-[14px] leading-none font-[500]">Total</span>
                  <span
                    class="ml-[14px] pl-[14px] border-l border-[#D0D5DD] text-[#7A8599] text-[14px] leading-none font-[500]">
                    USDT
                  </span>
                </div>
              </div>

              <!-- Button -->
              <button @click="handleSell" :disabled="submitting"
                class="w-full h-[48px] rounded-[999px] bg-[#FF6B3D] text-white text-[14px] leading-none font-[700] hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {{ submitting ? 'Processing...' : `Sell ${currentSymbol || 'BTC'}` }}
              </button>
            </section>
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
/* 隐藏 number 输入框的增减按钮 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
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

/* 统一滑块：与设计图一致（细轨道 + 空心圆点） */
.deal-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 999px;
  background: #D3D8E0;
  outline: none;
}

.deal-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 999px;
  background: #D3D8E0;
}

.deal-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  border: 5px solid #7A8293;
  box-shadow: 0 0 0 0 transparent;
  margin-top: -9px;
  /* 22px thumb 对齐 4px 轨道 */
  cursor: pointer;
}

.deal-slider::-moz-range-track {
  height: 4px;
  border-radius: 999px;
  background: #D3D8E0;
}

.deal-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  border: 5px solid #7A8293;
  box-shadow: none;
  cursor: pointer;
}
</style>
