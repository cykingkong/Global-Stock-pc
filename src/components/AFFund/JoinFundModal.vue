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
        <div class="bg-white rounded-2xl w-[420px] px-8 pt-6 pb-8">
          <!-- 标题 -->
          <div class="text-center text-xl font-bold mb-6" :style="{ color: titleColor }">
            {{ t(titleKey) }}
          </div>

          <!-- 输入框 -->
          <div class="mb-4">
            <input v-model="displayValue" type="text" inputmode="decimal"
              :placeholder="t('affund.pleaseEnterAmount')"
              class="w-full h-11 rounded-xl bg-[#F8FAFC] px-4 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:bg-[#F1F5F9]" />
          </div>

          <!-- 余额 -->
          <div class="mb-6 text-center text-sm text-[#64748B]">
            {{ t('affund.myBalance') }}: ${{ addCommas(balance) }}
          </div>

          <!-- 按钮 -->
          <div class="flex items-center gap-3">
            <button
              class="flex-1 h-12 rounded-full bg-[#E8FAF3] text-[#12D18E] text-base font-semibold hover:bg-[#D1F4E8] transition-colors"
              @click="handleClose">
              {{ t('affund.close') }}
            </button>
            <button
              class="flex-1 h-12 rounded-full bg-[#12D18E] text-white text-base font-semibold hover:bg-[#0FBF80] transition-colors"
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
