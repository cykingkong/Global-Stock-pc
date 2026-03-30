<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import { withdraw, withdraw_info, exchangeRate } from '@/api/billing'
import { bank_list } from '@/api/payment'
import useUserStore from '@/stores/user'
import { addCommasToNumber } from '@/utils/tool'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const bankCards = ref<any[]>([])
const selectedBank = ref<any>(null)
const amount = ref(0)
const amountText = ref('')
const submitting = ref(false)
const bankModalVisible = ref(false)
const exchangeRateData = ref<any>(null)
const withdrawInfo = ref<any>(null)

const currentRate = computed(() => exchangeRateData.value?.usd_to || 0)
const estimatedAmount = computed(() => {
  if (!currentRate.value || !amount.value)
    return '0'

  return addCommasToNumber(amount.value * currentRate.value)
})

const balanceText = computed(() => addCommasToNumber(userStore.userInfo?.balance || 0))

function handleAmountInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9]/g, '')
  amountText.value = input.value
  amount.value = input.value ? Number.parseInt(input.value, 10) : 0
}

async function loadBankCards() {
  try {
    const { data, code } = await bank_list({})
    if (code !== 200)
      return

    const rows = data?.data || []
    bankCards.value = rows.map((item: any) => {
      const address = item.bank_card_address || item.crypto_address || {}
      return {
        ...item,
        bankCode: address.bankCode || '--',
        bankName: address.bankName || '--',
        account: address.receiveAccount || '--',
        name: address.receiveName || '--',
      }
    })

    selectedBank.value = bankCards.value[0] || null

    if (!selectedBank.value)
      Message.warning(t('wallet.noBankCard'))
  }
  catch (error) {
    console.error('Failed to load bank cards:', error)
  }
}

async function loadExchangeRate() {
  try {
    const { data, code } = await exchangeRate({})
    if (code === 200)
      exchangeRateData.value = data
  }
  catch (error) {
    console.error('Failed to load exchange rate:', error)
  }
}

async function loadWithdrawInfo() {
  try {
    const { data, code } = await withdraw_info()
    if (code === 200)
      withdrawInfo.value = data
  }
  catch (error) {
    console.error('Failed to load withdraw info:', error)
  }
}

function selectBankCard(bank: any) {
  selectedBank.value = bank
  bankModalVisible.value = false
}

async function submitWithdraw() {
  if (!selectedBank.value) {
    Message.warning(t('wallet.bankCardRequired'))
    return
  }

  if (!amount.value) {
    Message.warning(t('wallet.amountRequired'))
    return
  }

  try {
    submitting.value = true
    const { code, msg } = await withdraw({
      user_card_id: selectedBank.value.id,
      amount: amount.value,
    })

    if (code === 200) {
      Message.success(t('wallet.withdrawSuccess'))
      router.push('/profile')
      return
    }

    throw new Error(msg || t('wallet.withdrawFailed'))
  }
  catch (error: any) {
    console.error('Withdraw failed:', error)
    Message.error(error?.message || t('wallet.withdrawFailed'))
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  userStore.info()
  loadBankCards()
  loadExchangeRate()
  // loadWithdrawInfo()
})
</script>

<template>
  <div class="wallet-page">
    <Nav />
    <div class="container">
      <div class="hero-card">
        <div>
          <h1 class="page-title">{{ t('wallet.withdrawTitle') }}</h1>
          <div class="breadcrumb">{{ t('Home') }} / {{ t('wallet.withdrawTitle') }}</div>
          <p class="page-subtitle">{{ t('wallet.withdrawSubtitle') }}</p>
        </div>
        <button class="ghost-btn" @click="router.push('/profile')">
          {{ t('wallet.backToProfile') }}
        </button>
      </div>

      <div class="content-card">
        <div class="section-head">
          <h2>{{ t('wallet.withdrawTitle') }}</h2>
          <p>{{ t('wallet.selectBankCard') }}</p>
        </div>

        <div class="bank-card" @click="bankModalVisible = true">
          <div v-if="selectedBank" class="bank-card-content">
            <div>
              <div class="bank-title">{{ selectedBank.bankName }}</div>
              <div class="bank-subtitle">{{ selectedBank.bankCode }}</div>
              <div class="bank-account">{{ selectedBank.account }}</div>
            </div>
            <button class="text-link">{{ t('wallet.changeBankCard') }}</button>
          </div>
          <div v-else class="bank-card-empty">
            <span>{{ t('wallet.noBankCard') }}</span>
            <button class="text-link" @click.stop="router.push('/profile/bankAccount')">{{ t('wallet.addBankCard')
              }}</button>
          </div>
        </div>

        <div class="amount-card">
          <div class="amount-label">{{ t('wallet.enterAmount') }}</div>
          <div class="amount-input-wrap">
            <span class="amount-prefix">$</span>
            <input :value="amountText" type="text" inputmode="numeric" class="amount-input"
              :placeholder="t('wallet.amountPlaceholder')" @input="handleAmountInput">
          </div>
        </div>

        <div class="summary-list">
          <div class="summary-item">
            <span>{{ t('wallet.balance') }}</span>
            <strong>$ {{ balanceText }}</strong>
          </div>
          <div class="summary-item">
            <span>{{ t('wallet.currentExchangeRate') }}</span>
            <strong>$1 = R$ {{ currentRate }}</strong>
          </div>
          <div class="summary-item">
            <span>{{ t('wallet.estimatedReceive') }}</span>
            <strong>R$ {{ estimatedAmount }}</strong>
          </div>
          <div v-if="withdrawInfo?.bank_fee !== undefined" class="summary-item">
            <span>{{ t('wallet.withdrawFee') }}</span>
            <strong>{{ withdrawInfo.bank_fee }}%</strong>
          </div>
        </div>

        <div class="action-row">
          <button class="secondary-btn" @click="router.push('/profile')">{{ t('wallet.back') }}</button>
          <button class="primary-btn" :disabled="submitting || !selectedBank" @click="submitWithdraw">
            {{ submitting ? t('wallet.processing') : t('wallet.withdraw') }}
          </button>
        </div>
      </div>
    </div>

    <a-modal v-model:visible="bankModalVisible" :footer="false" :title="t('wallet.selectBankCard')" width="520px">
      <div class="bank-list">
        <button v-for="bank in bankCards" :key="bank.id" type="button" class="bank-list-item"
          :class="{ active: selectedBank && selectedBank.id === bank.id }" @click="selectBankCard(bank)">
          <div>
            <div class="bank-title">{{ bank.bankName }}</div>
            <div class="bank-subtitle">{{ bank.bankCode }}</div>
            <div class="bank-account">{{ bank.account }}</div>
          </div>
        </button>
      </div>
    </a-modal>
    <IndexFooter />
  </div>
</template>

<style scoped>
.wallet-page {
  background: linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.wallet-page .container { flex: 1; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-card,
.content-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.hero-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.breadcrumb {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 12px;
}

.page-subtitle {
  max-width: 720px;
  font-size: 15px;
  line-height: 1.7;
  color: #475569;
}

.content-card {
  padding: 32px;
}

.section-head {
  margin-bottom: 24px;
}

.section-head h2 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.section-head p {
  font-size: 14px;
  line-height: 1.7;
  color: #64748b;
}

.bank-card,
.amount-card {
  border: 1px solid #dbe2ea;
  border-radius: 18px;
  padding: 20px 24px;
  background: #f8fafc;
  margin-bottom: 20px;
}

.bank-card {
  cursor: pointer;
}

.bank-card-content,
.bank-card-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.bank-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.bank-subtitle,
.bank-account {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.text-link {
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.amount-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}

.amount-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.amount-prefix {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
}

.amount-input {
  flex: 1;
  height: 60px;
  border: none;
  background: transparent;
  font-size: 36px;
  font-weight: 700;
  color: #0f172a;
  outline: none;
}

.amount-input::placeholder {
  color: #94a3b8;
  font-size: 24px;
  font-weight: 500;
}

.summary-list {
  display: grid;
  gap: 14px;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.summary-item strong {
  color: #0f172a;
}

.action-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
}

.primary-btn,
.secondary-btn,
.ghost-btn {
  border: 0;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  transition: .2s;
  cursor: pointer;
}

.primary-btn {
  background: #2563eb;
  color: #fff;
}

.primary-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.primary-btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.secondary-btn,
.ghost-btn {
  background: #e2e8f0;
  color: #334155;
}

.secondary-btn:hover,
.ghost-btn:hover {
  background: #cbd5e1;
}

.bank-list {
  display: grid;
  gap: 12px;
}

.bank-list-item {
  width: 100%;
  text-align: left;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  background: #fff;
  cursor: pointer;
}

.bank-list-item.active {
  border-color: #2563eb;
  background: #eff6ff;
}

@media (max-width: 768px) {
  .container {
    padding: 24px 16px;
  }

  .hero-card,
  .content-card {
    padding: 24px;
  }

  .hero-card {
    flex-direction: column;
  }

  .bank-card-content,
  .bank-card-empty,
  .action-row {
    flex-direction: column;
    align-items: stretch;
  }

  .amount-input {
    font-size: 28px;
  }

  .primary-btn,
  .secondary-btn,
  .ghost-btn {
    width: 100%;
  }
}
</style>
