<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMarketStore } from '@/stores/market'
import { subscribeQuotes, unsubscribeAllQuotes } from '@/utils/quoteSubscription'

const { t } = useI18n()
const marketStore = useMarketStore()
const indexList = computed(() => marketStore.indexList)

onMounted(() => {
  marketStore.fetchIndexList()
  subscribeQuotes(indexList.value, (symbol, data) => {
    const target = indexList.value.find((s: any) => s.symbol === symbol)
    if (target) {
      if (data.close !== undefined) target.close = data.close
      if (data.increase !== undefined) target.increase = data.increase
      if (data.changeValue !== undefined) target.changeValue = data.changeValue
    }
  })
})

onUnmounted(() => {
  unsubscribeAllQuotes()
})

interface CryptoCard {
  icon: string
  iconBg: string
  iconColor: string
  pair: string
  change: string
  isUp: boolean
  price: string
  subPrice: string
  elevated?: boolean
}

</script>

<template>
  <div class="bg-wise-page font-sans antialiased text-wise-text [font-feature-settings:'calt']">
    <!-- ============ HERO SECTION ============ -->
    <section class="relative mx-auto overflow-hidden rounded-[40px] border border-wise-border bg-wise-surface px-[40px] pt-[80px] pb-[48px] max-w-[1360px] shadow-[0_0_0_1px_var(--wise-border)]">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[40px]">
        <!-- Left Content -->
        <div class="relative z-10 max-w-[520px] flex-shrink-0">
          <h1 class="mb-[24px] text-[64px] font-black leading-[0.92] tracking-[-0.04em] text-wise-text"
            style="font-family: 'Inter', sans-serif">
            {{ t('index.header.title') }}
          </h1>
          <p class="mb-[32px] max-w-[420px] text-[18px] leading-[1.6] text-wise-muted">
            {{ t('index.header.subtitle') }}
          </p>
          <button
            class="inline-flex items-center justify-center rounded-[9999px] border-none bg-wise-accent px-[28px] py-[16px] text-[18px] font-semibold text-wise-accentForeground transition-all duration-200 ease-out cursor-pointer hover:scale-[1.05] active:scale-[0.95]">
            {{ t('index.header.getStarted') }}
          </button>

          <!-- Scroll Down Arrow -->
          <div class="mt-[64px]">
            <div
              class="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-wise-border bg-wise-surface cursor-pointer transition-all duration-200 ease-out hover:border-wise-accent hover:bg-wise-hover hover:scale-[1.05]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1V13M7 13L1 7M7 13L13 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Right Illustration (3D Cards Placeholder) -->
        <img src="@/assets/indexHeader.png" alt="" class="w-[692px] object-cover block" />
      </div>
    </section>

    <!-- ============ CRYPTO CARDS SECTION ============ -->
    <section class="py-[48px]">
      <div
        class="max-w-[1120px] mx-auto px-[40px] bg-wise-soft min-h-[252px] pt-[24px] pb-[24px] flex items-center rounded-[40px] border border-wise-border shadow-[0_0_0_1px_var(--wise-border)]">
        <div class="flex gap-[20px] overflow-visible">
          <div v-for="(card, index) in indexList" :key="index"
            class="flex-shrink-0 min-w-[240px] flex-1 rounded-[30px] border border-wise-border p-[24px] transition-all duration-300" :class="card.elevated ? 'bg-wise-surface shadow-[0_0_0_1px_var(--wise-border)]' : 'bg-transparent'
              ">
            <!-- Icon -->
            <div class="w-[48px] h-[48px] rounded-full flex items-center justify-center mb-[16px] text-[18px] font-bold"
              :style="{
                backgroundColor: card.iconBg,
                color: card.iconColor,
              }">
              <img :src="card.logoUrl" alt="" class="w-[48px] h-[48px] block">
            </div>

            <!-- Pair + Change -->
            <div class="flex items-center gap-[8px] mb-[4px]">
              <span class="text-[14px] font-semibold text-wise-text">
                {{ card.symbol }}
              </span>
              <div
                class="text-[12px] font-semibold px-[8px] h-[24px] line-height-0 rounded-[12px] flex justify-center items-center"
                :class="card.changeValue >= 0 ? 'bg-trend-up text-white' : 'bg-trend-down text-white'">
                {{ card.increase }}
              </div>
            </div>

            <!-- Price -->
            <div class="text-[28px] font-black text-wise-text tracking-[-0.03em] mb-[4px]"
              style="font-family: 'Inter', sans-serif">
              ${{ Number(card.close).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </div>

            <!-- Sub Price -->
            <div class="text-[14px] text-wise-muted">
              {{ card.fullName }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

.font-sans {
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
}

/* Hide scrollbar for crypto cards horizontal scroll */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
