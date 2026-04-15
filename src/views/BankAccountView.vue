<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import { bank_list, create_bank, userCardUpdate } from '@/api/payment'

const router = useRouter()
const { t } = useI18n()

const bankCards = ref<any[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)

const form = reactive({
  id: '',
  bankCode: '',
  bankName: '',
  CPF: '',
})

function resetForm() {
  form.id = ''
  form.bankCode = ''
  form.bankName = ''
  form.CPF = ''
}

async function loadBankCards() {
  loading.value = true
  try {
    const { data, code } = await bank_list({})
    if (code !== 200) return

    const rows = data?.data || []
    bankCards.value = rows.map((item: any) => {
      const address = item.bank_card_address || item.crypto_address || {}
      return {
        ...item,
        bankCode: address.bankCode || '--',
        bankName: address.bankName || '--',
        account: address.receiveAccount || '--',
        name: address.receiveName || '--',
        CPF: address.CPF || '--',
      }
    })
  } catch (error) {
    console.error('Failed to load bank cards:', error)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  resetForm()
  isEdit.value = false
  modalVisible.value = true
}

function openEditModal(card: any) {
  isEdit.value = true
  form.id = String(card.id || '')
  form.bankCode = card.bankCode === '--' ? '' : card.bankCode
  form.bankName = card.bankName === '--' ? '' : card.bankName
  form.CPF = card.CPF === '--' ? '' : card.CPF
  modalVisible.value = true
}

async function handleSubmit() {
  if (!form.bankCode.trim() || !form.bankName.trim() || !form.CPF.trim()) {
    Message.warning(t('bank.fieldRequired'))
    return
  }

  const params = {
    CPF: form.CPF.trim(),
    bankCode: form.bankCode.trim(),
    bankName: form.bankName.trim(),
    receiveName: '-',
    receiveEmail: '-',
    receivePhone: '-',
    receiveAccount: '-',
  }

  try {
    submitting.value = true

    if (isEdit.value) {
      const { code, msg } = await userCardUpdate({ id: form.id, ...params })
      if (code === 200) {
        Message.success(t('bank.updateSuccess'))
        modalVisible.value = false
        await loadBankCards()
        return
      }
      throw new Error(msg || t('bank.submitFailed'))
    } else {
      const { code, msg } = await create_bank(params)
      if (code === 200) {
        Message.success(t('bank.addSuccess'))
        modalVisible.value = false
        await loadBankCards()
        return
      }
      throw new Error(msg || t('bank.submitFailed'))
    }
  } catch (error: any) {
    console.error('Bank card submit failed:', error)
    Message.error(error?.message || t('bank.submitFailed'))
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadBankCards()
})
</script>

<template>
  <div class="bank-page">
    <Nav />
    <div class="container">
      <div class="hero-card">
        <div>
          <h1 class="page-title">{{ t('bank.title') }}</h1>
          <div class="breadcrumb">{{ t('Home') }} / {{ t('bank.title') }}</div>
          <p class="page-subtitle">{{ t('bank.subtitle') }}</p>
        </div>
        <button class="ghost-btn" @click="router.push('/profile')">
          {{ t('bank.backToProfile') }}
        </button>
      </div>

      <div class="content-card">
        <div class="section-head">
          <h2>{{ t('bank.title') }}</h2>
        </div>

        <div v-if="loading" class="empty-state">Loading...</div>

        <div v-else-if="bankCards.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
            <rect x="2" y="5" width="20" height="14" rx="3"/>
            <path d="M2 10h20"/>
          </svg>
          <span>{{ t('bank.noCards') }}</span>
        </div>

        <div v-else class="card-list">
          <div
            v-for="card in bankCards"
            :key="card.id"
            class="bank-card-item"
          >
            <div class="bank-card-icon">
              <svg width="24" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.9 8V5C17.9 4.73478 17.7947 4.48043 17.6071 4.29289C17.4196 4.10536 17.1652 4 16.9 4H6.90002C6.36959 4 5.86088 4.21071 5.48581 4.58579C5.11074 4.96086 4.90002 5.46957 4.90002 6M4.90002 6C4.90002 6.53043 5.11074 7.03914 5.48581 7.41421C5.86088 7.78929 6.36959 8 6.90002 8H18.9C19.1652 8 19.4196 8.10536 19.6071 8.29289C19.7947 8.48043 19.9 8.73478 19.9 9V12M4.90002 6V18C4.90002 18.5304 5.11074 19.0391 5.48581 19.4142C5.86088 19.7893 6.36959 20 6.90002 20H18.9C19.1652 20 19.4196 19.8946 19.6071 19.7071C19.7947 19.5196 19.9 19.2652 19.9 19V16" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.9 12V16H16.9C16.3696 16 15.8609 15.7893 15.4858 15.4142C15.1107 15.0391 14.9 14.5304 14.9 14C14.9 13.4696 15.1107 12.9609 15.4858 12.5858C15.8609 12.2107 16.3696 12 16.9 12H20.9Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="bank-card-info">
              <div class="bank-card-name">{{ card.bankName }}</div>
              <div class="bank-card-code">{{ card.bankCode }}</div>
            </div>
            <button class="edit-btn" @click="openEditModal(card)">{{ t('bank.edit') }}</button>
          </div>
        </div>

        <div class="action-row">
          <button class="secondary-btn" @click="router.push('/profile')">{{ t('bank.backToProfile') }}</button>
          <button class="primary-btn" @click="openAddModal">{{ t('bank.addBankCard') }}</button>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="isEdit ? t('bank.editBankCard') : t('bank.addBankCard')"
      :footer="false"
      width="520px"
      :mask-closable="false"
    >
      <div class="form-body">
        <label class="field-item">
          <span class="field-label">{{ t('bank.bankAccountNumber') }}</span>
          <input v-model="form.bankCode" type="text" class="field-input" :placeholder="t('bank.bankAccountNumberPlaceholder')">
        </label>
        <label class="field-item">
          <span class="field-label">{{ t('bank.bankAccountName') }}</span>
          <input v-model="form.bankName" type="text" class="field-input" :placeholder="t('bank.bankAccountNamePlaceholder')">
        </label>
        <label class="field-item">
          <span class="field-label">{{ t('bank.cpf') }}</span>
          <input v-model="form.CPF" type="text" class="field-input" :placeholder="t('bank.cpfPlaceholder')">
        </label>
        <div class="modal-actions">
          <button class="secondary-btn" @click="modalVisible = false">{{ t('bank.cancel') }}</button>
          <button class="primary-btn" :disabled="submitting" @click="handleSubmit">
            {{ submitting ? t('bank.submitting') : t('bank.submit') }}
          </button>
        </div>
      </div>
    </a-modal>

    <IndexFooter />
  </div>
</template>

<style scoped>
.bank-page { background: var(--wise-page); min-height: 100vh; display: flex; flex-direction: column; color: var(--wise-text); }
.bank-page .container { flex: 1; }
.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.hero-card, .content-card { background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 40px; box-shadow: 0 0 0 1px var(--wise-border); }
.hero-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 28px 32px; margin-bottom: 24px; }
.page-title { font-size: 56px; line-height: 0.9; font-weight: 900; letter-spacing: -0.05em; color: var(--wise-text); margin-bottom: 10px; }
.breadcrumb { font-size: 12px; color: var(--wise-muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.page-subtitle { max-width: 720px; font-size: 15px; line-height: 1.7; color: var(--wise-muted); }
.content-card { padding: 32px; }
.section-head { margin-bottom: 24px; }
.section-head h2 { font-size: 32px; line-height: 0.95; font-weight: 900; letter-spacing: -0.04em; color: var(--wise-text); }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0; color: var(--wise-muted); font-size: 15px; }
.card-list { display: grid; gap: 12px; }
.bank-card-item { display: flex; align-items: center; gap: 16px; padding: 20px 24px; border: 1px solid var(--wise-border); border-radius: 30px; background: var(--wise-page); transition: border-color .2s, background .2s; }
.bank-card-item:hover { border-color: var(--wise-accent); background: var(--wise-hover); }
.bank-card-icon { width: 48px; height: 48px; border-radius: 50%; background: var(--wise-accent); color: var(--wise-accent-foreground); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bank-card-info { flex: 1; }
.bank-card-name { font-size: 18px; font-weight: 900; letter-spacing: -0.03em; color: var(--wise-text); }
.bank-card-code { font-size: 13px; color: var(--wise-muted); margin-top: 2px; }
.edit-btn { border: 1px solid var(--wise-border); background: var(--wise-surface); color: var(--wise-accent-foreground); font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 9999px; cursor: pointer; transition: .2s; }
.edit-btn:hover { background: var(--wise-hover); transform: scale(1.05); }
.action-row, .modal-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; }
.primary-btn, .secondary-btn, .ghost-btn { border: 0; border-radius: 9999px; padding: 12px 20px; font-size: 14px; font-weight: 700; transition: .2s; cursor: pointer; }
.primary-btn { background: var(--wise-accent); color: var(--wise-accent-foreground); }
.primary-btn:hover:not(:disabled) { transform: scale(1.05); }
.primary-btn:disabled { opacity: .55; cursor: not-allowed; }
.secondary-btn, .ghost-btn { background: rgba(22, 51, 0, 0.08); color: var(--wise-text); }
.secondary-btn:hover, .ghost-btn:hover { background: var(--wise-hover); }
.form-body { display: grid; gap: 18px; }
.field-item { display: flex; flex-direction: column; gap: 8px; }
.field-label { font-size: 14px; font-weight: 700; color: var(--wise-text); }
.field-input { width: 100%; height: 52px; border-radius: 20px; border: 1px solid var(--wise-border); padding: 0 16px; font-size: 14px; color: var(--wise-text); background: var(--wise-surface); }
.field-input:focus { border-color: var(--wise-accent); outline: none; box-shadow: 0 0 0 1px var(--wise-border); }
@media (max-width: 768px) {
  .container { padding: 24px 16px; }
  .hero-card, .content-card { padding: 24px; }
  .hero-card { flex-direction: column; }
  .action-row, .modal-actions { flex-direction: column; }
  .primary-btn, .secondary-btn, .ghost-btn { width: 100%; }
  .page-title { font-size: 40px; }
}
</style>
