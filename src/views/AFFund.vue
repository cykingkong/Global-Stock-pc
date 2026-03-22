<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import FundPoolCard from '@/components/AFFund/FundPoolCard.vue'
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

const boardData = computed(() => {
  const info = fundInfo.value
  if (!info) {
    return {
      totalAmount: '--',
      expectedReturn: '--',
      progress: '--',
      hasExpectedReturn: false,
    }
  }

  const hasValue = (val: unknown) => val !== null && val !== undefined && val !== ''

  const totalAmount = hasValue(info.pool_balance)
    ? Number(info.pool_balance).toLocaleString()
    : '--'
  const expectedReturn = hasValue(info.target_profit_rate)
    ? `${(Number(info.target_profit_rate) * 100).toFixed(2)}%`
    : '--'
  const progress = hasValue(info.completion_rate)
    ? `${Number(info.completion_rate).toFixed(2)}%`
    : '--'
  return {
    totalAmount,
    expectedReturn,
    progress,
    hasExpectedReturn: expectedReturn !== '--',
  }
})

const periodData = computed(() => {
  const hasValue = (val: unknown) => val !== null && val !== undefined && val !== ''
  return {
    startAt: hasValue(fundInfo.value?.open_period_start_at) ? fundInfo.value.open_period_start_at : '--',
    endAt: hasValue(fundInfo.value?.open_period_end_at) ? fundInfo.value.open_period_end_at : '--',
  }
})

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

function formatAmount(value: number) {
  return Number(value || 0).toLocaleString()
}

function getOrderStatusText(status: string) {
  if (status === 'redeeming') return t('affund.redeeming')
  if (status === 'completed') return t('affund.completed')
  if (status === 'redeemed') return t('affund.redeemed')
  return t('affund.inProgress')
}

function getOrderStatusMeta(status: string) {
  if (status === 'completed' || status === 'redeemed') {
    return {
      color: '#4AAF57',
      bgColor: '#E8FAF3',
      icon: 'check',
    }
  }
  return {
    color: '#FF9900',
    bgColor: '#FFF9E6',
    icon: 'clock',
  }
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
  <div class="af-page min-h-screen">
    <Nav />

    <div class="af-shell max-w-[1320px] mx-auto px-6 py-8">
      <div class="af-header mb-5">
        <h1 class="text-[30px] leading-tight font-bold text-[#1F2937]">{{ t('affund.title') }}</h1>
      </div>

      <div class="af-board mb-6">
        <div class="af-board-item">
          <div class="af-board-label">{{ t('affund.fundPool') }}</div>
          <div class="af-board-value">{{ boardData.totalAmount }}</div>
        </div>
        <div class="af-board-item">
          <div class="af-board-label">{{ t('affund.expectedReturnRate') }}</div>
          <div class="af-board-value" :class="{ up: boardData.hasExpectedReturn }">{{ boardData.expectedReturn }}</div>
        </div>
        <div class="af-board-item">
          <div class="af-board-label">{{ t('affund.completedReturns') }}</div>
          <div class="af-board-value">{{ boardData.progress }}</div>
        </div>
        <div class="af-board-item">
          <div class="af-board-label">{{ t('affund.investmentPeriod') }}</div>
          <div class="af-period-inline">
            <div class="af-period-cell">
              <div class="af-period-key">{{ t('affund.profitStartTime') }}</div>
              <div class="af-period-val">{{ periodData.startAt }}</div>
            </div>
            <div class="af-period-cell">
              <div class="af-period-key">{{ t('affund.profitEndTime') }}</div>
              <div class="af-period-val">{{ periodData.endAt }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="af-tabs mb-6">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="af-tab-btn"
          :class="{ 'is-active': activeTab === index }"
          @click="handleTabChange(index)">
          {{ tab.label }}
        </button>
      </div>

      <div
        class="grid grid-cols-12 items-start"
        :class="activeTab === 1 ? 'gap-10 xl:gap-12' : 'gap-8'">
        <div class="col-span-12 xl:col-span-8 min-w-0">
          <div v-if="activeTab === 0">
            <div class="af-card p-8">
              <div
                v-if="fundInfo?.description"
                class="prose max-w-none text-[15px] leading-7 text-[#64748B]"
              v-html="fundInfo.description" />
              <div v-else class="text-center text-[#94A3B8] py-20">{{ t('affund.noData') }}</div>

              <div class="mt-8 af-info-bar">
                <div class="af-info-period">
                  <div class="af-period-cell">
                    <div class="af-period-key">{{ t('affund.profitStartTime') }}</div>
                    <div class="af-period-val">{{ periodData.startAt }}</div>
                  </div>
                  <div class="af-period-cell">
                    <div class="af-period-key">{{ t('affund.profitEndTime') }}</div>
                    <div class="af-period-val">{{ periodData.endAt }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 1">
            <div class="af-card p-2">
              <FundPoolCard
                :total-amount="fundData.totalAmount"
                :expected-return="fundData.expectedReturn"
                :progress="fundData.progress"
                :start-date="fundData.startDate"
                :end-date="fundData.endDate"
                :profit-details="fundData.profitDetails" />
            </div>
          </div>

          <div v-if="activeTab === 2">
            <div v-if="orderList.length > 0" class="af-order-panel">
              <div class="af-order-toolbar">
                <div class="af-order-title">{{ t('affund.orders') }}</div>
                <div class="af-order-count">{{ orderList.length }}</div>
              </div>
              <div class="af-order-table-wrap">
                <table class="af-order-table">
                  <thead>
                    <tr>
                      <th>{{ t('affund.orderId') }}</th>
                      <th class="ta-right">{{ t('affund.investmentAmount') }}</th>
                      <th class="ta-right">{{ t('affund.expectedReturnRate') }}</th>
                      <th class="ta-right">{{ t('affund.expectedProfit') }}</th>
                      <th>{{ t('affund.status') }}</th>
                      <th class="ta-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in orderList" :key="order.orderId">
                      <td class="af-cell-id">{{ order.orderId }}</td>
                      <td class="ta-right tabular">${{ formatAmount(order.investAmount) }}</td>
                      <td class="ta-right tabular">{{ order.expectedReturn }}%</td>
                      <td class="ta-right tabular font-semibold">${{ formatAmount(order.expectedProfit) }}</td>
                      <td>
                        <template v-if="getOrderStatusMeta(order.status).icon === 'clock'">
                          <span
                            class="af-status-tag"
                            :style="{
                              color: getOrderStatusMeta(order.status).color,
                              backgroundColor: getOrderStatusMeta(order.status).bgColor,
                            }">
                            <svg class="af-status-svg" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M6.4178 2.76501C9.86105 1.33851 13.8083 2.97426 15.2348 6.41751C16.6613 9.86076 15.0256 13.808 11.5823 15.2345C8.13905 16.661 4.1918 15.0253 2.7653 11.582C1.33955 8.13876 2.97455 4.19151 6.4178 2.76501"
                                stroke="#FF981F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path
                                d="M8.78857 5.98877V9.47702L11.5306 11.1488"
                                stroke="#FF981F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {{ getOrderStatusText(order.status) }}
                          </span>
                        </template>
                        <template v-else-if="getOrderStatusMeta(order.status).icon === 'check'">
                          <span
                            class="af-status-tag"
                            :style="{
                              color: getOrderStatusMeta(order.status).color,
                              backgroundColor: getOrderStatusMeta(order.status).bgColor,
                            }">
                            <svg class="af-status-svg" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M6.62025 13.9928H4.7595C4.344 13.9928 4.00725 13.656 4.00725 13.2405V11.379C4.00725 11.1795 3.92775 10.9883 3.78675 10.8473L2.4705 9.531C2.1765 9.237 2.1765 8.76075 2.4705 8.4675L3.80025 7.13775C3.933 7.005 4.00725 6.82575 4.00725 6.63825V4.7595C4.00725 4.344 4.344 4.00725 4.7595 4.00725H6.621C6.8205 4.00725 7.01175 3.92775 7.15275 3.78675L8.469 2.4705C8.763 2.1765 9.23925 2.1765 9.5325 2.4705L10.8488 3.78675C10.9898 3.92775 11.181 4.00725 11.3805 4.00725H13.242C13.6575 4.00725 13.9943 4.344 13.9943 4.7595V6.621C13.9943 6.8205 14.0738 7.01175 14.2148 7.15275L15.531 8.469C15.825 8.763 15.825 9.23925 15.531 9.5325L14.2148 10.8488C14.0738 10.9898 13.9943 11.181 13.9943 11.3805V13.242C13.9943 13.6575 13.6575 13.9943 13.242 13.9943H11.3805C11.181 13.9943 10.9898 14.0738 10.8488 14.2148L9.5325 15.531C9.2385 15.825 8.76225 15.825 8.469 15.531L7.15275 14.2148C7.011 14.0715 6.81975 13.9928 6.62025 13.9928Z"
                                stroke="#4AAF57" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path
                                d="M11.25 7.875L8.4375 10.6875L6.75 9"
                                stroke="#4AAF57" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {{ getOrderStatusText(order.status) }}
                          </span>
                        </template>
                        <span
                          v-else-if="getOrderStatusMeta(order.status).icon === 'close'"
                          class="af-status-tag"
                          :style="{
                            color: getOrderStatusMeta(order.status).color,
                            backgroundColor: getOrderStatusMeta(order.status).bgColor,
                          }">
                          <svg class="af-status-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                              :stroke="getOrderStatusMeta(order.status).color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                              d="M10 6L6 10M6 6L10 10"
                              :stroke="getOrderStatusMeta(order.status).color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          {{ getOrderStatusText(order.status) }}
                        </span>
                        <span
                          v-else
                          class="af-status-tag"
                          :style="{
                            color: getOrderStatusMeta(order.status).color,
                            backgroundColor: getOrderStatusMeta(order.status).bgColor,
                          }">
                          <svg class="af-status-svg" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6.4178 2.76501C9.86105 1.33851 13.8083 2.97426 15.2348 6.41751C16.6613 9.86076 15.0256 13.808 11.5823 15.2345C8.13905 16.661 4.1918 15.0253 2.7653 11.582C1.33955 8.13876 2.97455 4.19151 6.4178 2.76501"
                              stroke="#FF981F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                              d="M8.78857 5.98877V9.47702L11.5306 11.1488"
                              stroke="#FF981F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          {{ getOrderStatusText(order.status) }}
                        </span>
                      </td>
                      <td class="ta-right">
                        <div v-if="order.rawStatus === 2" class="af-order-actions">
                          <button class="af-order-btn ghost" @click="handleRedeem(order.id)">
                            {{ t('affund.redeemPrincipal') }}
                          </button>
                          <button class="af-order-btn primary" @click="handleAddInvest(order.id)">
                            {{ t('affund.addInvestment') }}
                          </button>
                        </div>
                        <span v-else class="text-[#9CA3AF]">--</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="!orderLoading && orderList.length === 0"
              class="text-center text-[#94A3B8] py-20">{{ t('affund.noOrders') }}</div>
            <div v-if="!orderNoMore && orderList.length > 0" class="text-center mt-6">
              <button class="af-load-btn" @click="loadMoreOrders">
                {{ orderLoading ? t('affund.loading') : t('affund.loadMore') }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab !== 2" class="col-span-12 xl:col-span-4">
          <div class="af-side sticky top-[90px]">
            <div class="text-xs font-semibold tracking-[0.14em] text-[#16A34A] mb-3">
              ANTI-FRAUD FUND
            </div>
            <div class="text-2xl font-bold text-[#0F172A] mb-2">{{ t('affund.joinFund') }}</div>
            <div class="text-sm text-[#64748B] mb-5">
              {{ t('affund.joinDesc') }}
            </div>

            <div class="af-balance mb-5">
              <div class="text-xs text-[#64748B] mb-2">{{ t('affund.myBalance') }}</div>
              <div class="text-[28px] leading-none font-bold text-[#0F172A]">
                {{ Number(userBalance).toLocaleString() }}
              </div>
            </div>

            <button class="af-join-btn" @click="handleJoin">
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

<style scoped>
.af-page {
  --af-green: #12d18e;
  --af-green-soft: #71e3bb;
  --af-green-bg: #e8faf3;
  --af-green-border: #9fe8cd;
  --af-green-gradient: linear-gradient(286.17deg, #12d18e 0%, #71e3bb 100%);
  background: #f1f2f4;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.af-shell {
  position: relative;
  flex: 1 0 auto;
  width: 100%;
}

.af-header {
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.af-board {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
}

.af-board-item {
  padding: 16px 18px;
  border-right: 1px solid #e5e7eb;
}

.af-board-item:last-child {
  border-right: none;
}

.af-board-label {
  font-size: 11px;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.af-board-value {
  font-size: 24px;
  line-height: 1;
  font-weight: 700;
  color: #111827;
}

.af-board-value.up {
  color: var(--af-green);
}

.af-period-inline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.af-period-cell {
  min-width: 0;
}

.af-period-key {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.af-period-val {
  font-size: 14px;
  line-height: 1.3;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.af-tabs {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 18px;
  height: 56px;
}

.af-tab-btn {
  height: 56px;
  border: none;
  border-radius: 0;
  padding: 0;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
}

.af-tab-btn:hover {
  color: #111827;
}

.af-tab-btn.is-active {
  color: #111827;
  font-weight: 700;
}

.af-tab-btn.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--af-green);
}

.af-card {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: none;
}

.af-info-bar {
  min-height: 64px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 14px;
}

.af-info-period {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 18px;
}

.af-side {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: none;
  padding: 24px;
}

.af-balance {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  padding: 14px 16px;
}

.af-join-btn {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: var(--af-green-gradient);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.af-join-btn:hover {
  filter: brightness(0.98);
}

.af-load-btn {
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0 20px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  transition: all 0.2s ease;
}

.af-load-btn:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.af-order-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.af-order-toolbar {
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.af-order-title {
  font-size: 13px;
  color: #374151;
  font-weight: 600;
}

.af-order-count {
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #eef2f7;
  color: #374151;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
}

.af-order-table-wrap {
  overflow-x: auto;
}

.af-order-table {
  width: 100%;
  min-width: 980px;
  border-collapse: separate;
  border-spacing: 0;
}

.af-order-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 42px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.af-order-table tbody td {
  height: 54px;
  padding: 0 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #eef2f7;
  white-space: nowrap;
}

.af-order-table tbody tr:last-child td {
  border-bottom: none;
}

.af-order-table tbody tr:hover td {
  background: #fafcff;
}

.af-cell-id {
  font-weight: 600;
}

.ta-right {
  text-align: right !important;
}

.tabular {
  font-variant-numeric: tabular-nums;
}

.af-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
}

.af-status-svg {
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
}

.af-order-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.af-order-btn {
  height: 28px;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid transparent;
}

.af-order-btn.ghost {
  color: var(--af-green);
  background: #effdf7;
  border-color: var(--af-green-border);
}

.af-order-btn.primary {
  color: #ffffff;
  background: var(--af-green-gradient);
}

@media (max-width: 1279px) {
  .af-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .af-period-inline,
  .af-info-period {
    grid-template-columns: 1fr;
    row-gap: 8px;
  }

  .af-tabs {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
