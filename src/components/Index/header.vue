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
  <div class=" bg-white font-sans antialiased">
    <!-- ============ HERO SECTION ============ -->
    <section class="relative overflow-hidden px-[40px] pt-[80px] pb-[40px] max-w-[1440px] mx-auto">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[40px]">
        <!-- Left Content -->
        <div class="relative z-10 max-w-[520px] flex-shrink-0">
          <h1 class="text-[64px] font-bold leading-[1.15] tracking-[-0.02em] text-[#141416] mb-[24px]"
            style="font-family: 'DM Sans', sans-serif">
            {{ t('index.header.title') }}
          </h1>
          <p class="text-[16px] leading-[1.65] text-[#777E90] max-w-[380px] mb-[32px]">
            {{ t('index.header.subtitle') }}
          </p>
          <button
            class="inline-flex items-center justify-center bg-[#3772FF] hover:bg-[#2B5FD9] text-white text-[16px] font-bold rounded-full px-[28px] py-[16px] transition-colors duration-200 cursor-pointer border-none">
            {{ t('index.header.getStarted') }}
          </button>

          <!-- Scroll Down Arrow -->
          <div class="mt-[64px]">
            <div
              class="w-[40px] h-[40px] rounded-full border-2 border-[#E6E8EC] flex items-center justify-center cursor-pointer hover:border-[#777E90] transition-colors duration-200">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1V13M7 13L1 7M7 13L13 7" stroke="#777E90" stroke-width="2" stroke-linecap="round"
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
        class="max-w-[1120px] mx-auto px-[40px] bg-[#F4F5F6] min-h-[252px] pt-[24px] pb-[24px] flex items-center rounded-[24px]">
        <div class="flex gap-[20px] overflow-visible">
          <div v-for="(card, index) in indexList" :key="index"
            class="flex-shrink-0 min-w-[240px] flex-1 rounded-[16px] p-[24px] transition-shadow duration-300" :class="card.elevated ? 'bg-white shadow-[0px_64px_64px_-48px_#0F0F0F1A]' : 'bg-transparent'
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
              <span class="text-[14px] font-semibold text-[#23262F]">
                {{ card.symbol }}
              </span>
              <div
                class="text-[12px] font-semibold px-[8px] h-[24px] line-height-0 rounded-[12px] flex justify-center items-center"
                :class="card.changeValue >= 0 ? 'bg-trend-up text-white' : 'bg-trend-down text-white'">
                {{ card.increase }}
              </div>
            </div>

            <!-- Price -->
            <div class="text-[28px] font-bold text-[#23262F] tracking-[-0.01em] mb-[4px]"
              style="font-family: 'DM Sans', sans-serif">
              ${{ Number(card.close).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </div>

            <!-- Sub Price -->
            <div class="text-[14px] text-[#777E90]">
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
