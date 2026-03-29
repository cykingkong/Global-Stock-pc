<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { walletLogs } from '@/api/user'
import { addCommasToNumber } from '@/utils/tool'
import Nav from '@/components/Nav.vue'
import emptySvg from '@/components/emptySvg.vue'

const { t } = useI18n()

interface WalletLog {
  logo_url?: string
  remark: string
  created_at: string
  amount: number
  profit_loss_percent?: string
  increase?: string
  changeValue?: number
}

const activeTab = ref(0)
const tabs = ref([
  { label: t('Pending'), key: 'pending' },
  { label: t('Success'), key: 'success' },
  { label: t('Rejected'), key: 'rejected' }
])

const form = reactive({
  startDate: '',
  endDate: '',
})

const page = reactive({
  page: 1,
  size: 20,
})

const walletLogsList = ref<WalletLog[]>([])
const loading = ref(false)
const hasMore = ref(true)

const handleTabChange = (index: number) => {
  activeTab.value = index
  page.page = 1
  walletLogsList.value = []
  fetchWalletLogs()
}

async function fetchWalletLogs() {
  loading.value = true
  const { data, code } = await walletLogs({
    ...page,
    startDate: form.startDate,
    endDate: form.endDate,
    status: tabs.value[activeTab.value].key,
  })

  if (code === 200) {
    const logs = data?.data || []

    if (page.page === 1) {
      walletLogsList.value = logs
    } else {
      walletLogsList.value = walletLogsList.value.concat(logs)
    }

    const total = data?.meta?.pagination?.total || 0
    hasMore.value = walletLogsList.value.length < total && logs.length > 0
  }
  loading.value = false
}

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.page++
    fetchWalletLogs()
  }
}

onMounted(() => {
  fetchWalletLogs()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Nav />

    <div class="max-w-[1200px] mx-auto px-8 py-10">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ t('Money Detail') }}</h1>
        <p class="text-gray-500">View your transaction history</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-gray-200 bg-gray-50">
          <button v-for="(tab, index) in tabs" :key="index" @click="handleTabChange(index)" :class="[
            'flex-1 py-4 px-6 text-center font-semibold transition-all relative',
            activeTab === index
              ? 'text-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          ]">
            {{ tab.label }}
            <div v-if="activeTab === index"
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t" />
          </button>
        </div>

        <!-- Date Filter -->
        <div class="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">{{ t('Fliter') }}</span>
            </div>
            <a-range-picker v-model="form.startDate" @change="() => { page.page = 1; fetchWalletLogs() }"
              class="flex-1 max-w-md" :style="{ borderRadius: '0.75rem' }" />
          </div>
        </div>

        <!-- List -->
        <div class="p-6">
          <div v-if="loading && page.page === 1" class="space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="w-12 h-12 bg-gray-200 rounded-full" />
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/3" />
                <div class="h-3 bg-gray-200 rounded w-1/4" />
              </div>
              <div class="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>

          <div v-else-if="walletLogsList.length > 0" class="space-y-3">
            <div v-for="(item, index) in walletLogsList" :key="index"
              class="group flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white">
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <img v-if="item.logo_url" :src="item.logo_url" class="w-14 h-14 rounded-full object-cover" />
                  <svg v-else class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 truncate mb-1">{{ item.remark }}</div>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ item.created_at }}
                  </div>
                </div>
              </div>
              <div class="text-right flex-shrink-0 ml-4">
                <div class="font-bold text-lg text-gray-900 mb-1">${{ addCommasToNumber(item.amount) }}</div>
                <div v-if="item.profit_loss_percent || item.increase" :class="[
                  'text-sm font-medium px-2 py-1 rounded-md',
                  (Number(item.profit_loss_percent) || item.changeValue || 0) >= 0
                    ? 'text-green-700 bg-green-50'
                    : 'text-red-700 bg-red-50'
                ]">
                  {{ item.profit_loss_percent || item.increase }}
                </div>
              </div>
            </div>

            <div v-if="hasMore" class="text-center py-6">
              <button @click="loadMore" :disabled="loading"
                class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          </div>

          <div v-else class="flex items-center justify-center flex-col gap-[20px] py-12">
            <emptySvg />
            <p class="text-gray-500">No transactions found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
