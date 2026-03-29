<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message, Modal } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import '@arco-design/web-vue/es/modal/style/css.js'
import Nav from '@/components/Nav.vue'
import IndexFooter from '@/components/Index/footer.vue'
import useUserStore from '@/stores/user'
import { addCommasToNumber } from '@/utils/tool'
import { ipoProductInfo, ipoSubscribe } from '@/api/ipo'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()

const ipoDetail = ref<any>(null)
const loading = ref(false)
const showModal = ref(false)
const subscribeQty = ref(100)

const productId = computed(() => route.query.id as string)
const userBalance = computed(() => userStore.userInfo?.balance || 0)

const statusConfig = computed(() => {
  const s = ipoDetail.value?.status
  const map: any = {
    1: { text: t('ipo.pending'), color: '#F59E0B', bg: '#FEF3E8' },
    2: { text: t('ipo.inProgress'), color: '#12D18E', bg: '#E8FAF3' },
    3: { text: t('ipo.ended'), color: '#64748B', bg: '#F1F5F9' },
  }
  return map[s] || map[1]
})

async function loadDetail() {
  if (!productId.value) return
  loading.value = true
  try {
    const res = await ipoProductInfo(productId.value)
    ipoDetail.value = res.data
  } catch (e: any) {
    Message.error(e.message || 'Failed to load detail')
  } finally {
    loading.value = false
  }
}

function handleSubscribe() {
  showModal.value = true
}

async function handleConfirm() {
  try {
    await ipoSubscribe(productId.value, { quantity: subscribeQty.value })
    Message.success(t('ipo.subscribeSuccess'))
    showModal.value = false
    loadDetail()
  } catch (e: any) {
    Message.error(e.message || t('ipo.subscribeFailed'))
  }
}

onMounted(() => {
  userStore.info()
  loadDetail()
})
</script>

<template>
  <div class="ipo-detail-page">
    <Nav />

    <div v-if="loading" class="container">
      <div class="text-center text-[#94A3B8] py-20">{{ t('affund.loading') }}</div>
    </div>

    <div v-else-if="ipoDetail" class="container">
      <div class="header-section">
        <div>
          <h1 class="page-title">{{ ipoDetail.name }}</h1>
          <div class="breadcrumb">{{ t('ipo.title') }} / {{ t('detail') }}</div>
        </div>
        <span class="status-tag" :style="{ color: statusConfig.color, backgroundColor: statusConfig.bg }">
          {{ statusConfig.text }}
        </span>
      </div>

      <div class="content-grid">
        <div class="main-content">
          <div class="info-card">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">{{ addCommasToNumber(ipoDetail.subscribe_user_count || 0) }}</div>
                <div class="stat-label">{{ t('ipo.subscribers') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ addCommasToNumber(ipoDetail.total_subscribe_qty || 0) }}</div>
                <div class="stat-label">{{ t('ipo.totalSubscribed') }}</div>
              </div>
            </div>
          </div>

          <div class="timeline-card">
            <h3 class="card-title">{{ t('ipo.subscriptionTime') }}</h3>
            <div class="timeline-list">
              <div class="timeline-item">
                <div class="timeline-icon green">
                  <svg class="w-[20px] h-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M13.385 2.50332C13.945 1.94332 14.8533 1.94249 15.4133 2.50332V2.50332C15.9733 3.06332 15.9733 3.97165 15.4133 4.53165L8.93499 11.0058C8.77832 11.1617 8.56666 11.25 8.34582 11.25H6.66666V9.57082C6.66666 9.34999 6.75416 9.13832 6.91082 8.98165L13.385 2.50332V2.50332Z"
                      stroke="#1BAC4B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 11.2497H14.1667" stroke="#1BAC4B" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M5.83334 14.5837H14.1667" stroke="#1BAC4B" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path
                      d="M15.8333 8.75V8.75C16.7542 8.75 17.5 9.49583 17.5 10.4167V16.25C17.5 17.1708 16.7542 17.9167 15.8333 17.9167H4.16667C3.24583 17.9167 2.5 17.1708 2.5 16.25V10.4167C2.5 9.49583 3.24583 8.75 4.16667 8.75V8.75"
                      stroke="#1BAC4B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.725 4.16699L13.75 6.19199" stroke="#1BAC4B" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path
                      d="M8.38834 4.63836L9.75584 3.27086C10.1508 2.87586 10.7917 2.87586 11.1875 3.27086V3.27086C11.5825 3.66586 11.5825 4.30669 11.1875 4.70253L10.2367 5.65336"
                      stroke="#1BAC4B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="timeline-content">
                  <div class="timeline-label">{{ t('ipo.subscriptionTime') }}</div>
                  <div class="timeline-date">{{ ipoDetail.subscribe_start_at?.split(' ')[0] || '-' }}</div>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-icon orange">
                  <svg class="w-[20px] h-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8337 7.49887H14.1684" stroke="#FF9800" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M5.8316 7.27089L6.59776 7.96118L8.14007 6.57227" stroke="#FF9800" stroke-width="1.5"
                      stroke-linecap="round" stroke-linejoin="round" />
                    <path
                      d="M8.33265 16.6693H6.66529C4.36314 16.6693 2.49689 14.8031 2.49689 12.5009V5.83149C2.49689 3.52934 4.36314 1.66309 6.66529 1.66309H13.3347C14.4403 1.66309 15.5005 2.10226 16.2822 2.88398C17.064 3.66571 17.5031 4.72596 17.5031 5.83149V9.16621"
                      stroke="#FF9800" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.8316 11.4389L6.59776 12.1291L8.14007 10.7402" stroke="#FF9800" stroke-width="1.5"
                      stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.6674 17.5035V13.752" stroke="#FF9800" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M14.1684 17.5035V13.752" stroke="#FF9800" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M16.6695 17.5035V13.752" stroke="#FF9800" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M10.8337 17.5028H17.5031" stroke="#FF9800" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M10.8337 12.2096V13.7519H17.5031V12.2096L14.1684 10.834L10.8337 12.2096Z" stroke="#FF9800"
                      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="timeline-content">
                  <div class="timeline-label">{{ t('ipo.drawTime') }}</div>
                  <div class="timeline-date">{{ ipoDetail.allot_at?.split(' ')[0] || '-' }}</div>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-icon red">
                  <svg class="w-[20px] h-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.99998 6.25033V5.41699" stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12.5 8.75H7.5C7.5 7.36929 8.61929 6.25 10 6.25V6.25C11.3807 6.25 12.5 7.36929 12.5 8.75Z"
                      stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.66667 12.9167V8.75" stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M13.3334 12.9167V8.75" stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M8.8889 12.9167V8.75" stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M11.1111 12.9167V8.75" stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M5.83331 12.9167H14.1666" stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M6.25 8.74967H13.75" stroke="#FF5A5F" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <rect x="2.5" y="2.5" width="15" height="15" rx="7.5" stroke="#FF5A5F" stroke-width="1.5"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="timeline-content">
                  <div class="timeline-label">{{ t('ipo.listingTime') }}</div>
                  <div class="timeline-date">{{ ipoDetail.listing_date || '-' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="ipoDetail.description" class="desc-card">
            <h3 class="card-title">{{ t('ipo.description') }}</h3>
            <p class="desc-text">{{ ipoDetail.description }}</p>
          </div>
        </div>

        <div class="sidebar">
          <div class="action-card">
            <div class="price-info">
              <div class="price-item">
                <div class="price-label">{{ t('ipo.issuePrice') }}</div>
                <div class="price-value">${{ addCommasToNumber(ipoDetail.issue_price) }}</div>
              </div>
              <div class="price-item">
                <div class="price-label">{{ t('ipo.listingPrice') }}</div>
                <div class="price-value">
                  ${{ ipoDetail.listing_price_min }} ~ ${{ ipoDetail.listing_price_max }}
                </div>
              </div>
            </div>
            <div class="balance-info">
              <span class="balance-label">{{ t('ipo.myBalance') }}</span>
              <span class="balance-value">${{ addCommasToNumber(userBalance) }}</span>
            </div>
            <button class="subscribe-btn" @click="handleSubscribe">{{ t('ipo.subscribe') }}</button>
          </div>
        </div>
      </div>
    </div>

    <IndexFooter />

    <Modal v-model:visible="showModal" title="申购IPO" @ok="handleConfirm">
      <div class="modal-content">
        <div class="form-item">
          <label>{{ t('ipo.subscribeQty') }}</label>
          <input v-model.number="subscribeQty" type="number" min="1" class="input-field" />
        </div>
        <div class="form-item">
          <label>{{ t('ipo.myBalance') }}</label>
          <div class="balance-display">${{ addCommasToNumber(userBalance) }}</div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.ipo-detail-page {
  background: linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%);
  min-height: 100vh;
}

.container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.page-title {
  font-size: 30px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.breadcrumb {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.status-tag {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.timeline-card,
.desc-card,
.action-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.stats-row {
  display: flex;
  gap: 40px;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #0f172a;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
  margin-bottom: 20px;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timeline-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-icon.green {
  background: #e8faf3;
}

.timeline-icon.orange {
  background: #fef3e8;
}

.timeline-icon.red {
  background: #fee8e8;
}

.timeline-label {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.timeline-date {
  font-size: 13px;
  color: #64748b;
}

.desc-text {
  font-size: 15px;
  line-height: 1.7;
  color: #64748b;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-size: 13px;
  color: #64748b;
}

.price-value {
  font-size: 16px;
  font-weight: bold;
  color: #0f172a;
}

.balance-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.balance-label {
  font-size: 13px;
  color: #64748b;
}

.balance-value {
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
}

.subscribe-btn {
  width: 100%;
  height: 48px;
  background: #12d18e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.subscribe-btn:hover {
  background: #10b97d;
}

.modal-content {
  padding: 20px 0;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
}

.balance-display {
  font-size: 16px;
  font-weight: bold;
  color: #0f172a;
}
</style>
