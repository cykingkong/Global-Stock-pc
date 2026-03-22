<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import FundPoolCard from '@/components/AFFund/FundPoolCard.vue'
import AFFundOrderItem from '@/components/AFFund/AFFundOrderItem.vue'
import JoinFundModal from '@/components/AFFund/JoinFundModal.vue'
import useUserStore from '@/stores/user'
import { getFundIndex, fundInvest, getFundOrders, fundRedeem, fundAddInvest } from '@/api/fund'

const { t } = useI18n()
const userStore = useUserStore()

// Tab
const activeTab = ref(1)
const tabs = computed(() => [
  { label: t('affund.introduction') },
  { label: t('affund.fundPool') },
  { label: t('affund.orders') },
])

// 弹窗
const showJoinModal = ref(false)
const joinModalMode = ref<'join' | 'add'>('join')
const selectedOrderId = ref<number | null>(null)

const userBalance = computed(() => userStore.userInfo?.balance || 0)

// 基金数据
const fundInfo = ref<any>(null)
const fundData = computed(() => {
  const info = fundInfo.value
  if (!info) return {
    totalAmount: 0, expectedReturn: 0, progress: 0,
    startDate: '', endDate: '', profitDetails: [],
    openPeriodEndAt: '', openPeriodStartAt: '',
  }
  return {
    totalAmount: info.pool_balance || 0,
    expectedReturn: (info.target_profit_rate || 0) * 100,
    progress: info.completion_rate || 0,
    startDate: info.period_start_at || '',
    endDate: info.open_period_end_at || '',
    openPeriodEndAt: info.open_period_end_at || '',
    openPeriodStartAt: info.open_period_start_at || '',
    profitDetails: [
      { desc: info.description || '', amount: info.current_profit || 0 },
    ],
  }
})

// 订单数据
const orderList = ref<any[]>([])
const orderPage = reactive({ page: 1, size: 20 })
const orderLoading = ref(false)
const orderNoMore = ref(false)

const orderStatusMap: Record<number, string> = {
  1: 'processing', 3: 'redeeming', 2: 'completed', 4: 'redeemed',
}

// 获取基金信息
let lastFetchTime = 0
async function fetchFundIndex() {
  lastFetchTime = Date.now()
  try {
    const { data, code } = await getFundIndex(undefined, false)
    if (code === 200) fundInfo.value = data
  } catch (e) {
    console.error('获取基金信息失败', e)
  }
}

// 获取订单列表
async function fetchOrders(reset = false) {
  if (reset) {
    orderPage.page = 1
    orderList.value = []
    orderNoMore.value = false
  }
  orderLoading.value = true
  try {
    const { data, code } = await getFundOrders({ page: orderPage.page, per_page: orderPage.size })
    if (code === 200 && data?.data) {
      const list = data.data.map((item: any) => ({
        id: item.id,
        orderId: item.order_id,
        investAmount: item.amount,
        expectedReturn: (item.target_profit_rate || 0) * 100,
        expectedProfit: item.total_rate || 0,
        status: orderStatusMap[item.status] || 'processing',
        rawStatus: item.status,
      }))
      orderList.value = reset ? list : [...orderList.value, ...list]
      const total = data.meta?.pagination?.total || 0
      orderNoMore.value = orderList.value.length >= total || list.length === 0
    }
  } catch (e) {
    console.error('获取订单列表失败', e)
  } finally {
    orderLoading.value = false
  }
}

function loadMoreOrders() {
  if (orderNoMore.value || orderLoading.value) return
  orderPage.page++
  fetchOrders()
}

function handleTabChange(index: number) {
  activeTab.value = index
  if (index === 2) fetchOrders(true)
}

// 参与基金
function handleJoin() {
  joinModalMode.value = 'join'
  selectedOrderId.value = null
  showJoinModal.value = true
}



let isSubmitting = false
async function handleConfirmJoin(amount: number) {
  if (isSubmitting) return
  isSubmitting = true
  try {
    if (joinModalMode.value === 'add') {
      if (!selectedOrderId.value) return
      await fundAddInvest({ id: selectedOrderId.value, amount })
    } else {
      if (!fundInfo.value?.id) return
      await fundInvest({ id: fundInfo.value.id, amount })
    }
    lastFetchTime = Date.now()
    fetchFundIndex()
    fetchOrders(true)
    userStore.info()
    activeTab.value = 2
  } catch (e) {
    console.error(e)
  } finally {
    isSubmitting = false
  }
}

function handleAddInvest(orderId: number) {
  selectedOrderId.value = orderId
  joinModalMode.value = 'add'
  showJoinModal.value = true
}

async function handleRedeem(orderId: number) {
  if (!confirm(t('affund.confirmRedemption'))) return
  try {
    await fundRedeem({ id: orderId })
    fetchFundIndex()
    fetchOrders(true)
    userStore.info()
  } catch (e) {
    console.error('赎回失败', e)
  }
}

// 轮询
const POLL_INTERVAL = 60 * 1000
let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  userStore.info()
  fetchFundIndex()
  pollTimer = setInterval(() => {
    if (Date.now() - lastFetchTime < POLL_INTERVAL) return
    fetchFundIndex()
  }, POLL_INTERVAL)
})

onUnmounted(() => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
})
</script>



<template>
  <div class="min-h-screen bg-[#FCFCFD]">
    <Nav />

    <!-- 页面主体 -->
    <div class="max-w-[1200px] mx-auto px-6 py-10">
      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-[#0F172A] mb-8">{{ t('affund.title') }}</h1>

      <!-- Tab 栏 -->
      <div class="flex items-center gap-0 border-b border-gray-200 mb-8">
        <button v-for="(tab, index) in tabs" :key="index"
          class="px-6 py-3 text-base font-medium transition-colors relative"
          :class="activeTab === index ? 'text-[#12D18E]' : 'text-[#64748B] hover:text-[#0F172A]'"
          @click="handleTabChange(index)">
          {{ tab.label }}
          <div v-if="activeTab === index"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#12D18E] rounded-t" />
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="flex gap-8">
        <!-- 左侧主内容 -->
        <div class="flex-1 min-w-0">
          <!-- 简介 -->
          <div v-if="activeTab === 0">
            <div v-if="fundInfo?.description" class="prose max-w-none text-sm text-[#64748B]"
              v-html="fundInfo.description" />
            <div v-else class="text-center text-[#94A3B8] py-20">{{ t('affund.noData') }}</div>
            <div class="mt-8 bg-[#35383F] rounded-2xl h-14 flex justify-center items-center text-white text-sm">
              {{ t('affund.investmentPeriod') }}: {{ fundData.openPeriodStartAt }} ~ {{ fundData.openPeriodEndAt }}
            </div>
          </div>

          <!-- 资金池 -->
          <div v-if="activeTab === 1">
            <FundPoolCard
              :total-amount="fundData.totalAmount"
              :expected-return="fundData.expectedReturn"
              :progress="fundData.progress"
              :start-date="fundData.startDate"
              :end-date="fundData.endDate"
              :profit-details="fundData.profitDetails" />
          </div>

          <!-- 订单 -->
          <div v-if="activeTab === 2">
            <div v-if="orderList.length > 0" class="grid grid-cols-2 gap-4">
              <AFFundOrderItem v-for="order in orderList" :key="order.orderId"
                :id="order.id" :order-id="order.orderId"
                :invest-amount="order.investAmount" :expected-return="order.expectedReturn"
                :expected-profit="order.expectedProfit" :status="order.status"
                :raw-status="order.rawStatus"
                @redeem="handleRedeem" @add-invest="handleAddInvest" />
            </div>
            <div v-if="!orderLoading && orderList.length === 0"
              class="text-center text-[#94A3B8] py-20">{{ t('affund.noOrders') }}</div>
            <div v-if="!orderNoMore && orderList.length > 0" class="text-center mt-6">
              <button class="text-sm text-[#12D18E] hover:underline" @click="loadMoreOrders">
                {{ orderLoading ? t('affund.loading') : t('affund.loadMore') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧操作栏 -->
        <div v-if="activeTab !== 2" class="w-[320px] flex-shrink-0">
          <div class="sticky top-[80px] bg-white rounded-2xl border border-gray-100 p-6">
            <div class="text-lg font-bold text-[#0F172A] mb-4">{{ t('affund.joinFund') }}</div>
            <div class="text-sm text-[#64748B] mb-6">
              {{ t('affund.joinDesc') }}
            </div>
            <button
              class="w-full h-12 rounded-full bg-[#12D18E] text-white text-base font-bold hover:bg-[#0FBF80] transition-colors"
              @click="handleJoin">
              {{ t('affund.joinNow') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <IndexFooter />

    <!-- 弹窗 -->
    <JoinFundModal
      v-model:show="showJoinModal"
      :balance="userBalance"
      :title-key="joinModalMode === 'add' ? 'affund.addInvestment' : 'affund.joinThisRound'"
      :title-color="joinModalMode === 'add' ? '#F75555' : '#12D18E'"
      :confirm-text-key="joinModalMode === 'add' ? 'affund.addInvestment' : 'affund.joinNow'"
      @confirm="handleConfirmJoin" />
  </div>
</template>
