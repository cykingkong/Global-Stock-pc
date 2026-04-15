<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import useUserStore from '@/stores/user'
import { addCommasToNumber } from '@/utils/tool'
import { orderList } from '@/api/stock'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const orderListData = ref<any[]>([])
const loading = ref(false)

async function getStockOrderList() {
  loading.value = true
  try {
    const { data } = await orderList({})
    orderListData.value = data?.positions || []
  } catch (error: any) {
    Message.error(error.message || 'Failed to load orders')
  } finally {
    loading.value = false
  }
}

function handleRowClick(item: any) {
  router.push({ path: '/detail', query: { symbol: item.symbol, tradingview_name: item.tradingview_name } })
}

onMounted(() => {
  userStore.info()
  getStockOrderList()
})
</script>

<template>
  <div class="stock-orders-page">
    <Nav />
    <div class="container">
      <div class="header-section">
        <div>
          <h1 class="page-title">{{ t('Transactions History') }}</h1>
          <div class="breadcrumb">{{ t('Home') }} / {{ t('Transactions History') }}</div>
        </div>
        <div class="header-metrics">
          <div class="metric-box">
            <span class="metric-label">{{ t('affund.myBalance') }}</span>
            <strong class="metric-value">${{ addCommasToNumber(userStore.userInfo?.balance || 0) }}</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label">{{ t('Total Positions') }}</span>
            <strong class="metric-value">{{ orderListData.length }}</strong>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center text-wise-muted py-20">{{ t('affund.loading') }}</div>
      <div v-else-if="orderListData.length === 0" class="text-center text-wise-muted py-20">{{ t('affund.noOrders') }}</div>
      <div v-else class="orders-panel">
        <div class="orders-toolbar">
          <div class="orders-title">{{ t('Transactions History') }}</div>
          <div class="orders-count">{{ orderListData.length }}</div>
        </div>
        <div class="orders-table-wrap">
          <table class="orders-table">
            <thead>
              <tr>
                <th>{{ t('index.market.name') }}</th>
                <th class="ta-right">{{ t('Quantity') }}</th>
                <th class="ta-right">{{ t('index.market.price') }}</th>
                <th class="ta-right">{{ t('index.market.change24h') }}</th>
                <th class="ta-right">{{ t('Value') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderListData" :key="item.symbol" @click="handleRowClick(item)">
                <td>
                  <div class="flex items-center gap-3">
                    <div v-if="item.logo_url" class="stock-logo">
                      <img :src="item.logo_url" alt="" />
                    </div>
                    <div>
                      <div class="stock-name">{{ item.symbol }}</div>
                      <div class="stock-full-name">{{ item.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="ta-right tabular">{{ addCommasToNumber(item.quantity) }}</td>
                <td class="ta-right tabular">${{ item.close?.toFixed(2) || '0.00' }}</td>
                <td class="ta-right tabular">
                  <span :class="Number(item.increase) >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'">
                    {{ Number(item.increase) >= 0 ? '+' : '' }}{{ item.increase }}
                  </span>
                </td>
                <td class="ta-right tabular font-semibold">
                  ${{ addCommasToNumber((item.quantity * (item.close || 0)).toFixed(2)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <IndexFooter />
  </div>
</template>

<style scoped>
.stock-orders-page { background: var(--wise-page); min-height: 100vh; color: var(--wise-text); }
.container { max-width: 1320px; margin: 0 auto; padding: 40px 20px; }
.header-section { display: flex; align-items: flex-end; justify-content: space-between; padding: 24px 28px; margin-bottom: 24px; border: 1px solid var(--wise-border); border-radius: 40px; background: var(--wise-surface); box-shadow: 0 0 0 1px var(--wise-border); }
.page-title { font-size: 56px; line-height: 0.9; font-weight: 900; letter-spacing: -0.05em; color: var(--wise-text); margin-bottom: 8px; }
.breadcrumb { font-size: 12px; color: var(--wise-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.header-metrics { display: flex; gap: 14px; }
.metric-box { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; padding: 14px 18px; border-radius: 30px; background: var(--wise-page); border: 1px solid var(--wise-border); }
.metric-label { font-size: 11px; color: var(--wise-muted); letter-spacing: 0.05em; text-transform: uppercase; }
.metric-value { font-size: 24px; color: var(--wise-text); font-weight: 900; letter-spacing: -0.03em; }
.orders-panel { background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 40px; overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.orders-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--wise-border); }
.orders-title { font-size: 22px; font-weight: 900; letter-spacing: -0.03em; color: var(--wise-text); }
.orders-count { font-size: 14px; color: var(--wise-muted); }
.orders-table-wrap { overflow-x: auto; }
.orders-table { width: 100%; border-collapse: collapse; }
.orders-table th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 700; color: var(--wise-muted); background: var(--wise-page); border-bottom: 1px solid var(--wise-border); }
.orders-table td { padding: 16px; font-size: 13px; color: var(--wise-text); border-bottom: 1px solid var(--wise-border-soft); }
.orders-table tbody tr { cursor: pointer; transition: background 0.2s; }
.orders-table tbody tr:hover { background: var(--wise-hover); }
.orders-table .ta-right { text-align: right; }
.orders-table .tabular { font-variant-numeric: tabular-nums; }
.stock-logo { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background: var(--wise-soft); box-shadow: 0 0 0 1px var(--wise-border); }
.stock-logo img { width: 100%; height: 100%; object-fit: cover; }
.stock-name { font-size: 14px; font-weight: 700; color: var(--wise-text); }
.stock-full-name { font-size: 12px; color: var(--wise-muted); }

@media (max-width: 1024px) {
  .header-section { flex-direction: column; align-items: flex-start; gap: 16px; }
  .page-title { font-size: 42px; }
}

@media (max-width: 640px) {
  .page-title { font-size: 36px; }
  .header-metrics { width: 100%; flex-direction: column; }
  .metric-box { align-items: flex-start; }
}
</style>
