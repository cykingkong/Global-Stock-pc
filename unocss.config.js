// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    // 移动端开发习惯用 px，这个插件把 rem 自动转为 px
    presetRemToPx({ baseFontSize: 16 }),
  ],
  theme: {
    colors: {
      brand: {
        red: '#D92D20', // Logo红
        beige: '#E3C498', // 卡片米色
      },
      trend: {
        up: '#58BD7D',   // 涨绿色
        down: '#FF6838', // 跌橙色
      }
    }
  }
})