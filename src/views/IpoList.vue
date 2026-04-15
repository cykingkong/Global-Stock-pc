<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import useUserStore from '@/stores/user'
import { addCommasToNumber } from '@/utils/tool'
import { ipoProductList, ipoOrderList } from '@/api/ipo'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()

const activeTab = ref(0)
const tabs = computed(() => [
  { label: t('ipo.products') },
  { label: t('ipo.orders') },
])

const productList = ref<any[]>([])
const productLoading = ref(false)

const orderList = ref<any[]>([])
const orderLoaded = ref(false)
const orderLoading = ref(false)

async function fetchProducts() {
  productLoading.value = true
  try {
    const res = await ipoProductList()
    productList.value = res.data?.data || []
  } catch (e: any) {
    Message.error(e.message || 'Failed to load products')
  } finally {
    productLoading.value = false
  }
}

async function fetchOrders() {
  orderLoading.value = true
  try {
    const res = await ipoOrderList()
    orderList.value = res.data?.data || []
    orderLoaded.value = true
  } catch (e: any) {
    Message.error(e.message || 'Failed to load orders')
  } finally {
    orderLoading.value = false
  }
}

function handleTabChange(index: number) {
  activeTab.value = index
  if (index === 1 && !orderLoaded.value) fetchOrders()
}

function handleProductClick(product: any) {
  router.push({ path: '/ipo/detail', query: { id: product.id } })
}

function handleOrderAction(order: any) {
  Message.info(`操作: ${order.project_name}`)
}

function getStatusConfig(status: number) {
  const map: any = {
    1: { text: t('ipo.pending'), color: '#F59E0B', bg: '#FEF3E8' },
    2: { text: t('ipo.inProgress'), color: '#12D18E', bg: '#E8FAF3' },
    3: { text: t('ipo.ended'), color: '#64748B', bg: '#F1F5F9' },
  }
  return map[status] || map[1]
}

function getOrderStatusConfig(status: number) {
  const map: any = {
    1: { text: t('ipo.waitingForDraw'), color: '#12D18E', bg: '#E8FAF3' },
    2: { text: t('ipo.won'), color: '#12D18E', bg: '#E8FAF3' },
    3: { text: t('ipo.listed'), color: '#12D18E', bg: '#E8FAF3' },
    4: { text: t('ipo.refunded'), color: '#12D18E', bg: '#E8FAF3' },
    5: { text: t('ipo.sold'), color: '#64748B', bg: '#F1F5F9' },
  }
  return map[status] || map[1]
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
  <div class="ipo-page min-h-screen">
    <Nav />
    <div class="ipo-shell max-w-[1320px] mx-auto px-6 py-8">
      <div class="ipo-header mb-6">
        <div>
          <h1 class="text-[56px] leading-[0.9] font-black tracking-[-0.05em] text-wise-text">{{ t('ipo.title') }}</h1>
          <div class="ipo-subtitle mt-2">{{ t('ipo.products') }} / {{ t('ipo.orders') }}</div>
        </div>
        <div class="ipo-head-metrics">
          <div class="ipo-metric-box">
            <span class="ipo-metric-label">{{ t('ipo.myBalance') }}</span>
            <strong class="ipo-metric-value">${{ addCommasToNumber(userStore.userInfo?.balance || 0) }}</strong>
          </div>
          <div class="ipo-metric-box">
            <span class="ipo-metric-label">{{ t('ipo.orders') }}</span>
            <strong class="ipo-metric-value">{{ orderList.length }}</strong>
          </div>
        </div>
      </div>

      <div class="ipo-tabs mb-6">
        <button v-for="(tab, index) in tabs" :key="index" class="ipo-tab-btn" :class="{ 'is-active': activeTab === index }" @click="handleTabChange(index)">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 0">
        <div v-if="productLoading" class="text-center text-wise-muted py-20">{{ t('affund.loading') }}</div>
        <div v-else-if="productList.length === 0" class="text-center text-wise-muted py-20">{{ t('ipo.noProducts') }}</div>
        <div v-else class="ipo-product-grid">
          <div v-for="product in productList" :key="product.id" class="ipo-product-card" @click="handleProductClick(product)">
            <div class="ipo-product-header">
              <h3 class="text-[18px] text-wise-text font-black tracking-[-0.03em]">{{ product.name }}</h3>
              <span class="ipo-status-tag" :style="{ color: getStatusConfig(product.status).color, backgroundColor: getStatusConfig(product.status).bg }">
                {{ getStatusConfig(product.status).text }}
              </span>
            </div>
            <div class="h-[1px] bg-[var(--wise-border)] mt-[18px] mb-[16px]" />
            <div class="ipo-price-info">
              <div class="ipo-price-item">
                <div class="text-[16px] text-wise-text font-black mb-1">${{ addCommasToNumber(product.issue_price) }}</div>
                <div class="text-[12px] text-wise-muted">{{ t('ipo.issuePrice') }}</div>
              </div>
              <div class="ipo-price-item text-right">
                <div class="text-[16px] text-wise-text font-black mb-1">
                  ${{ product.listing_price_min }} ~ ${{ product.listing_price_max }}
                </div>
                <div class="text-[12px] text-wise-muted">{{ t('ipo.listingPrice') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 1">
        <div v-if="orderLoading" class="text-center text-wise-muted py-20">{{ t('affund.loading') }}</div>
        <div v-else-if="orderList.length === 0" class="text-center text-wise-muted py-20">{{ t('ipo.noOrders') }}</div>
        <div v-else class="ipo-order-panel">
          <div class="ipo-order-toolbar">
            <div class="ipo-order-title">{{ t('ipo.orders') }}</div>
            <div class="ipo-order-count">{{ orderList.length }}</div>
          </div>
          <div class="ipo-order-table-wrap">
            <table class="ipo-order-table">
              <thead>
                <tr>
                  <th>{{ t('ipo.companyName') }}</th>
                  <th class="ta-right">{{ t('ipo.issuePrice') }}</th>
                  <th class="ta-right">{{ t('ipo.allottedQty') }}</th>
                  <th class="ta-right">{{ t('ipo.listingPrice') }}</th>
                  <th class="ta-right">{{ t('ipo.expectedProfit') }}</th>
                  <th>{{ t('ipo.status') }}</th>
                  <th class="ta-right"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orderList" :key="order.id">
                  <td>
                    <div class="text-[14px] text-wise-text font-semibold">{{ order.project_name }}</div>
                  </td>
                  <td class="ta-right tabular">${{ addCommasToNumber(order.issue_price) }}</td>
                  <td class="ta-right tabular">{{ order.allotted_qty || 0 }}</td>
                  <td class="ta-right tabular">
                    ${{ order.listing_price_min }} ~ ${{ order.listing_price_max }}
                  </td>
                  <td class="ta-right tabular font-semibold">${{ addCommasToNumber(order.projected_earnings || 0) }}</td>
                  <td>
                    <span class="ipo-status-tag" :style="{ color: getOrderStatusConfig(order.status).color, backgroundColor: getOrderStatusConfig(order.status).bg }">
                      {{ getOrderStatusConfig(order.status).text }}
                    </span>
                  </td>
                  <td class="ta-right">
                    <button v-if="order.status === 3" class="ipo-order-btn primary" @click="handleOrderAction(order)">{{ t('ipo.sell') }}</button>
                    <button v-else-if="order.status === 4" class="ipo-order-btn primary" @click="handleOrderAction(order)">{{ t('ipo.applyRefund') }}</button>
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
.ipo-page { background: var(--wise-page); display: flex; flex-direction: column; min-height: 100vh; color: var(--wise-text); }
.ipo-shell { flex: 1 0 auto; width: 100%; }
.ipo-header { display: flex; align-items: flex-end; justify-content: space-between; padding: 24px 28px; border: 1px solid var(--wise-border); border-radius: 40px; background: var(--wise-surface); box-shadow: 0 0 0 1px var(--wise-border); }
.ipo-subtitle { font-size: 12px; letter-spacing: 0.08em; color: var(--wise-muted); text-transform: uppercase; }
.ipo-head-metrics { display: flex; gap: 14px; }
.ipo-metric-box { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; padding: 14px 18px; border-radius: 30px; background: var(--wise-page); border: 1px solid var(--wise-border); }
.ipo-metric-label { font-size: 11px; color: var(--wise-muted); letter-spacing: 0.05em; text-transform: uppercase; }
.ipo-metric-value { font-size: 24px; color: var(--wise-text); font-weight: 900; letter-spacing: -0.03em; }
.ipo-tabs { display: flex; gap: 8px; padding: 6px; background: var(--wise-surface); border-radius: 9999px; border: 1px solid var(--wise-border); box-shadow: 0 0 0 1px var(--wise-border); }
.ipo-tab-btn { flex: 1; padding: 12px 20px; font-size: 14px; font-weight: 700; color: var(--wise-muted); background: transparent; border: none; border-radius: 9999px; cursor: pointer; transition: all 0.2s; }
.ipo-tab-btn:hover { color: var(--wise-text); background: var(--wise-hover); }
.ipo-tab-btn.is-active { color: var(--wise-accent-foreground); background: var(--wise-soft); }
.ipo-product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.ipo-product-card { padding: 24px; background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 30px; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 0 1px var(--wise-border); }
.ipo-product-card:hover { transform: translateY(-2px); border-color: var(--wise-accent); }
.ipo-product-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ipo-status-tag { padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
.ipo-price-info { display: flex; justify-content: space-between; gap: 16px; }
.ipo-order-panel { background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 40px; overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.ipo-order-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--wise-border); }
.ipo-order-title { font-size: 22px; font-weight: 900; color: var(--wise-text); letter-spacing: -0.03em; }
.ipo-order-count { font-size: 14px; color: var(--wise-muted); }
.ipo-order-table-wrap { overflow-x: auto; }
.ipo-order-table { width: 100%; border-collapse: collapse; }
.ipo-order-table th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 700; color: var(--wise-muted); background: var(--wise-page); border-bottom: 1px solid var(--wise-border); }
.ipo-order-table td { padding: 16px; font-size: 13px; color: var(--wise-text); border-bottom: 1px solid var(--wise-border-soft); }
.ipo-order-table .ta-right { text-align: right; }
.ipo-order-table .tabular { font-variant-numeric: tabular-nums; }
.ipo-order-btn { padding: 8px 18px; font-size: 13px; font-weight: 700; border: none; border-radius: 9999px; cursor: pointer; transition: transform 0.2s, opacity 0.2s; }
.ipo-order-btn.primary { background: var(--wise-accent); color: var(--wise-accent-foreground); }
.ipo-order-btn.primary:hover { transform: scale(1.05); }
</style>
