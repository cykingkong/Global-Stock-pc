<template>
    <div class="tv-mini-chart-container" ref="containerRef"></div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

export default {
    props: {
        symbol: {
            type: String,
            required: true,
            default: 'NASDAQ:NVDA'
        },
        theme: {
            type: String,
            default: 'dark',
            validator: (value) => ['light', 'dark'].includes(value)
        },
        width: {
            type: [String, Number],
            default: '100%'
        },
        height: {
            type: [String, Number],
            default: '100%'
        },
        dateRange: {
            type: String,
            default: '12M',
            validator: (value) => ['1D', '1M', '3M', '12M', '60M', 'ALL'].includes(value)
        }
    },
    setup(props) {
        const containerRef = ref(null);
        let scriptElement = null;
        let widgetId = null;


        const generateWidgetId = () => {
            return `tv-widget-${Math.random().toString(36).substr(2, 9)}`;
        };
        const cleanupWidget = () => {
            if (scriptElement && scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
                scriptElement = null;
            }
            // if (widgetId && window.TradingView && window.TradingView.widgets && window.TradingView.widgets[widgetId]) {
            //     window.TradingView.widgets[widgetId].remove();
            //     widgetId = null;
            // }
            if (containerRef.value) {
                containerRef.value.innerHTML = '';
            }
        };

        const loadWidget = () => {
            // const socket = new WebSocket('wss://your-websocket-endpoint');
            // socket.onmessage = (event) => {
            // const data = JSON.parse(event.data);
            //     console.log(data);
            // };
            cleanupWidget();

            widgetId = generateWidgetId();
            containerRef.value.id = widgetId;

            // 创建新脚本
            scriptElement = document.createElement('script');
            scriptElement.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
            scriptElement.async = true;
            scriptElement.type = 'text/javascript';
            scriptElement.innerHTML = JSON.stringify({
                "autosize": true,
                "symbol": props.symbol,
                "interval": "D",
                "hide_top_toolbar": true,
                "timezone": "Etc/UTC",
                "theme": props.theme,
                "style": "1",
                "locale": "en",
                "hide_legend": false,
                "withdateranges": true,
                "enable_publishing": false,
                "range": "1D",
                // "range": "12M",
                "allow_symbol_change": false,
                "save_image": false,
                "details": true,
                "studies": [
                    "STD;DEMA",
                    "STD;MA%1Cross",
                    "Volume@tv-basicstudies"
                ],
                "hide_volume": true,
                "support_host": "https://www.tradingview.com",
                "container_id": widgetId,
                "isTransparent": true,
            });

            containerRef.value.appendChild(scriptElement);
        };

        onMounted(loadWidget);

        watch(() => props.symbol, loadWidget);
        watch(() => props.theme, loadWidget);
        watch(() => props.dateRange, loadWidget);

        onBeforeUnmount(cleanupWidget);

        return { containerRef };
    }
};
</script>

<style scoped>
.tv-mini-chart-container {
    width: 100%;
    height: 870px;
    border: none;
    margin: auto;
}
</style>