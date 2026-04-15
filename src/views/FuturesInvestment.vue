<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import useUserStore from '@/stores/user'
import { addCommasToNumber } from '@/utils/tool'
import { getDcaProducts, getMyDcaPlans, payDcaDeduct } from '@/api/dca'

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

// ========== 产品列表 ==========

// 将 invest_options 转为 plans 格式（与手机端 buildPlans 完全一致）
function buildPlans(item: any) {
  const plans: any[] = []
  const options = item.invest_options || {}
  if (options.daily?.length) {
    const first = options.daily[0]
    plans.push({
      type: 'daily',
      rate: (first.profit_rate || 0) * 100,
      ratePct: first.profit_rate_pct,
      remaining: first.available_shares_percentage ?? item.available_shares_percentage ?? 100,
    })
  }
  if (options.weekly?.length) {
    const first = options.weekly[0]
    plans.push({
      type: 'weekly',
      rate: (first.profit_rate || 0) * 100,
      ratePct: first.profit_rate_pct,
      remaining: first.available_shares_percentage ?? item.available_shares_percentage ?? 100,
    })
  }
  if (options.monthly?.length) {
    const first = options.monthly[0]
    plans.push({
      type: 'monthly',
      rate: (first.profit_rate || 0) * 100,
      ratePct: first.profit_rate_pct,
      remaining: first.available_shares_percentage ?? item.available_shares_percentage ?? 100,
    })
  }
  return plans
}

async function fetchProducts() {
  productLoading.value = true
  try {
    const { data, code } = await getDcaProducts(undefined, false)
    if (code === 200 && data) {
      productList.value = data.map((item: any) => ({
        id: item.id,
        logo: item.logo_url || '',
        name: item.name,
        price: item.close,
        changeRate: Number.parseFloat(String(item.increase).replace('%', '')) || 0,
        plans: buildPlans(item),
      }))
    }
  } catch (e) {
    console.error('获取产品列表失败', e)
  } finally {
    productLoading.value = false
  }
}

// ========== 订单列表 ==========

function toPercent(rate: number) {
  if (!Number.isFinite(rate)) return 0
  return rate <= 1 ? rate * 100 : rate
}

function mapOrderStatus(status: number | string) {
  const numStatus = Number(status)
  if (numStatus === 1) return 'active'
  if (numStatus === 2) return 'completed'
  return 'cancelled'
}

function planTypeLabel(type: string) {
  const map: Record<string, string> = {
    daily: t('Daily Investment'),
    weekly: t('Weekly Investment'),
    monthly: t('Monthly Investment'),
  }
  return map[type] || t('Daily Investment')
}

async function fetchOrders() {
  orderLoading.value = true
  try {
    const { data, code } = await getMyDcaPlans(undefined, true)
    if (code === 200) {
      const rows = data?.data || []
      orderList.value = rows.map((item: any) => ({
        id: item.id,
        logo: item.product_logo_url || '',
        name: item.product_name || '',
        returnRate: toPercent(Number(item.profit_rate || 0)),
        amount: Number(item.invest_amount || 0),
        planType: item.invest_type || 'daily',
        planTypeText: planTypeLabel(item.invest_type || 'daily'),
        planDays: Number(item.period_days || 0),
        expectedProfit: Number(item.expected_profit || 0),
        endDate: item.end_date || '',
        nextPaymentDate: item.next_deduct_date || '',
        status: mapOrderStatus(item.status),
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

// 点击产品卡片 → 跳详情页
function handleProductClick(product: any) {
  const defaultType = product?.plans?.[0]?.type || 'daily'
  router.push({
    path: '/futures/detail',
    query: { id: product.id, name: product.name, type: defaultType },
  })
}

// 点击某个计划 → 跳详情页
function handlePlanClick(product: any, planType: string) {
  router.push({
    path: '/futures/detail',
    query: { id: product.id, name: product.name, type: planType },
  })
}

// 提前缴纳
async function handlePayEarly(orderId: number) {
  if (!confirm(t('Confirm early payment?'))) return
  try {
    await payDcaDeduct(orderId)
    await fetchOrders()
    userStore.info()
  } catch (e) {
    console.error('提前缴纳失败', e)
  }
}

// 计划类型配置
const planTypeConfig: Record<string, { label: string; color: string }> = {
  daily: { label: t('Daily Investment'), color: '#12D18E' },
  weekly: { label: t('Weekly Investment'), color: '#FFA500' },
  monthly: { label: t('Monthly Investment'), color: '#FF5A5F' },
}

function getPlanConfig(type: string) {
  return planTypeConfig[type] || planTypeConfig.daily
}

function getStatusMeta(status: string) {
  if (status === 'completed') return { text: t('Completed'), color: '#4AAF57', bg: '#E8FAF3' }
  if (status === 'cancelled') return { text: t('Cancelled'), color: '#FF5A5F', bg: '#FFF0F0' }
  return { text: t('In Progress'), color: '#FF9900', bg: '#FFF9E6' }
}

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
  <div class="ft-page min-h-screen bg-wise-page text-wise-text [font-feature-settings:'calt']">
    <Nav />
    <div class="ft-shell max-w-[1320px] mx-auto px-6 py-8">
      <div class="ft-header mb-6">
        <div>
          <h1 class="text-[34px] leading-[0.92] font-black tracking-[-0.04em] text-wise-text">{{ t('Futures Investment') }}</h1>
          <div class="ft-subtitle mt-2">{{ t('Fund Pool') }} / {{ t('Orders') }}</div>
        </div>
        <div class="ft-head-metrics">
          <div class="ft-metric-box">
            <span class="ft-metric-label">{{ t('My balance') }}</span>
            <strong class="ft-metric-value">${{ addCommasToNumber(userStore.userInfo?.balance || 0) }}</strong>
          </div>
          <div class="ft-metric-box">
            <span class="ft-metric-label">{{ t('Orders') }}</span>
            <strong class="ft-metric-value">{{ orderList.length }}</strong>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="ft-tabs mb-6">
        <button v-for="(tab, index) in tabs" :key="index" class="ft-tab-btn" :class="{ 'is-active': activeTab === index }" @click="handleTabChange(index)">
          {{ tab.label }}
        </button>
      </div>

      <!-- 产品列表 -->
      <div v-if="activeTab === 0">
        <div v-if="productLoading" class="text-center text-[#94A3B8] py-20">Loading...</div>
        <div v-else-if="productList.length === 0" class="text-center text-[#94A3B8] py-20">{{ t('No products available') }}</div>
        <div v-else class="ft-product-grid">
          <div v-for="product in productList" :key="product.id" class="ft-product-card" @click="handleProductClick(product)">
            <!-- 产品头部 -->
            <div class="ft-product-header">
              <div class="flex items-center gap-3">
                <div class="ft-product-logo"><img :src="product.logo" alt="" class="h-full w-full object-cover" /></div>
                <span class="text-[16px] text-wise-text font-bold">{{ product.name }}</span>
              </div>
              <div class="flex items-center gap-[6px]">
                <span class="text-[16px] text-wise-text font-bold">${{ addCommasToNumber(product.price) }}</span>
                <span class="text-[14px] font-medium" :class="product.changeRate >= 0 ? 'text-trend-up' : 'text-trend-down'">
                  {{ product.changeRate >= 0 ? '+' : '' }}{{ product.changeRate }}%
                </span>
                <svg class="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :fill="product.changeRate >= 0 ? 'var(--wise-accent)' : '#FF5A5F'" d="M10.869 16.6308C10.811 16.5743 10.563 16.3609 10.359 16.1622C9.076 14.9971 6.976 11.9576 6.335 10.3668C6.232 10.1252 6.014 9.51437 6 9.18802C6 8.8753 6.072 8.5772 6.218 8.29274C6.422 7.93814 6.743 7.65368 7.122 7.49781C7.385 7.39747 8.172 7.2416 8.186 7.2416C9.047 7.08573 10.446 7 11.992 7C13.465 7 14.807 7.08573 15.681 7.21335C15.695 7.22796 16.673 7.38383 17.008 7.55431C17.62 7.86702 18 8.47784 18 9.13151V9.18802C17.985 9.61374 17.605 10.509 17.591 10.509C16.949 12.0141 14.952 14.9834 13.625 16.1768C13.625 16.1768 13.284 16.5129 13.071 16.659C12.765 16.887 12.386 17 12.007 17C11.584 17 11.19 16.8724 10.869 16.6308Z" />
                </svg>
              </div>
            </div>
            <div class="h-[1px] bg-wise-border mt-[18px] mb-[16px]" />
            <!-- 定投计划列表 -->
            <div class="ft-plans-list">
              <div v-for="(plan, pIdx) in product.plans" :key="pIdx" class="ft-plan-item" @click.stop="handlePlanClick(product, plan.type)">
                <div class="flex items-center justify-between mb-[8px]">
                  <span class="text-[15px] text-wise-text font-bold">{{ getPlanConfig(plan.type).label }}</span>
                  <span class="text-[15px] text-wise-text font-bold">{{ plan.ratePct }}</span>
                </div>
                <div class="flex items-center justify-between mb-[8px]">
                  <span class="text-[12px] text-wise-muted">{{ t('Plan') }}</span>
                  <span class="text-[12px] text-wise-muted">{{ t('Expected Min Return Rate') }}</span>
                </div>
                <div class="flex items-center justify-between mb-[6px]">
                  <span class="text-[12px] font-semibold" :style="{ color: getPlanConfig(plan.type).color }">{{ t('Remaining Quota') }}</span>
                  <span class="text-[12px] font-semibold" :style="{ color: getPlanConfig(plan.type).color }">{{ plan.remaining }}%</span>
                </div>
                <div class="h-[6px] bg-wise-border rounded-full overflow-hidden">
                  <div class="ft-progress-fill h-full rounded-full" :style="{ width: plan.remaining + '%', backgroundColor: getPlanConfig(plan.type).color }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单列表 -->
      <div v-if="activeTab === 1">
        <div v-if="orderLoading" class="text-center text-[#94A3B8] py-20">Loading...</div>
        <div v-else-if="orderList.length === 0" class="text-center text-[#94A3B8] py-20">{{ t('No orders yet') }}</div>
        <div v-else class="ft-order-panel">
          <div class="ft-order-toolbar">
            <div class="ft-order-title">{{ t('Orders') }}</div>
            <div class="ft-order-count">{{ orderList.length }}</div>
          </div>
          <div class="ft-order-table-wrap">
            <table class="ft-order-table">
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
                        <div class="text-[12px] text-wise-muted">{{ order.planTypeText }}({{ order.planDays }}{{ t('Days') }})</div>
                      </div>
                    </div>
                  </td>
                  <td class="ta-right tabular">${{ addCommasToNumber(order.amount) }}</td>
                  <td class="ta-right tabular text-wise-accent font-semibold">{{ order.returnRate }}%</td>
                  <td class="ta-right tabular font-semibold">${{ addCommasToNumber(order.expectedProfit) }}</td>
                  <td class="text-[13px]">{{ order.endDate || '--' }}</td>
                  <td class="text-[13px]">{{ order.nextPaymentDate || '--' }}</td>
                  <td>
                    <span class="ft-status-tag" :style="{ color: getStatusMeta(order.status).color, backgroundColor: getStatusMeta(order.status).bg }">
                      {{ getStatusMeta(order.status).text }}
                    </span>
                  </td>
                  <td class="ta-right">
                    <button v-if="order.status === 'active'" class="ft-order-btn primary" @click="handlePayEarly(order.id)">{{ t('Pay Now') }}</button>
                    <span v-else class="text-wise-muted">--</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <IndexFooter />
  </div>
</template>

<style scoped>
.ft-page { --ft-green: var(--wise-accent); --ft-green-gradient: linear-gradient(286.17deg, var(--wise-accent) 0%, #71e3bb 100%); background: var(--wise-page); display: flex; flex-direction: column; min-height: 100vh; }
.ft-shell { flex: 1 0 auto; width: 100%; }
.ft-header { display: flex; align-items: flex-end; justify-content: space-between; padding: 24px 28px; border: 1px solid var(--wise-border); border-radius: 30px; background: var(--wise-surface); box-shadow: 0 0 0 1px var(--wise-border); }
.ft-subtitle { font-size: 12px; letter-spacing: 0.08em; color: var(--wise-muted); text-transform: uppercase; }
.ft-head-metrics { display: flex; gap: 14px; }
.ft-metric-box { min-width: 170px; padding: 12px 14px; border-radius: 20px; border: 1px solid var(--wise-border); background: var(--wise-page); }
.ft-metric-label { display: block; font-size: 12px; color: var(--wise-muted); margin-bottom: 4px; }
.ft-metric-value { color: var(--wise-text); font-size: 18px; font-weight: 700; }
.ft-tabs { display: inline-flex; align-items: center; gap: 8px; background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 20px; padding: 8px; min-height: 58px; box-shadow: 0 0 0 1px var(--wise-border); }
.ft-tab-btn { height: 42px; border: none; padding: 0 18px; border-radius: 9999px; background: transparent; color: var(--wise-muted); font-size: 14px; font-weight: 600; position: relative; cursor: pointer; transition: all 0.2s; }
.ft-tab-btn:hover { color: var(--wise-text); background: var(--wise-hover); }
.ft-tab-btn.is-active { color: var(--wise-accent-foreground); background: var(--wise-accent); box-shadow: 0 0 0 1px var(--wise-border); }
.ft-product-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.ft-product-card { position: relative; background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 30px; padding: 24px; cursor: pointer; transition: all 0.26s ease; overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.ft-product-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--wise-accent), #65e2bc); opacity: 0; transition: opacity 0.2s; }
.ft-product-card:hover { transform: translateY(-2px); border-color: var(--wise-accent); }
.ft-product-card:hover::before { opacity: 1; }
.ft-product-header { display: flex; align-items: center; justify-content: space-between; }
.ft-product-logo { width: 42px; height: 42px; border-radius: 14px; background: var(--wise-soft); overflow: hidden; flex-shrink: 0; border: 1px solid var(--wise-border); }
.ft-plans-list { display: flex; flex-direction: column; gap: 10px; }
.ft-plan-item { padding: 14px; border-radius: 20px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
.ft-plan-item:hover { background: var(--wise-hover); border-color: var(--wise-border); }
.ft-plans-list .ft-plan-item:not(:last-child) { border-bottom: 1px solid var(--wise-border-soft); }
.ft-progress-fill { transition: width 0.3s ease; }
/* 订单 */
.ft-order-panel { background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 30px; overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.ft-order-toolbar { min-height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid var(--wise-border); background: var(--wise-page); }
.ft-order-title { font-size: 13px; color: var(--wise-text); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.ft-order-count { min-width: 28px; height: 22px; padding: 0 8px; border-radius: 999px; background: var(--wise-soft); color: var(--wise-accent-foreground); font-size: 12px; line-height: 22px; text-align: center; }
.ft-order-table-wrap { overflow-x: auto; }
.ft-order-table { width: 100%; min-width: 1080px; border-collapse: separate; border-spacing: 0; }
.ft-order-table thead th { position: sticky; top: 0; z-index: 1; height: 46px; padding: 0 16px; font-size: 12px; font-weight: 700; color: var(--wise-muted); background: var(--wise-page); border-bottom: 1px solid var(--wise-border); text-align: left; }
.ft-order-table tbody td { height: 58px; padding: 0 16px; font-size: 14px; color: var(--wise-text); border-bottom: 1px solid var(--wise-border-soft); white-space: nowrap; }
.ft-order-table tbody tr:last-child td { border-bottom: none; }
.ft-order-table tbody tr:hover td { background: var(--wise-hover); }
.ta-right { text-align: right !important; }
.tabular { font-variant-numeric: tabular-nums; }
.ft-status-tag { display: inline-flex; align-items: center; height: 24px; border-radius: 9999px; padding: 0 10px; font-size: 12px; font-weight: 600; }
.ft-order-btn { height: 34px; border-radius: 9999px; padding: 0 14px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; }
.ft-order-btn.primary { color: var(--wise-accent-foreground); background: var(--ft-green-gradient); box-shadow: 0 0 0 1px var(--wise-border); }
@media (max-width: 1279px) {
  .ft-header { flex-direction: column; align-items: flex-start; gap: 14px; }
}
@media (max-width: 768px) {
  .ft-product-grid { grid-template-columns: 1fr; }
  .ft-head-metrics { width: 100%; }
  .ft-metric-box { flex: 1; min-width: 0; }
}
</style>
