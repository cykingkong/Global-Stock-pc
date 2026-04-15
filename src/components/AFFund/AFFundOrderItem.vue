<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['redeem', 'addInvest'])

const props = defineProps({
  id: { type: Number, required: true },
  orderId: { type: String, required: true },
  investAmount: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  expectedProfit: { type: Number, required: true },
  status: { type: String, required: true },
  rawStatus: { type: Number, required: true },
})

const { t } = useI18n()

function addCommas(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const statusConfig = computed(() => {
  const configs: Record<string, any> = {
    processing: { text: t('affund.inProgress'), color: '#FF9900', bgColor: '#FFF9E6' },
    redeeming: { text: t('affund.redeeming'), color: '#FF9900', bgColor: '#FFF9E6' },
    completed: { text: t('affund.completed'), color: '#4AAF57', bgColor: '#E8FAF3' },
    redeemed: { text: t('affund.redeemed'), color: '#4AAF57', bgColor: '#E8FAF3' },
  }
  return configs[props.status] || configs.processing
})

const showActionButtons = computed(() => props.rawStatus === 2)
</script>

<template>
  <div class="rounded-[24px] border border-wise-border bg-wise-page p-5 shadow-[0_0_0_1px_var(--wise-border)] transition-all duration-200 hover:translate-y-[-1px]">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-wise-muted">{{ t('affund.orderId') }}</span>
      <span class="text-sm text-wise-text font-bold">{{ orderId }}</span>
    </div>
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-wise-muted">{{ t('affund.investmentAmount') }}</span>
      <span class="text-sm text-wise-text font-semibold">${{ addCommas(investAmount) }}</span>
    </div>
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-wise-muted">{{ t('affund.expectedReturnRate') }}</span>
      <span class="text-sm text-wise-text font-semibold">{{ expectedReturn }}%</span>
    </div>
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm text-wise-muted">{{ t('affund.expectedProfit') }}</span>
      <span class="text-lg text-wise-text font-black">${{ addCommas(expectedProfit) }}</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-sm text-wise-muted">{{ t('affund.status') }}</span>
      <span class="text-xs font-medium px-3 py-1 rounded-lg"
        :style="{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }">
        {{ statusConfig.text }}
      </span>
    </div>
    <div v-if="showActionButtons" class="mt-4 flex items-center gap-3">
      <button
        class="flex-1 h-9 rounded-[9999px] border border-wise-border bg-wise-soft text-wise-accentForeground text-sm font-semibold transition-all duration-200 ease-out hover:bg-wise-hover"
        @click="emit('redeem', id)">
        {{ t('affund.redeemPrincipal') }}
      </button>
      <button
        class="flex-1 h-9 rounded-[9999px] bg-wise-accent text-wise-accentForeground text-sm font-semibold transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97]"
        @click="emit('addInvest', id)">
        {{ t('affund.addInvestment') }}
      </button>
    </div>
  </div>
</template>
