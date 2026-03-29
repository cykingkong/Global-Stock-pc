<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])

const countdown = ref('')
let timer: any = null

const uiStatus = computed(() => {
  const s = props.item.status
  if (s === 2) return 'inProgress'
  if (s === 1) return 'pending'
  return 'ended'
})

const statusConfig: Record<string, any> = {
  inProgress: {
    label: '申购中',
    color: '#E8FAF3',
    textColor: '#12D18E',
  },
  pending: {
    label: '待开始',
    color: '#FEF3E8',
    textColor: '#F59E0B',
  },
  ended: {
    label: '已结束',
    color: '#F1F5F9',
    textColor: '#64748B',
  },
}

const currentStatus = computed(() => statusConfig[uiStatus.value] || statusConfig.inProgress)

const expectedPriceRange = computed(() => {
  const min = props.item.listing_price_min
  const max = props.item.listing_price_max
  return `$${min?.toLocaleString()} ~ $${max?.toLocaleString()}`
})

const endTimestamp = computed(() => {
  if (!props.item.subscribe_end_at) return 0
  return new Date(props.item.subscribe_end_at).getTime()
})

function updateCountdown() {
  const end = endTimestamp.value
  if (!end) {
    countdown.value = ''
    return
  }

  const now = Date.now()
  const diff = end - now

  if (diff <= 0) {
    countdown.value = '已结束'
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = `${days}天${hours}时${String(minutes).padStart(2, '0')}分${String(seconds).padStart(2, '0')}秒`
}

onMounted(() => {
  if (endTimestamp.value) {
    updateCountdown()
    timer = setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

function handleClick() {
  emit('click', props.item)
}
</script>

<template>
  <div class="ipo-product-card" @click="handleClick">
    <div class="card-header">
      <h3 class="company-name">{{ item.name }}</h3>
      <div class="status-tag" :style="{ backgroundColor: currentStatus.color, color: currentStatus.textColor }">
        {{ currentStatus.label }}
      </div>
    </div>

    <div class="price-info">
      <div class="price-item">
        <div class="price-value">${{ item.issue_price?.toLocaleString() }}</div>
        <div class="price-label">发行价</div>
      </div>

      <div class="price-item">
        <div class="price-value">{{ expectedPriceRange }}</div>
        <div class="price-label">预计上市价格</div>
      </div>
    </div>

    <div v-if="countdown" class="divider"></div>

    <div v-if="countdown" class="countdown-section">
      <span class="countdown-label">申购截止：</span>
      <span class="countdown-text">{{ countdown }}</span>
    </div>

    <button class="action-button">查看详情</button>
  </div>
</template>

<style lang="less" scoped>
.ipo-product-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .company-name {
      font-size: 18px;
      font-weight: bold;
      color: #0F172A;
      text-decoration: underline;
      max-width: 70%;
      word-break: break-word;
    }

    .status-tag {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
  }

  .price-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .price-item {
      .price-value {
        font-size: 18px;
        font-weight: bold;
        color: #0F172A;
        margin-bottom: 6px;
      }

      .price-label {
        font-size: 13px;
        color: #64748B;
      }
    }
  }

  .divider {
    height: 1px;
    background: #E2E8F0;
    margin: 16px 0;
  }

  .countdown-section {
    text-align: center;
    margin-bottom: 16px;
    font-size: 13px;

    .countdown-label {
      color: #64748B;
    }

    .countdown-text {
      color: #0F172A;
      font-weight: 500;
    }
  }

  .action-button {
    width: 100%;
    height: 44px;
    background: #12D18E;
    border: none;
    border-radius: 40px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #10B97D;
      box-shadow: 0 4px 12px rgba(18, 209, 142, 0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
