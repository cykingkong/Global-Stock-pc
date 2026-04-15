<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import { uploadFile } from '@/api/tool'
import { kycSubmit } from '@/api/user'
import useUserStore from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const step = ref(1)
const uploading = ref(false)
const submitting = ref(false)
const realName = ref('')
const idCard = ref('')
const previewUrl = ref('')
const uploadedImageUrl = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const canContinue = computed(() => !!uploadedImageUrl.value && !uploading.value)
const canSubmit = computed(() => !!uploadedImageUrl.value && !!realName.value.trim() && !!idCard.value.trim() && !submitting.value)

function openFilePicker() {
  fileInputRef.value?.click()
}

function handleBackStep() {
  if (step.value === 1) {
    router.push('/profile')
    return
  }
  step.value = 1
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file)
    return

  if (!file.type.startsWith('image/')) {
    Message.warning(t('kyc.uploadRequired'))
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
      Message.success(t('kyc.uploadSuccess'))
      return
    }

    throw new Error('upload failed')
  }
  catch (error: any) {
    console.error('KYC image upload failed:', error)
    uploadedImageUrl.value = ''
    Message.error(error?.message || t('kyc.uploadFailed'))
  }
  finally {
    uploading.value = false
    input.value = ''
  }
}

function goNextStep() {
  if (!uploadedImageUrl.value) {
    Message.warning(t('kyc.uploadRequired'))
    return
  }

  step.value = 2
}

async function submitKyc() {
  if (!uploadedImageUrl.value) {
    Message.warning(t('kyc.uploadRequired'))
    step.value = 1
    return
  }

  if (!realName.value.trim()) {
    Message.warning(t('kyc.fullNameRequired'))
    return
  }

  if (!idCard.value.trim()) {
    Message.warning(t('kyc.idCardRequired'))
    return
  }

  try {
    submitting.value = true
    const { code, msg } = await kycSubmit({
      real_name: realName.value.trim(),
      id_card: idCard.value.trim(),
      id_card_front: uploadedImageUrl.value,
    })

    if (code === 200) {
      Message.success(t('kyc.submitSuccess'))
      await userStore.info()
      router.push('/profile')
      return
    }

    throw new Error(msg || t('kyc.submitFailed'))
  }
  catch (error: any) {
    console.error('KYC submit failed:', error)
    Message.error(error?.message || t('kyc.submitFailed'))
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="kyc-page">
    <Nav />
    <div class="container">
      <div class="hero-card">
        <div>
          <h1 class="page-title">{{ t('kyc.title') }}</h1>
          <div class="breadcrumb">{{ t('Home') }} / {{ t('kyc.title') }}</div>
          <p class="page-subtitle">{{ t('kyc.subtitle') }}</p>
        </div>
        <button class="ghost-btn" @click="router.push('/profile')">
          {{ t('kyc.backToProfile') }}
        </button>
      </div>

      <div class="steps-card">
        <div class="steps-row">
          <div :class="['step-item', step >= 1 ? 'active' : '']">
            <span class="step-index">1</span>
            <span>{{ t('kyc.stepUpload') }}</span>
          </div>
          <div class="step-line" />
          <div :class="['step-item', step >= 2 ? 'active' : '']">
            <span class="step-index">2</span>
            <span>{{ t('kyc.stepDetails') }}</span>
          </div>
        </div>
      </div>

      <div class="content-card">
        <template v-if="step === 1">
          <div class="section-head">
            <h2>{{ t('kyc.uploadLabel') }}</h2>
            <p>{{ t('kyc.uploadHint') }}</p>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="handleFileChange"
          />

          <div class="upload-panel">
            <div v-if="previewUrl" class="preview-box">
              <img :src="previewUrl" alt="KYC preview" class="preview-image">
            </div>
            <div v-else class="upload-placeholder">
              <div class="upload-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="10" width="32" height="28" rx="4" stroke="#2563EB" stroke-width="2.5"/>
                  <path d="M17 20H31" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
                  <path d="M17 26H27" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="32" cy="29" r="4" fill="#93C5FD"/>
                </svg>
              </div>
              <div class="upload-text">{{ t('kyc.uploadLabel') }}</div>
            </div>

            <div class="upload-actions">
              <button class="primary-btn" :disabled="uploading" @click="openFilePicker">
                {{ uploading ? t('kyc.uploading') : (previewUrl ? t('kyc.changeImage') : t('kyc.uploadButton')) }}
              </button>
            </div>
          </div>

          <div class="action-row">
            <button class="secondary-btn" @click="router.push('/profile')">{{ t('kyc.backToProfile') }}</button>
            <button class="primary-btn" :disabled="!canContinue" @click="goNextStep">{{ t('kyc.continue') }}</button>
          </div>
        </template>

        <template v-else>
          <div class="section-head">
            <h2>{{ t('kyc.stepDetails') }}</h2>
            <p>{{ t('kyc.detailsHint') }}</p>
          </div>

          <div class="form-grid">
            <label class="field-item">
              <span class="field-label">{{ t('kyc.fullName') }}</span>
              <input v-model="realName" type="text" class="field-input" :placeholder="t('kyc.fullNamePlaceholder')">
            </label>

            <label class="field-item">
              <span class="field-label">{{ t('kyc.idCardNumber') }}</span>
              <input v-model="idCard" type="text" class="field-input" :placeholder="t('kyc.idCardPlaceholder')">
            </label>
          </div>

          <div class="action-row">
            <button class="secondary-btn" @click="handleBackStep">{{ t('kyc.back') }}</button>
            <button class="primary-btn" :disabled="!canSubmit" @click="submitKyc">
              {{ submitting ? t('kyc.submitting') : t('kyc.submit') }}
            </button>
          </div>
        </template>
      </div>
    </div>
    <IndexFooter />
  </div>
</template>

<style scoped>
.kyc-page { background: var(--wise-page); min-height: 100vh; display: flex; flex-direction: column; color: var(--wise-text); }
.kyc-page .container { flex: 1; }
.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.hero-card, .steps-card, .content-card { background: var(--wise-surface); border: 1px solid var(--wise-border); border-radius: 40px; box-shadow: 0 0 0 1px var(--wise-border); }
.hero-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 28px 32px; margin-bottom: 24px; }
.page-title { font-size: 56px; line-height: 0.9; font-weight: 900; letter-spacing: -0.05em; color: var(--wise-text); margin-bottom: 10px; }
.breadcrumb { font-size: 12px; color: var(--wise-muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.page-subtitle { max-width: 720px; font-size: 15px; line-height: 1.7; color: var(--wise-muted); }
.steps-card { padding: 24px 32px; margin-bottom: 24px; }
.steps-row { display: flex; align-items: center; gap: 16px; }
.step-item { display: flex; align-items: center; gap: 12px; color: var(--wise-muted); font-weight: 700; }
.step-item.active { color: var(--wise-accent-foreground); }
.step-index { width: 36px; height: 36px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: var(--wise-page); color: var(--wise-muted); box-shadow: 0 0 0 1px var(--wise-border); }
.step-item.active .step-index { background: var(--wise-accent); color: var(--wise-accent-foreground); }
.step-line { flex: 1; height: 1px; background: var(--wise-border); }
.content-card { padding: 32px; }
.section-head { margin-bottom: 24px; }
.section-head h2 { font-size: 32px; line-height: 0.95; font-weight: 900; letter-spacing: -0.04em; color: var(--wise-text); margin-bottom: 10px; }
.section-head p { font-size: 14px; line-height: 1.7; color: var(--wise-muted); }
.hidden-input { display: none; }
.upload-panel { border: 1px dashed var(--wise-border); border-radius: 30px; padding: 24px; background: var(--wise-page); }
.upload-placeholder, .preview-box { min-height: 320px; display: flex; align-items: center; justify-content: center; border-radius: 30px; background: var(--wise-surface); overflow: hidden; box-shadow: 0 0 0 1px var(--wise-border); }
.upload-placeholder { flex-direction: column; gap: 12px; border: 1px dashed var(--wise-border); }
.upload-icon { font-size: 48px; }
.upload-text { font-size: 16px; font-weight: 700; color: var(--wise-text); }
.preview-image { display: block; width: 100%; max-height: 420px; object-fit: contain; background: var(--wise-surface); }
.upload-actions { display: flex; justify-content: center; margin-top: 20px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.field-item { display: flex; flex-direction: column; gap: 10px; }
.field-label { font-size: 14px; font-weight: 700; color: var(--wise-text); }
.field-input { width: 100%; height: 56px; border-radius: 20px; border: 1px solid var(--wise-border); padding: 0 16px; font-size: 14px; color: var(--wise-text); background: var(--wise-surface); }
.field-input:focus { border-color: var(--wise-accent); outline: none; box-shadow: 0 0 0 1px var(--wise-border); }
.action-row { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; }
.primary-btn, .secondary-btn, .ghost-btn { border: 0; border-radius: 9999px; padding: 12px 20px; font-size: 14px; font-weight: 700; transition: .2s; cursor: pointer; }
.primary-btn { background: var(--wise-accent); color: var(--wise-accent-foreground); }
.primary-btn:hover:not(:disabled) { transform: scale(1.05); }
.primary-btn:disabled { opacity: .55; cursor: not-allowed; }
.secondary-btn, .ghost-btn { background: rgba(22, 51, 0, 0.08); color: var(--wise-text); }
.secondary-btn:hover, .ghost-btn:hover { background: var(--wise-hover); }
@media (max-width: 768px) {
  .container { padding: 24px 16px; }
  .hero-card { flex-direction: column; padding: 24px; }
  .content-card, .steps-card { padding: 24px; }
  .form-grid { grid-template-columns: 1fr; }
  .action-row { flex-direction: column; }
  .primary-btn, .secondary-btn, .ghost-btn { width: 100%; }
  .page-title { font-size: 40px; }
}
</style>
