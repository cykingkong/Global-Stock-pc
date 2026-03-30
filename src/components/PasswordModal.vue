<script setup lang="ts">
import { reactive, ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import { sendCode, resetPassword } from '@/api/user'
import countryData from '@/assets/json/area.json'

const props = defineProps<{
  visible: boolean
  mode: 'forgot' | 'change'
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'success'): void
}>()

const { t } = useI18n()
const countryList = ref(countryData)

const verifyType = ref<'phone' | 'email'>('phone')
const submitting = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const form = reactive({
  countryCode: '1',
  phone: '',
  email: '',
  password: '',
  captcha: '',
})

const modalTitle = ref('')
watch(() => props.visible, (val) => {
  if (val) {
    modalTitle.value = props.mode === 'forgot' ? t('password.forgotTitle') : t('password.changeTitle')
    resetForm()
  }
})

function resetForm() {
  form.countryCode = '1'
  form.phone = ''
  form.email = ''
  form.password = ''
  form.captcha = ''
  verifyType.value = 'phone'
  countdown.value = 0
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function closeModal() {
  emit('update:visible', false)
}

function getAccount() {
  if (verifyType.value === 'phone')
    return `${form.countryCode}${form.phone}`
  return form.email
}

async function handleSendCode() {
  if (verifyType.value === 'phone' && !form.phone.trim()) {
    Message.warning(t('password.accountRequired'))
    return
  }
  if (verifyType.value === 'email' && !form.email.trim()) {
    Message.warning(t('password.accountRequired'))
    return
  }

  try {
    sendingCode.value = true
    const { code } = await sendCode({
      type: verifyType.value,
      account: getAccount(),
    })

    if (code === 200) {
      Message.success(t('password.sendCodeSuccess'))
      countdown.value = 60
      countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0 && countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }, 1000)
    }
  } catch (error: any) {
    Message.error(error?.message || t('password.submitFailed'))
  } finally {
    sendingCode.value = false
  }
}

async function handleSubmit() {
  if (verifyType.value === 'phone' && !form.phone.trim()) {
    Message.warning(t('password.accountRequired'))
    return
  }
  if (verifyType.value === 'email' && !form.email.trim()) {
    Message.warning(t('password.accountRequired'))
    return
  }
  if (!form.password.trim()) {
    Message.warning(t('password.passwordRequired'))
    return
  }
  if (!form.captcha.trim()) {
    Message.warning(t('password.codeRequired'))
    return
  }

  try {
    submitting.value = true
    const { code, msg } = await resetPassword({
      type: verifyType.value,
      account: getAccount(),
      password: form.password.trim(),
      code: form.captcha.trim(),
    })

    if (code === 200) {
      Message.success(t('password.resetSuccess'))
      closeModal()
      emit('success')
      return
    }

    throw new Error(msg || t('password.submitFailed'))
  } catch (error: any) {
    Message.error(error?.message || t('password.submitFailed'))
  } finally {
    submitting.value = false
  }
}

const filterCountry = (inputValue: string, option: any) => {
  const country = countryList.value.find((c: any) => c.dialCode === option.value)
  if (!country) return false
  const search = inputValue.toLowerCase()
  return country.name.toLowerCase().includes(search) || `+${country.dialCode}`.includes(search)
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<template>
  <a-modal :visible="visible" :title="modalTitle" :footer="false" width="480px" :mask-closable="false" @cancel="closeModal">
    <div class="pwd-modal-body">
      <!-- Tab: phone / email -->
      <div class="tab-row">
        <button :class="['tab-btn', verifyType === 'phone' ? 'active' : '']" @click="verifyType = 'phone'">
          {{ t('password.phone') }}
        </button>
        <button :class="['tab-btn', verifyType === 'email' ? 'active' : '']" @click="verifyType = 'email'">
          {{ t('password.email') }}
        </button>
      </div>

      <!-- Phone mode -->
      <div v-if="verifyType === 'phone'" class="field-item">
        <span class="field-label">{{ t('password.phoneLabel') }}</span>
        <div class="phone-row">
          <a-select
            v-model="form.countryCode"
            :filter-option="filterCountry"
            allow-search
            class="country-select"
            style="width: 130px"
          >
            <a-option
              v-for="c in countryList"
              :key="c.code"
              :value="c.dialCode"
              :label="`+${c.dialCode}`"
            >
              <div class="flex items-center justify-between">
                <span>{{ c.name }}</span>
                <span class="text-gray-400 ml-2">+{{ c.dialCode }}</span>
              </div>
            </a-option>
          </a-select>
          <input v-model="form.phone" type="tel" class="field-input flex-1" :placeholder="t('password.phonePlaceholder')">
        </div>
      </div>

      <!-- Email mode -->
      <div v-else class="field-item">
        <span class="field-label">{{ t('password.emailLabel') }}</span>
        <input v-model="form.email" type="email" class="field-input" :placeholder="t('password.emailPlaceholder')">
      </div>

      <!-- New password -->
      <div class="field-item">
        <span class="field-label">{{ t('password.newPassword') }}</span>
        <input v-model="form.password" type="password" class="field-input" :placeholder="t('password.newPasswordPlaceholder')">
      </div>

      <!-- Verification code -->
      <div class="field-item">
        <span class="field-label">{{ t('password.verificationCode') }}</span>
        <div class="code-row">
          <input v-model="form.captcha" type="text" class="field-input flex-1" :placeholder="t('password.codePlaceholder')">
          <button
            class="send-code-btn"
            :disabled="sendingCode || countdown > 0"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : t('password.sendCode') }}
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="secondary-btn" @click="closeModal">{{ t('password.cancel') }}</button>
        <button class="primary-btn" :disabled="submitting" @click="handleSubmit">
          {{ submitting ? t('password.submitting') : t('password.submit') }}
        </button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.pwd-modal-body { display: grid; gap: 16px; padding: 4px 0; }
.tab-row { display: flex; gap: 8px; margin-bottom: 4px; }
.tab-btn { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; transition: .2s; }
.tab-btn.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
.field-item { display: flex; flex-direction: column; gap: 8px; }
.field-label { font-size: 13px; font-weight: 600; color: #0f172a; }
.field-input { height: 44px; border-radius: 10px; border: 1px solid #dbe2ea; padding: 0 14px; font-size: 14px; color: #0f172a; background: #fff; }
.field-input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
.phone-row, .code-row { display: flex; gap: 8px; }
.send-code-btn { white-space: nowrap; padding: 0 16px; height: 44px; border: 1px solid #dbe2ea; border-radius: 10px; background: #fff; color: #2563eb; font-size: 13px; font-weight: 600; cursor: pointer; transition: .2s; }
.send-code-btn:hover:not(:disabled) { background: #eff6ff; }
.send-code-btn:disabled { opacity: .5; cursor: not-allowed; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.primary-btn, .secondary-btn { border: 0; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: .2s; }
.primary-btn { background: #2563eb; color: #fff; }
.primary-btn:hover:not(:disabled) { background: #1d4ed8; }
.primary-btn:disabled { opacity: .55; cursor: not-allowed; }
.secondary-btn { background: #e2e8f0; color: #334155; }
.secondary-btn:hover { background: #cbd5e1; }
</style>
