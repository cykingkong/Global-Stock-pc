<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message, Modal } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import { deposit, exchangeRate, putCertificate } from '@/api/billing'
import { uploadFile } from '@/api/tool'
import { addCommasToNumber } from '@/utils/tool'

const router = useRouter()
const { t } = useI18n()

const amount = ref(0)
const amountText = ref('')
const submitting = ref(false)
const exchangeRateData = ref<any>(null)

// deposit-bank modal state
const showBankModal = ref(false)
const depositInfo = ref<any>(null)
const uploading = ref(false)
const uploadedImageUrl = ref('')
const previewUrl = ref('')
const certSubmitting = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const paymentAmount = computed(() => {
  if (!exchangeRateData.value?.usd_to || amount.value === 0)
    return '0'
  return addCommasToNumber(amount.value * exchangeRateData.value.usd_to)
})

const cardFields = computed(() => {
  if (!depositInfo.value?.card_json) return []
  const c = depositInfo.value.card_json
  return [
    { label: 'CPF', value: c.CPF || '-' },
    { label: 'ReceiveName', value: c.receiveName || '-' },
    { label: 'ReceiveEmail', value: c.receiveEmail || '-' },
    { label: 'ReceivePhone', value: c.receivePhone || '-' },
    { label: 'ReceiveAccount', value: c.receiveAccount || '-' },
  ].filter(f => f.value && f.value !== '-')
})

function handleAmountInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9]/g, '')
  amountText.value = input.value
  amount.value = input.value ? Number.parseInt(input.value, 10) : 0
}

async function loadExchangeRate() {
  try {
    const { data, code } = await exchangeRate({})
    if (code === 200) exchangeRateData.value = data
  } catch (error) {
    console.error('Failed to load exchange rate:', error)
  }
}

function handleCopy(text: string) {
  if (!text || text === '-') return
  navigator.clipboard.writeText(text).then(() => {
    Message.success(t('wallet.copiedSuccessfully'))
  }).catch(() => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    Message.success(t('wallet.copiedSuccessfully'))
  })
}

async function submitDeposit() {
  if (!amount.value) {
    Message.warning(t('wallet.amountRequired'))
    return
  }

  try {
    submitting.value = true
    const { data, code, msg } = await deposit({ amount: amount.value })

    if (code === 200) {
      depositInfo.value = data
      showBankModal.value = true
      uploadedImageUrl.value = ''
      previewUrl.value = ''
      return
    }

    throw new Error(msg || t('wallet.depositFailed'))
  } catch (error: any) {
    console.error('Deposit failed:', error)
    Message.error(error?.message || t('wallet.depositFailed'))
  } finally {
    submitting.value = false
  }
}

function openFilePicker() {
  fileInputRef.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    Message.warning(t('wallet.pleaseUploadImage'))
    input.value = ''
    return
  }

  previewUrl.value = URL.createObjectURL(file)
  uploadedImageUrl.value = ''

  try {
    uploading.value = true
    const formData = new FormData()
    formData.append('image', file)
    const { data, code } = await uploadFile(formData)

    if (code === 200 && data?.url) {
      uploadedImageUrl.value = data.url
      Message.success(t('wallet.uploadSuccess'))
      return
    }
    throw new Error('upload failed')
  } catch (error: any) {
    uploadedImageUrl.value = ''
    Message.error(error?.message || t('wallet.uploadFailed'))
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function submitCertificate() {
  if (!uploadedImageUrl.value) {
    Message.warning(t('wallet.pleaseUploadProof'))
    return
  }

  try {
    certSubmitting.value = true
    const { code, msg } = await putCertificate({
      id: depositInfo.value.id,
      image_url: uploadedImageUrl.value,
    })

    if (code === 200) {
      showBankModal.value = false
      Modal.success({
        title: t('wallet.depositSuccessTitle'),
        content: t('wallet.depositSuccessContent'),
        okText: t('wallet.confirm'),
        cancelText: t('wallet.stayHere'),
        hideCancel: false,
        onOk: () => router.push('/profile'),
      })
      return
    }

    throw new Error(msg || t('wallet.submitFailed'))
  } catch (error: any) {
    console.error('putCertificate failed:', error)
    Message.error(error?.message || t('wallet.submitFailed'))
  } finally {
    certSubmitting.value = false
  }
}

onMounted(() => {
  loadExchangeRate()
})
</script>

<template>
  <div class="wallet-page">
    <Nav />
    <div class="container">
      <div class="hero-card">
        <div>
          <h1 class="page-title">{{ t('wallet.depositTitle') }}</h1>
          <div class="breadcrumb">{{ t('Home') }} / {{ t('wallet.depositTitle') }}</div>
          <p class="page-subtitle">{{ t('wallet.depositSubtitle') }}</p>
        </div>
        <button class="ghost-btn" @click="router.push('/profile')">
          {{ t('wallet.backToProfile') }}
        </button>
      </div>

      <div class="content-card">
        <div class="section-head">
          <h2>{{ t('wallet.depositTitle') }}</h2>
          <p>{{ t('wallet.enterAmount') }}</p>
        </div>

        <div class="amount-card">
          <div class="amount-label">{{ t('wallet.enterAmount') }}</div>
          <div class="amount-input-wrap">
            <span class="amount-prefix">$</span>
            <input
              :value="amountText"
              type="text"
              inputmode="numeric"
              class="amount-input"
              :placeholder="t('wallet.amountPlaceholder')"
              @input="handleAmountInput"
            >
          </div>
        </div>

        <div class="summary-list">
          <div class="summary-item">
            <span>{{ t('wallet.balanceReceive') }}</span>
            <strong>{{ amount }} USD</strong>
          </div>
          <div class="summary-item">
            <span>{{ t('wallet.needToPay') }}</span>
            <strong>R$ {{ paymentAmount }}</strong>
          </div>
          <div class="summary-item">
            <span>{{ t('wallet.paymentMethod') }}</span>
            <strong class="success-text">{{ t('wallet.brlPay') }}</strong>
          </div>
        </div>

        <div class="action-row">
          <button class="secondary-btn" @click="router.push('/profile')">{{ t('wallet.backToProfile') }}</button>
          <button class="primary-btn" :disabled="submitting" @click="submitDeposit">
            {{ submitting ? t('wallet.processing') : t('wallet.deposit') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Deposit Bank Info + Upload Modal -->
    <a-modal v-model:visible="showBankModal" :footer="false" :title="t('wallet.bankTransferInfo')" width="640px" :mask-closable="false">
      <div class="modal-body">
        <div class="bank-info-section">
          <div class="bank-info-header">
            <div class="bank-info-title">{{ t('wallet.waitingForFunds') }}</div>
            <p class="bank-info-hint">{{ t('wallet.copyBankHint') }}</p>
          </div>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">{{ t('wallet.amount') }}</span>
              <div class="info-value-wrap">
                <span>$ {{ depositInfo?.amount || '0' }}</span>
                <button class="copy-btn" @click="handleCopy(String(depositInfo?.amount || ''))">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
            </div>
            <div class="info-row">
              <span class="info-label">{{ t('wallet.amountExchanged') }}</span>
              <div class="info-value-wrap">
                <span>R$ {{ depositInfo?.amount_exchanged || '0' }}</span>
                <button class="copy-btn" @click="handleCopy(String(depositInfo?.amount_exchanged || ''))">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
            </div>
            <div v-for="(field, idx) in cardFields" :key="idx" class="info-row">
              <span class="info-label">{{ field.label }}</span>
              <div class="info-value-wrap">
                <span>{{ field.value }}</span>
                <button class="copy-btn" @click="handleCopy(field.value)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="upload-section">
          <div class="upload-title">{{ t('wallet.uploadProofTitle') }}</div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="handleFileChange"
          />

          <div class="upload-area" @click="openFilePicker">
            <div v-if="previewUrl" class="upload-preview">
              <img :src="previewUrl" alt="proof" class="upload-preview-img">
            </div>
            <div v-else class="upload-placeholder-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span class="upload-placeholder-text">{{ t('wallet.clickToUpload') }}</span>
            </div>
          </div>

          <div v-if="previewUrl" class="upload-change">
            <button class="text-link" :disabled="uploading" @click="openFilePicker">
              {{ uploading ? t('wallet.uploading') : t('wallet.changeImage') }}
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button class="secondary-btn" @click="showBankModal = false">{{ t('wallet.payLater') }}</button>
          <button class="primary-btn" :disabled="certSubmitting || !uploadedImageUrl" @click="submitCertificate">
            {{ certSubmitting ? t('wallet.processing') : t('wallet.confirmSubmit') }}
          </button>
        </div>
      </div>
    </a-modal>

    <IndexFooter />
  </div>
</template>

<style scoped>
.wallet-page { background: linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%); min-height: 100vh; display: flex; flex-direction: column; }
.wallet-page .container { flex: 1; }
.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.hero-card, .content-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04); }
.hero-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 28px 32px; margin-bottom: 24px; }
.page-title { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
.breadcrumb { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.page-subtitle { max-width: 720px; font-size: 15px; line-height: 1.7; color: #475569; }
.content-card { padding: 32px; }
.section-head { margin-bottom: 24px; }
.section-head h2 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
.section-head p { font-size: 14px; line-height: 1.7; color: #64748b; }
.amount-card { border: 1px solid #dbe2ea; border-radius: 18px; padding: 24px; background: #f8fafc; margin-bottom: 24px; }
.amount-label { font-size: 13px; color: #64748b; margin-bottom: 12px; }
.amount-input-wrap { display: flex; align-items: center; gap: 12px; }
.amount-prefix { font-size: 32px; font-weight: 700; color: #0f172a; }
.amount-input { flex: 1; height: 60px; border: none; background: transparent; font-size: 36px; font-weight: 700; color: #0f172a; outline: none; }
.amount-input::placeholder { color: #94a3b8; font-size: 24px; font-weight: 500; }
.summary-list { display: grid; gap: 14px; }
.summary-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; }
.summary-item strong { color: #0f172a; }
.success-text { color: #16a34a !important; }
.action-row, .modal-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; }
.primary-btn, .secondary-btn, .ghost-btn { border: 0; border-radius: 12px; padding: 12px 20px; font-size: 14px; font-weight: 600; transition: .2s; cursor: pointer; }
.primary-btn { background: #2563eb; color: #fff; }
.primary-btn:hover:not(:disabled) { background: #1d4ed8; }
.primary-btn:disabled { opacity: .55; cursor: not-allowed; }
.secondary-btn, .ghost-btn { background: #e2e8f0; color: #334155; }
.secondary-btn:hover, .ghost-btn:hover { background: #cbd5e1; }

/* Modal content */
.modal-body { padding: 8px 0; }
.bank-info-section { margin-bottom: 24px; }
.bank-info-header { margin-bottom: 16px; }
.bank-info-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.bank-info-hint { font-size: 13px; color: #64748b; line-height: 1.6; }
.info-grid { display: grid; gap: 10px; }
.info-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
.info-label { font-size: 13px; color: #64748b; flex-shrink: 0; }
.info-value-wrap { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #0f172a; }
.copy-btn { border: none; background: transparent; color: #2563eb; cursor: pointer; padding: 2px; display: inline-flex; }
.copy-btn:hover { color: #1d4ed8; }

.upload-section { margin-bottom: 8px; }
.upload-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
.hidden-input { display: none; }
.upload-area { border: 1px dashed #cbd5e1; border-radius: 16px; padding: 16px; background: #f8fafc; cursor: pointer; min-height: 160px; display: flex; align-items: center; justify-content: center; }
.upload-preview { width: 100%; }
.upload-preview-img { display: block; width: 100%; max-height: 260px; object-fit: contain; border-radius: 12px; }
.upload-placeholder-box { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.upload-placeholder-text { font-size: 14px; color: #64748b; }
.upload-change { text-align: center; margin-top: 10px; }
.text-link { border: none; background: transparent; color: #2563eb; font-size: 14px; font-weight: 600; cursor: pointer; }

@media (max-width: 768px) {
  .container { padding: 24px 16px; }
  .hero-card, .content-card { padding: 24px; }
  .hero-card { flex-direction: column; }
  .amount-input { font-size: 28px; }
  .action-row, .modal-actions { flex-direction: column; }
  .primary-btn, .secondary-btn, .ghost-btn { width: 100%; }
}
</style>
