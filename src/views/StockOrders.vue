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

      <div v-if="loading" class="text-center text-[#94A3B8] py-20">{{ t('affund.loading') }}</div>
      <div v-else-if="orderListData.length === 0" class="text-center text-[#94A3B8] py-20">{{ t('affund.noOrders') }}</div>
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
.stock-orders-page { background: linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%); min-height: 100vh; }
.container { max-width: 1320px; margin: 0 auto; padding: 40px 20px; }
.header-section { display: flex; align-items: flex-end; justify-content: space-between; padding: 20px 24px; margin-bottom: 24px; border: 1px solid #dde5f2; border-radius: 16px; background: linear-gradient(130deg, #ffffff, #f7faff); }
.page-title { font-size: 30px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
.breadcrumb { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; }
.header-metrics { display: flex; gap: 14px; }
.metric-box { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; padding: 12px 18px; border-radius: 12px; background: rgba(255, 255, 255, 0.7); border: 1px solid #e8eef7; }
.metric-label { font-size: 11px; color: #64748b; letter-spacing: 0.05em; text-transform: uppercase; }
.metric-value { font-size: 20px; color: #0f172a; font-weight: 700; }
.orders-panel { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.orders-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.orders-title { font-size: 16px; font-weight: 700; color: #0f172a; }
.orders-count { font-size: 14px; color: #64748b; }
.orders-table-wrap { overflow-x: auto; }
.orders-table { width: 100%; border-collapse: collapse; }
.orders-table th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.orders-table td { padding: 16px; font-size: 13px; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
.orders-table tbody tr { cursor: pointer; transition: background 0.2s; }
.orders-table tbody tr:hover { background: #fafcff; }
.orders-table .ta-right { text-align: right; }
.orders-table .tabular { font-variant-numeric: tabular-nums; }
.stock-logo { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: #e5e7eb; }
.stock-logo img { width: 100%; height: 100%; object-fit: cover; }
.stock-name { font-size: 14px; font-weight: 600; color: #0f172a; }
.stock-full-name { font-size: 12px; color: #64748b; }
</style>
