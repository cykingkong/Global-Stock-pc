<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['action'])

const uiStatus = computed(() => {
  const s = props.item.status
  if (s === 1) return 'waiting'
  if (s === 2) return 'won'
  if (s === 3) return 'listed'
  if (s === 4) return 'refunded'
  return 'sold'
})

const statusConfig: Record<string, any> = {
  waiting: {
    label: '等待中签',
    color: '#E8FAF3',
    textColor: '#12D18E',
    showButton: true,
    buttonText: '等待上市',
    buttonColor: '#E8FAF3',
    buttonTextColor: '#12D18E',
    buttonDisabled: true,
  },
  won: {
    label: '已中签',
    color: '#E8FAF3',
    textColor: '#12D18E',
    showButton: true,
    buttonText: '等待上市',
    buttonColor: '#E8FAF3',
    buttonTextColor: '#12D18E',
    buttonDisabled: true,
  },
  listed: {
    label: '已上市',
    color: '#E8FAF3',
    textColor: '#12D18E',
    showButton: true,
    buttonText: '出售',
    buttonColor: '#64748B',
    buttonTextColor: '#FFFFFF',
    buttonDisabled: false,
  },
  refunded: {
    label: '退还上市',
    color: '#E8FAF3',
    textColor: '#12D18E',
    showButton: true,
    buttonText: '申请退回',
    buttonColor: '#12D18E',
    buttonTextColor: '#FFFFFF',
    buttonDisabled: false,
  },
  sold: {
    label: '已出售',
    color: '#F1F5F9',
    textColor: '#64748B',
    showButton: false,
  },
}

const currentStatus = computed(() => statusConfig[uiStatus.value] || statusConfig.waiting)

const showDetailInfo = computed(() => ['listed', 'refunded'].includes(uiStatus.value))

const expectedPriceRange = computed(() => {
  const item = props.item
  if (item.listing_price_min && item.listing_price_max) {
    return `$${item.listing_price_min?.toLocaleString()} ~ $${item.listing_price_max?.toLocaleString()}`
  }
  return `$${item.listing_price_min || item.listing_price_max || '-'}`
})

function handleAction() {
  if (!currentStatus.value.buttonDisabled) {
    emit('action', {
      status: uiStatus.value,
      action: currentStatus.value.buttonText,
      data: props.item,
    })
  }
}
</script>

<template>
  <div class="ipo-order-card">
    <div class="card-header">
      <h3 class="company-name">{{ item.project_name }}</h3>
      <div class="status-tag" :style="{ backgroundColor: currentStatus.color, color: currentStatus.textColor }">
        {{ currentStatus.label }}
      </div>
    </div>

    <div class="divider"></div>

    <div class="price-info">
      <div class="price-item">
        <div class="price-value">${{ item.issue_price?.toLocaleString() }}</div>
        <div class="price-label">发行价</div>
      </div>

      <div v-if="item.allotted_qty > 0" class="price-item">
        <div class="price-value">{{ item.allotted_qty }}</div>
        <div class="price-label">中签数</div>
      </div>

      <div class="price-item">
        <div class="price-value">{{ expectedPriceRange }}</div>
        <div class="price-label">上市价格</div>
      </div>
    </div>

    <div v-if="showDetailInfo" class="detail-info">
      <div class="detail-item">
        <div class="detail-value">${{ item.projected_earnings?.toLocaleString() || '0' }}</div>
        <div class="detail-label">预计盈利</div>
      </div>

      <div class="detail-item">
        <div class="detail-value">{{ item.unfreeze_at || '-' }}</div>
        <div class="detail-label">解冻时间</div>
      </div>
    </div>

    <button
      v-if="currentStatus.showButton"
      class="action-button"
      :class="{ disabled: currentStatus.buttonDisabled }"
      :style="{ backgroundColor: currentStatus.buttonColor, color: currentStatus.buttonTextColor }"
      :disabled="currentStatus.buttonDisabled"
      @click="handleAction"
    >
      {{ currentStatus.buttonText }}
    </button>
  </div>
</template>

<style lang="less" scoped>
.ipo-order-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid #E2E8F0;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .company-name {
      font-size: 18px;
      font-weight: bold;
      color: #0F172A;
      text-decoration: underline;
      max-width: 65%;
      word-break: break-word;
    }

    .status-tag {
      padding: 6px 14px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 500;
    }
  }

  .divider {
    height: 1px;
    background: #E2E8F0;
    margin: 16px 0;
  }

  .price-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .price-item {
      .price-value {
        font-size: 17px;
        font-weight: bold;
        color: #0F172A;
        margin-bottom: 6px;
      }

      .price-label {
        font-size: 12px;
        color: #64748B;
      }
    }
  }

  .detail-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .detail-item {
      .detail-value {
        font-size: 17px;
        font-weight: bold;
        color: #0F172A;
        margin-bottom: 6px;
      }

      .detail-label {
        font-size: 12px;
        color: #64748B;
      }
    }
  }

  .action-button {
    width: 100%;
    height: 44px;
    border: none;
    border-radius: 32px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;

    &:not(.disabled):hover {
      opacity: 0.9;
    }

    &:not(.disabled):active {
      transform: scale(0.98);
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
