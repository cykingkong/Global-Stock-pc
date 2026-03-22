<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import useUserStore from '@/stores/user'
import { addCommasToNumber } from '@/utils/tool'
import { getDcaProductDetail, buyDcaPlan } from '@/api/dca'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userBalance = computed(() => userStore.userInfo?.balance || 0)

// 产品原始数据
const productDetail = ref<any>(null)

// 产品信息（从路由 query）
const productInfo = ref({ id: '', name: '', type: 'daily' })

// 周期选项（从接口 invest_options 生成，与手机端完全一致）
const periodOptions = computed(() => {
  const detail = productDetail.value
  if (!detail?.invest_options) return []
  const type = productInfo.value.type
  const options = detail.invest_options[type] || []
  return options.map((opt: any) => ({
    rate: (opt.profit_rate || 0) * 100,
    ratePct: opt.profit_rate_pct || '',
    days: opt.period_days,
    label: `${opt.period_days}${t('Days')}`,
    remaining: opt.available_shares_percentage ?? 100,
  }))
})

// 最低投资金额
const minInvestAmount = computed(() => {
  const detail = productDetail.value
  if (!detail) return 0
  const typeMap: Record<string, string> = {
    daily: 'min_invest_amount_daily',
    weekly: 'min_invest_amount_weekly',
    monthly: 'min_invest_amount_monthly',
  }
  return detail[typeMap[productInfo.value.type]] || 0
})

const amountPlaceholder = computed(() => {
  const min = Number(minInvestAmount.value || 0)
  return `${min} ~ 999,999,999`
})

const selectedPeriod = ref(0)
const investAmount = ref('')
const displayAmount = ref('')
const autoDeduct = ref(true)
const submitLoading = ref(false)

const expectedProfit = computed(() => {
  const amount = Number(investAmount.value) || 0
  const period = periodOptions.value[selectedPeriod.value]
  if (!amount || !period) return 0
  return (amount * period.rate) / 100
})

const maturityDate = computed(() => {
  const period = periodOptions.value[selectedPeriod.value]
  if (!period) return ''
  const date = new Date()
  date.setDate(date.getDate() + period.days)
  return date.toISOString().split('T')[0]
})

const deductionCycle = computed(() => {
  const map: Record<string, string> = { daily: t('Every Day'), weekly: t('Every Week'), monthly: t('Every Month') }
  return map[productInfo.value.type] || t('Every Day')
})

const navTitle = computed(() => {
  const map: Record<string, string> = { daily: t('Daily Investment'), weekly: t('Weekly Investment'), monthly: t('Monthly Investment') }
  return `${productInfo.value.name} ${map[productInfo.value.type] || t('Daily Investment')}`
})

async function fetchProductDetail() {
  if (!productInfo.value.id) return
  try {
    const { data, code } = await getDcaProductDetail(productInfo.value.id, productInfo.value.type)
    if (code === 200 && data) {
      productDetail.value = data
      productInfo.value.name = data.name || productInfo.value.name
      selectedPeriod.value = 0
    }
  } catch (e) {
    console.error('获取产品详情失败', e)
  }
}

function selectPeriod(index: number) { selectedPeriod.value = index }
function handleRefreshBalance() { userStore.info() }

watch(displayAmount, (newVal) => {
  const filtered = newVal.replace(/[^\d.]/g, '')
  const parts = filtered.split('.')
  if (parts.length > 2) { displayAmount.value = parts[0] + '.' + parts.slice(1).join(''); return }
  if (parts.length === 2 && parts[1].length > 2) { displayAmount.value = parts[0] + '.' + parts[1].slice(0, 2); return }
  displayAmount.value = filtered
  investAmount.value = filtered
})

async function handleConfirmOrder() {
  if (submitLoading.value) return
  if (!investAmount.value || Number(investAmount.value) <= 0) return
  const amount = Number(investAmount.value)
  if (amount < minInvestAmount.value) { alert(`${t('Minimum investment')}: $${minInvestAmount.value}`); return }
  if (amount > userBalance.value) { alert(t('Insufficient balance')); return }
  const period = periodOptions.value[selectedPeriod.value]
  if (!period) return

  submitLoading.value = true
  try {
    const { code } = await buyDcaPlan({
      product_id: Number(productInfo.value.id),
      invest_type: productInfo.value.type,
      invest_amount: amount,
      period_days: period.days,
    })
    if (code === 200) {
      await userStore.info()
      router.push({ path: '/futures', query: { tab: '1' } })
    }
  } catch (e) {
    console.error('下单失败', e)
  } finally {
    submitLoading.value = false
  }
}

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/futures')
}

onMounted(() => {
  userStore.info()
  if (route.query.id) productInfo.value.id = route.query.id as string
  if (route.query.name) productInfo.value.name = route.query.name as string
  if (route.query.type) productInfo.value.type = route.query.type as string
  fetchProductDetail()
})
</script>

<template>
  <div class="ftd-page min-h-screen">
    <Nav />
    <div class="ftd-shell max-w-[1320px] mx-auto px-6 py-8">
      <!-- 面包屑 -->
      <div class="ftd-breadcrumb mb-6">
        <button class="ftd-back-btn" @click="goBack">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ t('Futures Investment') }}
        </button>
        <span class="text-[#9CA3AF] mx-2">/</span>
        <span class="text-[#111827] font-semibold">{{ navTitle }}</span>
      </div>

      <div class="grid grid-cols-12 gap-8">
        <!-- 左侧表单 -->
        <div class="col-span-12 xl:col-span-8">
          <div class="ftd-card">
            <div class="ftd-card-header">
              <div class="ftd-title-wrap">
                <h2 class="text-[24px] font-bold text-[#0f172a]">{{ navTitle }}</h2>
                <span class="ftd-title-tag">DCA</span>
              </div>
            </div>
            <div class="ftd-card-body">
              <!-- 周期选择 -->
              <div class="mb-8">
                <div class="text-[13px] text-[#64748b] font-semibold mb-3 uppercase tracking-[0.08em]">{{ t('Select Period') }}</div>
                <div v-if="periodOptions.length === 0" class="text-[13px] text-[#94A3B8]">Loading...</div>
                <div v-else class="ftd-period-grid">
                  <div v-for="(option, index) in periodOptions" :key="index" class="ftd-period-option" :class="{ 'is-active': selectedPeriod === index }" @click="selectPeriod(index)">
                    <div class="ftd-period-rate">{{ option.rate }}%</div>
                    <div class="ftd-period-days">{{ option.label }}</div>
                  </div>
                </div>
              </div>
              <!-- 金额输入 -->
              <div class="mb-6">
                <div class="text-[13px] text-[#64748b] font-semibold mb-3 uppercase tracking-[0.08em]">{{ t('Investment Amount') }}</div>
                <div class="ftd-amount-wrap">
                  <span class="ftd-amount-prefix">$</span>
                  <input v-model="displayAmount" type="text" inputmode="decimal" :placeholder="amountPlaceholder" class="ftd-amount-input" />
                </div>
              </div>
              <!-- 余额 -->
              <div class="flex items-center justify-end gap-2 mb-8">
                <span class="text-[13px] text-[#64748B]">{{ t('My balance') }}: ${{ addCommasToNumber(userBalance) }}</span>
                <svg class="cursor-pointer" width="16" height="16" viewBox="0 0 18 18" fill="none" @click="handleRefreshBalance">
                  <path d="M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C10.8639 2.25 12.5515 3.03188 13.773 4.275" stroke="#12D18E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12.375 3.9375H15.75V0.5625" stroke="#12D18E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <!-- 信息列表 -->
              <div class="ftd-info-list">
                <div class="ftd-info-row"><span class="ftd-info-label">{{ t('Expected 7-Day Profit') }}</span><span class="ftd-info-value">${{ addCommasToNumber(expectedProfit) }}</span></div>
                <div class="ftd-info-row"><span class="ftd-info-label">{{ t('Maturity Date') }}</span><span class="ftd-info-value">{{ maturityDate }}</span></div>
                <div class="ftd-info-row"><span class="ftd-info-label">{{ t('Deduction Cycle') }}</span><span class="ftd-info-value">{{ deductionCycle }}</span></div>
                <div class="ftd-info-row">
                  <span class="ftd-info-label">{{ t('Auto Deduct Balance') }}</span>
                  <label class="ftd-switch"><input v-model="autoDeduct" type="checkbox" disabled /><span class="ftd-switch-slider" /></label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧摘要 -->
        <div class="col-span-12 xl:col-span-4">
          <div class="ftd-side sticky top-[90px]">
            <div class="text-xs font-semibold tracking-[0.14em] text-[#12D18E] mb-3">FUTURES INVESTMENT</div>
            <div class="text-[22px] font-bold text-[#0F172A] mb-2">{{ t('Order Summary') }}</div>
            <div class="text-[13px] text-[#64748B] mb-5">{{ productInfo.name }} · {{ periodOptions[selectedPeriod]?.label || '' }}</div>
            <div class="ftd-summary">
              <div class="ftd-summary-row"><span>{{ t('Investment Amount') }}</span><span class="font-bold text-[#0F172A]">${{ investAmount ? addCommasToNumber(Number(investAmount)) : '0.00' }}</span></div>
              <div class="ftd-summary-row"><span>{{ t('Return Rate') }}</span><span class="font-bold text-[#12D18E]">{{ periodOptions[selectedPeriod]?.rate || 0 }}%</span></div>
              <div class="ftd-summary-row"><span>{{ t('Expected 7-Day Profit') }}</span><span class="font-bold text-[#0F172A]">${{ addCommasToNumber(expectedProfit) }}</span></div>
              <div class="ftd-summary-row"><span>{{ t('Maturity Date') }}</span><span class="font-semibold text-[#0F172A]">{{ maturityDate }}</span></div>
            </div>
            <button class="ftd-confirm-btn" :disabled="submitLoading || !investAmount || Number(investAmount) <= 0" @click="handleConfirmOrder">
              {{ submitLoading ? 'Loading...' : t('Confirm Order') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <IndexFooter />
  </div>
</template>

<style scoped>
.ftd-page { --ft-green: #12d18e; --ft-green-gradient: linear-gradient(286.17deg, #12d18e 0%, #71e3bb 100%); background: linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%); display: flex; flex-direction: column; min-height: 100vh; }
.ftd-shell { flex: 1 0 auto; width: 100%; }
.ftd-breadcrumb { display: flex; align-items: center; font-size: 14px; color: #6b7280; }
.ftd-back-btn { display: inline-flex; align-items: center; gap: 4px; background: none; border: none; color: #6b7280; font-size: 14px; cursor: pointer; padding: 0; transition: color 0.2s; }
.ftd-back-btn:hover { color: var(--ft-green); }
.ftd-card { background: linear-gradient(180deg, #ffffff, #fafdff); border: 1px solid #dbe4f1; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); }
.ftd-card-header { padding: 20px 28px; border-bottom: 1px solid #e7edf6; }
.ftd-title-wrap { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ftd-title-tag { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; background: #e9fbf4; color: #10b981; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; }
.ftd-card-body { padding: 28px; }
.ftd-period-grid { display: flex; gap: 14px; }
.ftd-period-option { flex: 1; height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; background: #f8fbff; border: 1px solid #dbe4f1; cursor: pointer; transition: all 0.2s; }
.ftd-period-option:hover { border-color: #70e3bb; background: #f0fdf7; }
.ftd-period-option.is-active { background: linear-gradient(140deg, #12d18e, #5fe0b7); border-color: #58ddb2; color: #fff; box-shadow: 0 12px 22px rgba(18, 209, 142, 0.3); }
.ftd-period-rate { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.ftd-period-days { font-size: 13px; }
.ftd-period-option:not(.is-active) .ftd-period-rate { color: #0f172a; }
.ftd-period-option:not(.is-active) .ftd-period-days { color: #64748b; }
.ftd-amount-wrap { display: flex; align-items: center; border: 1px solid #dbe4f1; background: #ffffff; border-radius: 10px; height: 52px; padding: 0 14px; transition: border-color 0.2s, box-shadow 0.2s; }
.ftd-amount-wrap:focus-within { border-color: var(--ft-green); }
.ftd-amount-wrap:focus-within { box-shadow: 0 0 0 3px rgba(18, 209, 142, 0.15); }
.ftd-amount-prefix { font-size: 18px; font-weight: 600; color: #0f172a; margin-right: 8px; }
.ftd-amount-input { flex: 1; border: none; outline: none; font-size: 16px; color: #0f172a; background: transparent; }
.ftd-amount-input::placeholder { color: #94a3b8; }
.ftd-info-list { border: 1px solid #dbe4f1; border-radius: 10px; overflow: hidden; background: #f8fbff; }
.ftd-info-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #e8eef7; }
.ftd-info-row:last-child { border-bottom: none; }
.ftd-info-label { font-size: 14px; color: #64748b; }
.ftd-info-value { font-size: 14px; font-weight: 600; color: #0f172a; }
.ftd-side { border-radius: 14px; border: 1px solid #dbe4f1; background: linear-gradient(180deg, #ffffff, #fafdff); padding: 24px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); }
.ftd-summary { border: 1px solid #dbe4f1; border-radius: 10px; background: #f8fbff; padding: 4px 0; margin-bottom: 20px; }
.ftd-summary-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; font-size: 13px; color: #64748b; }
.ftd-confirm-btn { width: 100%; height: 44px; border: none; border-radius: 8px; background: var(--ft-green-gradient); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s, filter 0.2s; }
.ftd-confirm-btn:hover { filter: brightness(0.98); }
.ftd-confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ftd-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
.ftd-switch input { opacity: 0; width: 0; height: 0; }
.ftd-switch-slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; border-radius: 22px; transition: 0.3s; }
.ftd-switch-slider::before { content: ''; position: absolute; height: 18px; width: 18px; left: 2px; bottom: 2px; background: white; border-radius: 50%; transition: 0.3s; }
.ftd-switch input:checked + .ftd-switch-slider { background: var(--ft-green); }
.ftd-switch input:checked + .ftd-switch-slider::before { transform: translateX(18px); }
@media (max-width: 1279px) { .ftd-period-grid { flex-wrap: wrap; } .ftd-period-option { min-width: 100px; } }
</style>
