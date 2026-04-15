<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import useUserStore from '@/stores/user'
import { addCommasToNumber } from '@/utils/tool'
import { getEquityProjects, getMyEquityInvestments } from '@/api/equity'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Tab
const activeTab = ref(0)
const tabs = computed(() => [
  { label: t('Fund Pool') },
  { label: t('Orders') },
])

// 产品数据
const productList = ref<any[]>([])
const productLoading = ref(false)

// 订单数据
const orderList = ref<any[]>([])
const orderLoaded = ref(false)
const orderLoading = ref(false)

// 订单详情弹窗
const showOrderModal = ref(false)
const modalOrder = ref<any>(null)

// ========== 产品列表 ==========
async function fetchProducts() {
  productLoading.value = true
  try {
    const { data, code } = await getEquityProjects(undefined, false)
    if (code === 200 && data) {
      productList.value = data.map((item: any) => ({
        id: item.id,
        logo: item.logo_url || '',
        name: item.name,
        minInvestment: Number(item.min_invest_amount || 0),
        targetReturn: item.interest_rates?.[0]?.annual_rate_text || '--',
        managementFee: item.management_fee_rate_text || '--',
        keyAreas: item.key_areas || '--',
      }))
    }
  } catch (e) {
    console.error('获取产品列表失败', e)
  } finally {
    productLoading.value = false
  }
}
// ========== 订单列表 ==========
function mapOrderStatus(status: number | string) {
  const numStatus = Number(status)
  if (numStatus === 1) return 'active'
  if (numStatus === 2) return 'completed'
  return 'cancelled'
}

function getStatusMeta(status: string) {
  if (status === 'completed') return { text: t('Completed'), color: '#4AAF57', bg: '#E8FAF3' }
  if (status === 'cancelled') return { text: t('Cancelled'), color: '#FF5A5F', bg: '#FFF0F0' }
  return { text: t('In Progress'), color: '#FF9900', bg: '#FFF9E6' }
}

async function fetchOrders() {
  orderLoading.value = true
  try {
    const { data, code } = await getMyEquityInvestments(undefined, true)
    if (code === 200) {
      const rows = data?.data || []
      orderList.value = rows.map((item: any) => ({
        id: Number(item.id || 0),
        logo: item.logo_url || '',
        name: item.project_name || '',
        returnRate: item.annual_rate_text,
        amount: Number(item.amount || 0),
        planDays: item.period_label,
        expectedProfit: Number(item.expected_total_interest || 0),
        startDate: item.invest_date || '',
        endDate: item.mature_date || '',
        nextPaymentDate: item.last_settled_date || '--',
        totalInterestPaid: Number(item.total_interest_paid || 0),
        pendingGrossInterest: Number(item.pending_gross_interest || 0),
        status: mapOrderStatus(item.status),
        createdAt: item.created_at || '',
      }))
      orderLoaded.value = true
    }
  } catch (e) {
    console.error('获取订单失败', e)
  } finally {
    orderLoading.value = false
  }
}

// ========== 交互 ==========
function handleTabChange(index: number) {
  activeTab.value = index
  if (index === 1 && !orderLoaded.value) fetchOrders()
}

function handleProductClick(product: any) {
  router.push({
    path: '/equity/detail',
    query: { id: product.id, name: product.name },
  })
}

function handleOrderClick(order: any) {
  modalOrder.value = order
  showOrderModal.value = true
}

function closeOrderModal() {
  showOrderModal.value = false
}

function formatRate(value: any) {
  if (value === null || value === undefined || value === '') return '--'
  const str = String(value)
  return str.includes('%') ? str : `${str}%`
}

const modalRows = computed(() => {
  if (!modalOrder.value) return []
  const o = modalOrder.value
  const expectedTotal = Number(o.amount || 0) + Number(o.expectedProfit || 0)
  return [
    { label: t('Investment Amount'), value: `$${addCommasToNumber(Number(o.amount || 0))}` },
    { label: t('Profit Rate'), value: formatRate(o.returnRate) },
    { label: t('Investment Cycle'), value: `${o.planDays || 0}` },
    { label: t('Expected Total Profit'), value: `$${addCommasToNumber(expectedTotal)}` },
    { label: t('Settled Profit'), value: `$${addCommasToNumber(Number(o.totalInterestPaid || 0))}` },
    { label: t('Pending Profit'), value: `$${addCommasToNumber(Number(o.pendingGrossInterest || 0))}` },
  ]
})

onMounted(() => {
  userStore.info()
  fetchProducts()
  const routeType = String(route.query.tab || route.query.type || '').toLowerCase()
  if (['1', 'order', 'orders'].includes(routeType)) {
    activeTab.value = 1
    fetchOrders()
  }
})
</script>

<template>
  <div class="eq-page min-h-screen bg-wise-page text-wise-text [font-feature-settings:'calt']">
    <Nav />
    <div class="eq-shell max-w-[1320px] mx-auto px-6 py-8">
      <div class="eq-header mb-6">
        <div>
          <h1 class="text-[34px] leading-[0.92] font-black tracking-[-0.04em] text-wise-text">{{ t('Equity Investment') }}</h1>
          <div class="eq-subtitle mt-2">{{ t('Fund Pool') }} / {{ t('Orders') }}</div>
        </div>
        <div class="eq-head-metrics">
          <div class="eq-metric-box">
            <span class="eq-metric-label">{{ t('My balance') }}</span>
            <strong class="eq-metric-value">${{ addCommasToNumber(userStore.userInfo?.balance || 0) }}</strong>
          </div>
          <div class="eq-metric-box">
            <span class="eq-metric-label">{{ t('Orders') }}</span>
            <strong class="eq-metric-value">{{ orderList.length }}</strong>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="eq-tabs mb-6">
        <button v-for="(tab, index) in tabs" :key="index" class="eq-tab-btn" :class="{ 'is-active': activeTab === index }" @click="handleTabChange(index)">
          {{ tab.label }}
        </button>
      </div>

      <!-- 产品列表 -->
      <div v-if="activeTab === 0">
        <div v-if="productLoading" class="text-center text-[#94A3B8] py-20">Loading...</div>
        <div v-else-if="productList.length === 0" class="text-center text-[#94A3B8] py-20">{{ t('No products available') }}</div>
        <div v-else class="eq-product-grid">
          <div v-for="product in productList" :key="product.id" class="eq-product-card" @click="handleProductClick(product)">
            <div class="eq-product-header">
              <div class="flex items-center gap-3">
                <div class="eq-product-logo"><img :src="product.logo" alt="" class="h-full w-full object-cover" /></div>
                <span class="text-[16px] text-wise-text font-bold">{{ product.name }}</span>
              </div>
              <svg class="flex-shrink-0 text-wise-accent" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M10.869 16.6308C10.811 16.5743 10.563 16.3609 10.359 16.1622C9.076 14.9971 6.976 11.9576 6.335 10.3668C6.232 10.1252 6.014 9.51437 6 9.18802C6 8.8753 6.072 8.5772 6.218 8.29274C6.422 7.93814 6.743 7.65368 7.122 7.49781C7.385 7.39747 8.172 7.2416 8.186 7.2416C9.047 7.08573 10.446 7 11.992 7C13.465 7 14.807 7.08573 15.681 7.21335C15.695 7.22796 16.673 7.38383 17.008 7.55431C17.62 7.86702 18 8.47784 18 9.13151V9.18802C17.985 9.61374 17.605 10.509 17.591 10.509C16.949 12.0141 14.952 14.9834 13.625 16.1768C13.625 16.1768 13.284 16.5129 13.071 16.659C12.765 16.887 12.386 17 12.007 17C11.584 17 11.19 16.8724 10.869 16.6308Z" />
              </svg>
            </div>
            <div class="h-[1px] bg-wise-border mt-[18px] mb-[16px]" />
            <div class="eq-field-list">
              <div class="eq-field-row">
                <span class="text-[13px] text-wise-muted">{{ t('Minimum investment amount') }}</span>
                <span class="text-[14px] text-wise-text font-semibold">${{ addCommasToNumber(product.minInvestment) }}</span>
              </div>
              <div class="eq-field-row">
                <span class="text-[13px] text-wise-muted">{{ t('Target return') }}</span>
                <span class="text-[14px] text-wise-text font-semibold">{{ product.targetReturn }}</span>
              </div>
              <div class="eq-field-row">
                <span class="text-[13px] text-wise-muted">{{ t('Management fee') }}</span>
                <span class="text-[14px] text-wise-text font-semibold">{{ product.managementFee }}</span>
              </div>
              <div class="eq-field-row">
                <span class="text-[13px] text-wise-muted">{{ t('Key areas') }}</span>
                <span class="text-[14px] text-wise-text font-semibold text-right max-w-[60%]">{{ product.keyAreas }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单列表 -->
      <div v-if="activeTab === 1">
        <div v-if="orderLoading" class="text-center text-[#94A3B8] py-20">Loading...</div>
        <div v-else-if="orderList.length === 0" class="text-center text-[#94A3B8] py-20">{{ t('No orders yet') }}</div>
        <div v-else class="eq-order-panel">
          <div class="eq-order-toolbar">
            <div class="eq-order-title">{{ t('Orders') }}</div>
            <div class="eq-order-count">{{ orderList.length }}</div>
          </div>
          <div class="eq-order-table-wrap">
            <table class="eq-order-table">
              <thead>
                <tr>
                  <th>{{ t('Plan') }}</th>
                  <th class="ta-right">{{ t('Investment Amount') }}</th>
                  <th class="ta-right">{{ t('Return Rate') }}</th>
                  <th class="ta-right">{{ t('Expected Total Profit') }}</th>
                  <th>{{ t('End Time') }}</th>
                  <th>{{ t('Next Payment Time') }}</th>
                  <th>{{ t('Status') }}</th>
                  <th class="ta-right"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orderList" :key="order.id">
                  <td>
                    <div class="flex items-center gap-2">
                      <div v-if="order.logo" class="h-[32px] w-[32px] flex-shrink-0 relative">
                        <div class="h-full w-full rounded-full bg-wise-border overflow-hidden">
                          <img :src="order.logo" alt="" class="h-full w-full object-cover" />
                        </div>
                        <div v-if="order.status === 'active'" class="absolute bottom-0 right-0 h-[10px] w-[10px] bg-wise-accent border-2 border-wise-surface rounded-full" />
                      </div>
                      <div>
                        <div class="text-[14px] text-wise-text font-semibold">{{ order.name }}</div>
                        <div class="text-[12px] text-wise-muted">{{ order.planDays }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="ta-right tabular">${{ addCommasToNumber(order.amount) }}</td>
                  <td class="ta-right tabular text-wise-accent font-semibold">{{ formatRate(order.returnRate) }}</td>
                  <td class="ta-right tabular font-semibold">${{ addCommasToNumber(order.expectedProfit) }}</td>
                  <td class="text-[13px]">{{ order.endDate || '--' }}</td>
                  <td class="text-[13px]">{{ order.nextPaymentDate || '--' }}</td>
                  <td>
                    <span class="eq-status-tag" :style="{ color: getStatusMeta(order.status).color, backgroundColor: getStatusMeta(order.status).bg }">
                      {{ getStatusMeta(order.status).text }}
                    </span>
                  </td>
                  <td class="ta-right">
                    <button class="eq-order-btn" @click="handleOrderClick(order)">{{ t('Detail') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <IndexFooter />

    <!-- 订单详情弹窗 -->
    <Teleport to="body">
      <div v-if="showOrderModal" class="eq-modal-overlay" @click.self="closeOrderModal">
        <div class="eq-modal">
          <div class="eq-modal-header">
            <h3 class="text-[20px] text-wise-accentForeground font-black">{{ modalOrder?.name || '-' }}</h3>
            <button class="eq-modal-close" @click="closeOrderModal">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="eq-modal-body">
            <div v-for="(row, idx) in modalRows" :key="idx" class="eq-modal-row">
              <span class="text-[14px] text-wise-muted">{{ row.label }}</span>
              <span class="text-[14px] text-wise-text font-semibold">{{ row.value }}</span>
            </div>
          </div>
          <div class="eq-modal-footer">
            <button class="eq-modal-btn close-btn" @click="closeOrderModal">{{ t('Close') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.eq-page { --eq-green: var(--wise-accent); --eq-green-gradient: linear-gradient(286.17deg, var(--wise-accent) 0%, #71e3bb 100%); background: var(--wise-page); display: flex; flex-direction: column; min-height: 100vh; }
.eq-shell { flex: 1 0 auto; width: 100%; }
.eq-header { display: flex; align-items: flex-end; justify-content: space-between; padding: 24px 28px; border: 1px solid var(--wise-border); border-radius: 30px; background: var(--wise-surface); box-shadow: 0 0 0 1px var(--wise-border); }
.eq-subtitle { font-size: 12px; letter-spacing: 0.08em; color: var(--wise-muted); text-transform: uppercase; }
.eq-head-metrics { display: flex; gap: 14px; }
.eq-metric-box { min-width: 170px; padding: 12px 14px; border-radius: 20px; border: 1px solid var(--wise-border); background: var(--wise-page); }
.eq-metric-label { display: block; font-size: 12px; color: var(--wise-muted); margin-bottom: 4px; }
.eq-metric-value { color: var(--wise-text); font-size: 18px; font-weight: 700; }
.eq-tabs { display: inline-flex; align-items: center; gap: 8px; background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 20px; padding: 8px; min-height: 58px; box-shadow: 0 0 0 1px var(--wise-border); }
.eq-tab-btn { height: 42px; border: none; padding: 0 18px; border-radius: 9999px; background: transparent; color: var(--wise-muted); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.eq-tab-btn:hover { color: var(--wise-text); background: var(--wise-hover); }
.eq-tab-btn.is-active { color: var(--wise-accent-foreground); background: var(--wise-accent); box-shadow: 0 0 0 1px var(--wise-border); }
.eq-product-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.eq-product-card { position: relative; background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 30px; padding: 24px; cursor: pointer; transition: all 0.26s ease; overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.eq-product-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--wise-accent), #65e2bc); opacity: 0; transition: opacity 0.2s; }
.eq-product-card:hover { transform: translateY(-2px); border-color: var(--wise-accent); }
.eq-product-card:hover::before { opacity: 1; }
.eq-product-header { display: flex; align-items: center; justify-content: space-between; }
.eq-product-logo { width: 42px; height: 42px; border-radius: 14px; background: var(--wise-soft); overflow: hidden; flex-shrink: 0; border: 1px solid var(--wise-border); }
.eq-field-list { display: flex; flex-direction: column; }
.eq-field-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--wise-border-soft); }
.eq-field-row:last-child { border-bottom: none; }
/* 订单 */
.eq-order-panel { background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 30px; overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.eq-order-toolbar { min-height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid var(--wise-border); background: var(--wise-page); }
.eq-order-title { font-size: 13px; color: var(--wise-text); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.eq-order-count { min-width: 28px; height: 22px; padding: 0 8px; border-radius: 999px; background: var(--wise-soft); color: var(--wise-accent-foreground); font-size: 12px; line-height: 22px; text-align: center; }
.eq-order-table-wrap { overflow-x: auto; }
.eq-order-table { width: 100%; min-width: 1080px; border-collapse: separate; border-spacing: 0; }
.eq-order-table thead th { position: sticky; top: 0; z-index: 1; height: 46px; padding: 0 16px; font-size: 12px; font-weight: 700; color: var(--wise-muted); background: var(--wise-page); border-bottom: 1px solid var(--wise-border); text-align: left; }
.eq-order-table tbody td { height: 58px; padding: 0 16px; font-size: 14px; color: var(--wise-text); border-bottom: 1px solid var(--wise-border-soft); white-space: nowrap; }
.eq-order-table tbody tr:last-child td { border-bottom: none; }
.eq-order-table tbody tr:hover td { background: var(--wise-hover); }
.ta-right { text-align: right !important; }
.tabular { font-variant-numeric: tabular-nums; }
.eq-status-tag { display: inline-flex; align-items: center; height: 24px; border-radius: 9999px; padding: 0 10px; font-size: 12px; font-weight: 600; }
.eq-order-btn { height: 34px; border-radius: 9999px; padding: 0 14px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; color: var(--wise-accent-foreground); background: var(--eq-green-gradient); box-shadow: 0 0 0 1px var(--wise-border); }
/* 弹窗 */
.eq-modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; }
.eq-modal { width: 480px; max-width: 90vw; background: var(--wise-surface); border-radius: 30px; overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.eq-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--wise-border); }
.eq-modal-close { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 9999px; transition: background 0.2s; color: var(--wise-muted); }
.eq-modal-close:hover { background: var(--wise-hover); }
.eq-modal-body { padding: 8px 24px; }
.eq-modal-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--wise-border-soft); }
.eq-modal-row:last-child { border-bottom: none; }
.eq-modal-footer { padding: 16px 24px; display: flex; gap: 12px; }
.eq-modal-btn { flex: 1; height: 46px; border-radius: 9999px; font-size: 15px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
.eq-modal-btn.close-btn { background: var(--wise-soft); color: var(--wise-accent-foreground); }
.eq-modal-btn.close-btn:hover { background: var(--wise-hover); }
@media (max-width: 1279px) {
  .eq-header { flex-direction: column; align-items: flex-start; gap: 14px; }
}
@media (max-width: 768px) {
  .eq-product-grid { grid-template-columns: 1fr; }
  .eq-head-metrics { width: 100%; }
  .eq-metric-box { flex: 1; min-width: 0; }
}
</style>

