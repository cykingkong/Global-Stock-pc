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
  <div class="bg-[#F8FAFC] rounded-xl p-5 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-[#64748B]">{{ t('affund.orderId') }}</span>
      <span class="text-sm text-[#0F172A] font-bold">{{ orderId }}</span>
    </div>
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-[#64748B]">{{ t('affund.investmentAmount') }}</span>
      <span class="text-sm text-[#0F172A] font-semibold">${{ addCommas(investAmount) }}</span>
    </div>
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-[#64748B]">{{ t('affund.expectedReturnRate') }}</span>
      <span class="text-sm text-[#0F172A] font-semibold">{{ expectedReturn }}%</span>
    </div>
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm text-[#64748B]">{{ t('affund.expectedProfit') }}</span>
      <span class="text-lg text-[#0F172A] font-bold">${{ addCommas(expectedProfit) }}</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-sm text-[#64748B]">{{ t('affund.status') }}</span>
      <span class="text-xs font-medium px-3 py-1 rounded-lg"
        :style="{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }">
        {{ statusConfig.text }}
      </span>
    </div>
    <div v-if="showActionButtons" class="mt-4 flex items-center gap-3">
      <button
        class="flex-1 h-9 rounded-full bg-[#E7FAF4] text-[#12D18E] text-sm font-semibold hover:bg-[#D1F4E8] transition-colors"
        @click="emit('redeem', id)">
        {{ t('affund.redeemPrincipal') }}
      </button>
      <button
        class="flex-1 h-9 rounded-full bg-[#12D18E] text-white text-sm font-semibold hover:bg-[#0FBF80] transition-colors"
        @click="emit('addInvest', id)">
        {{ t('affund.addInvestment') }}
      </button>
    </div>
  </div>
</template>
