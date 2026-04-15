<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  show: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  titleKey: { type: String, default: 'affund.joinThisRound' },
  titleColor: { type: String, default: '#12D18E' },
  confirmTextKey: { type: String, default: 'affund.joinNow' },
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])
const { t } = useI18n()

function addCommas(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const amount = ref('')
const displayValue = ref('')

function handleClose() {
  emit('update:show', false)
  emit('cancel')
  setTimeout(() => {
    amount.value = ''
    displayValue.value = ''
  }, 300)
}

function handleConfirm() {
  if (!amount.value || Number(amount.value) <= 0) return
  emit('confirm', Number(amount.value))
  handleClose()
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) handleClose()
}

watch(displayValue, (newVal) => {
  const filtered = newVal.replace(/[^\d.]/g, '')
  const parts = filtered.split('.')
  if (parts.length > 2) {
    displayValue.value = parts[0] + '.' + parts.slice(1).join('')
    return
  }
  if (parts.length === 2 && parts[1].length > 2) {
    displayValue.value = parts[0] + '.' + parts[1].slice(0, 2)
    return
  }
  displayValue.value = filtered
  amount.value = filtered
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
        @click="handleOverlayClick">
        <div class="bg-wise-surface rounded-[30px] border border-wise-border w-[420px] px-8 pt-6 pb-8 shadow-[0_0_0_1px_var(--wise-border)]">
          <!-- 标题 -->
          <div class="text-center text-xl font-bold mb-6" :style="{ color: titleColor }">
            {{ t(titleKey) }}
          </div>

          <!-- 输入框 -->
          <div class="mb-4">
            <input v-model="displayValue" type="text" inputmode="decimal"
              :placeholder="t('affund.pleaseEnterAmount')"
              class="w-full h-11 rounded-[16px] border border-wise-border bg-wise-page px-4 text-base text-wise-text placeholder:text-wise-muted outline-none focus:border-wise-accent" />
          </div>

          <!-- 余额 -->
          <div class="mb-6 text-center text-sm text-wise-muted">
            {{ t('affund.myBalance') }}: ${{ addCommas(balance) }}
          </div>

          <!-- 按钮 -->
          <div class="flex items-center gap-3">
            <button
              class="flex-1 h-12 rounded-[9999px] border border-wise-border bg-wise-soft text-wise-accentForeground text-base font-semibold transition-all duration-200 ease-out hover:bg-wise-hover"
              @click="handleClose">
              {{ t('affund.close') }}
            </button>
            <button
              class="flex-1 h-12 rounded-[9999px] bg-wise-accent text-wise-accentForeground text-base font-semibold transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97]"
              @click="handleConfirm">
              {{ t(confirmTextKey) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
