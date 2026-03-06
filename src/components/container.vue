<template>
  <div class="tv-mini-chart-wrapper" :style="containerStyle">
    <!-- 骨架屏 -->
    <div v-if="isLoading" class="skeleton-loader">
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-actions">
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
      <div class="skeleton-chart">
        <div class="skeleton-chart-main"></div>
        <div class="skeleton-chart-bottom"></div>
      </div>
      <div class="skeleton-footer">
        <div class="skeleton-info"></div>
        <div class="skeleton-info"></div>
        <div class="skeleton-info"></div>
      </div>
    </div>

    <!-- TradingView 容器 -->
    <div
      class="tv-mini-chart-container"
      ref="containerRef"
      :style="containerStyle"
      :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'

export default {
  props: {
    symbol: {
      type: String,
      required: true,
      default: 'NASDAQ:NVDA',
    },
    theme: {
      type: String,
      default: 'dark',
      validator: (value) => ['light', 'dark'].includes(value),
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    height: {
      type: [String, Number],
      default: 560,
    },
    dateRange: {
      type: String,
      default: '12M',
      validator: (value) => ['1D', '1M', '3M', '12M', '60M', 'ALL'].includes(value),
    },
  },
  setup(props) {
    const containerRef = ref(null)
    let scriptElement = null
    let widgetId = null
    const isLoading = ref(true)

    // 使用 computed 计算容器样式
    const containerStyle = computed(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    }))

    const generateWidgetId = () => {
      return `tv-widget-${Math.random().toString(36).substr(2, 9)}`
    }
    const cleanupWidget = () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
        scriptElement = null
      }
      // if (widgetId && window.TradingView && window.TradingView.widgets && window.TradingView.widgets[widgetId]) {
      //     window.TradingView.widgets[widgetId].remove();
      //     widgetId = null;
      // }
      if (containerRef.value) {
        containerRef.value.innerHTML = ''
      }
    }

    const loadWidget = () => {
      // const socket = new WebSocket('wss://your-websocket-endpoint');
      // socket.onmessage = (event) => {
      // const data = JSON.parse(event.data);
      //     console.log(data);
      // };
      cleanupWidget()
      isLoading.value = true

      widgetId = generateWidgetId()
      containerRef.value.id = widgetId

      // 创建新脚本
      scriptElement = document.createElement('script')
      scriptElement.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      scriptElement.async = true
      scriptElement.type = 'text/javascript'
      scriptElement.innerHTML = JSON.stringify({
        autosize: false,
        width: typeof props.width === 'string' && props.width === '100%' ? '100%' : (typeof props.width === 'number' ? props.width : parseInt(props.width)),
        height: typeof props.height === 'number' ? props.height : parseInt(props.height) || 560,
        symbol: props.symbol,
        interval: 'D',
        hide_top_toolbar: true,
        timezone: 'Etc/UTC',
        theme: props.theme,
        style: '1',
        locale: 'en',
        hide_legend: false,
        withdateranges: true,
        enable_publishing: false,
        range: '1D',
        // "range": "12M",
        allow_symbol_change: false,
        save_image: false,
        details: true,
        studies: ['STD;DEMA', 'STD;MA%1Cross', 'Volume@tv-basicstudies'],
        hide_volume: true,
        support_host: 'https://www.tradingview.com',
        container_id: widgetId,
        isTransparent: true,
      })

      // 监听脚本加载完成
      scriptElement.onload = () => {
        // 等待 iframe 渲染，通常需要一些时间
        setTimeout(() => {
          // 检查 iframe 是否已加载
          const checkIframe = setInterval(() => {
            const iframe = containerRef.value?.querySelector('iframe')
            if (iframe) {
              clearInterval(checkIframe)
              // 再等待一小段时间确保内容已渲染
              setTimeout(() => {
                isLoading.value = false
              }, 500)
            }
          }, 100)

          // 最多等待 5 秒
          setTimeout(() => {
            clearInterval(checkIframe)
            isLoading.value = false
          }, 5000)
        }, 100)
      }

      // 处理加载错误
      scriptElement.onerror = () => {
        console.error('Failed to load TradingView widget')
        isLoading.value = false
      }

      containerRef.value.appendChild(scriptElement)
    }

    onMounted(loadWidget)

    watch(() => props.symbol, loadWidget)
    watch(() => props.theme, loadWidget)
    watch(() => props.dateRange, loadWidget)

    onBeforeUnmount(cleanupWidget)

    return { containerRef, containerStyle, isLoading }
  },
}
</script>

<style scoped>
.tv-mini-chart-wrapper {
  position: relative;
  width: 100%;
  height: 560px !important;
  min-height: 560px !important;
  max-height: 560px;
  overflow: hidden;
}

.tv-mini-chart-container {
  width: 100%;
  height: 560px !important;
  min-height: 560px !important;
  max-height: 560px;
  border: none;
  margin: auto;
  flex-shrink: 0;
  overflow: hidden;
  transition: opacity 0.3s ease-in-out;
}

/* 确保内部 iframe 也遵循高度 */
.tv-mini-chart-container :deep(iframe) {
  height: 560px !important;
  min-height: 560px !important;
}

/* 骨架屏样式 */
.skeleton-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  z-index: 10;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.skeleton-title {
  width: 200px;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-actions {
  display: flex;
  gap: 8px;
}

.skeleton-button {
  width: 80px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-chart {
  width: 100%;
  height: calc(100% - 120px);
  margin-bottom: 16px;
}

.skeleton-chart-main {
  width: 100%;
  height: calc(100% - 60px);
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.skeleton-chart-main::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 3px solid #e0e0e0;
  border-top-color: #58BD7D;
  border-radius: 50%;
  animation: skeleton-spin 1s linear infinite;
}

.skeleton-chart-bottom {
  width: 100%;
  height: 50px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-footer {
  display: flex;
  gap: 16px;
}

.skeleton-info {
  flex: 1;
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes skeleton-spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
