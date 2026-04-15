<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  totalAmount: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  progress: { type: Number, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  profitDetails: { default: () => [] },
})

const { t } = useI18n()

function addCommas(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formattedAmount = computed(() => addCommas(props.totalAmount))
</script>

<template>
  <div class="fund-pool-card">
    <!-- 金额卡片 -->
    <div class="bg-wise-page rounded-[30px] border border-wise-border px-10 py-8 mb-6 text-center shadow-[0_0_0_1px_var(--wise-border)]">
      <div class="text-4xl font-black text-wise-text mb-3">${{ formattedAmount }}</div>
      <div class="flex items-center justify-center gap-2 text-sm">
        <span class="text-wise-muted">{{ t('affund.expectedReturn') }}</span>
        <svg class="w-5 h-5 text-wise-accent" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.6168 1.6665C16.4408 1.6666 18.3336 3.65017 18.3336 6.6001V13.4077C18.3336 16.3493 16.4408 18.3334 13.6168 18.3335H6.39117C3.56639 18.3333 1.66656 16.3492 1.66656 13.4077V6.6001C1.66656 3.65023 3.56639 1.66669 6.39117 1.6665H13.6168ZM10.442 6.1499C10.2086 5.91657 9.7915 5.91657 9.55817 6.1499L6.43317 9.2915C6.19153 9.53317 6.19151 9.93364 6.43317 10.1753C6.68308 10.4167 7.07482 10.4166 7.32477 10.1753L9.37457 8.10791V13.3999C9.37461 13.7498 9.65807 14.0247 9.99957 14.0249C10.3496 14.0249 10.6245 13.7499 10.6246 13.3999V8.10791L12.6832 10.1753C12.7997 10.2918 12.9664 10.3578 13.1246 10.3579C13.2821 10.3579 13.442 10.2919 13.567 10.1753C13.8086 9.93369 13.8084 9.53319 13.567 9.2915L10.442 6.1499Z"
            fill="currentColor" />
          <defs>
            <linearGradient id="paint0_linear_fund" x1="18.3336" y1="18.3335" x2="-1.49867" y2="12.5833"
              gradientUnits="userSpaceOnUse">
              <stop stop-color="#12D18E" />
              <stop offset="1" stop-color="#71E3BB" />
            </linearGradient>
          </defs>
        </svg>
        <span class="text-wise-accent font-bold text-sm">{{ expectedReturn }}%</span>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="mb-6">
      <div class="flex items-center gap-4">
        <span class="text-sm text-wise-accent font-semibold whitespace-nowrap">{{ t('affund.completedReturns') }}</span>
        <div class="flex items-center gap-4 flex-1">
          <div class="h-2 bg-wise-border rounded-full overflow-hidden flex-1">
            <div class="h-full bg-wise-accent rounded-full transition-all duration-300" :style="{ width: progress + '%' }" />
          </div>
          <span class="text-sm text-wise-accent font-semibold">{{ progress }}%</span>
        </div>
      </div>
    </div>

    <!-- 日期信息 -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="flex items-center gap-3 bg-wise-surface rounded-[24px] border border-wise-border p-4">
        <div class="w-10 h-10 bg-wise-soft rounded-full flex items-center justify-center flex-shrink-0 text-wise-accentForeground">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 9H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M19 4H5C3.895 4 3 4.895 3 6V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V6C21 4.895 20.105 4 19 4Z"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div>
          <div class="text-xs text-wise-muted">{{ t('affund.profitStartTime') }}</div>
          <div class="text-sm text-wise-text font-semibold">{{ startDate }}</div>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-wise-surface rounded-[24px] border border-wise-border p-4">
        <div class="w-10 h-10 bg-wise-soft rounded-full flex items-center justify-center flex-shrink-0 text-wise-accentForeground">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 9H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M19 4H5C3.895 4 3 4.895 3 6V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V6C21 4.895 20.105 4 19 4Z"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div>
          <div class="text-xs text-wise-muted">{{ t('affund.profitEndTime') }}</div>
          <div class="text-sm text-wise-text font-semibold">{{ endDate }}</div>
        </div>
      </div>
    </div>

    <!-- 收益明细 -->
    <div>
      <div class="text-lg text-wise-text font-black mb-3">{{ t('affund.profitDetails') }}</div>
      <div class="space-y-2">
        <div v-for="(item, index) in profitDetails" :key="index" class="text-sm text-wise-muted">
          {{ item.desc }} ${{ addCommas(item.amount) }}
        </div>
      </div>
    </div>
  </div>
</template>
