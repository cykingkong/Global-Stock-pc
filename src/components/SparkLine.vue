<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data: number[]
  increase?: number
  width?: number
  height?: number
}>(), {
  increase: 0,
  width: 138,
  height: 42,
})

const uniqueId = `sg_${Math.random().toString(36).slice(2, 10)}`

const greenColor = '#34C759'
const redColor = '#FF3B30'
const chartColor = computed(() => props.increase >= 0 ? greenColor : redColor)

const W = computed(() => props.width)
const H = computed(() => props.height)
const PAD = 2

const points = computed(() => {
  const d = props.data
  if (!d || d.length < 2) return []
  const min = Math.min(...d)
  const max = Math.max(...d)
  const range = max - min || 1
  return d.map((v, i) => ({
    x: PAD + (i / (d.length - 1)) * (W.value - PAD * 2),
    y: H.value - PAD - ((v - min) / range) * (H.value - PAD * 2),
  }))
})

// 贝塞尔平滑路径（描边线）
const strokePath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cp1x = (prev.x + curr.x) / 2
    const cp2x = (prev.x + curr.x) / 2
    d += ` C${cp1x},${prev.y} ${cp2x},${curr.y} ${curr.x},${curr.y}`
  }
  return d
})

// 贝塞尔平滑路径（填充区域）
const fillPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  let d = `M${PAD},${H.value - PAD} L${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cp1x = (prev.x + curr.x) / 2
    const cp2x = (prev.x + curr.x) / 2
    d += ` C${cp1x},${prev.y} ${cp2x},${curr.y} ${curr.x},${curr.y}`
  }
  d += ` L${W.value - PAD},${H.value - PAD} Z`
  return d
})
</script>

<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" fill="none"
    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient :id="uniqueId" x1="0" y1="0" x2="0" :y2="height" gradientUnits="userSpaceOnUse">
        <stop offset="0%" :stop-color="chartColor" stop-opacity="0.3" />
        <stop offset="100%" :stop-color="chartColor" stop-opacity="0" />
      </linearGradient>
      <clipPath :id="`clip_${uniqueId}`">
        <rect :width="width" :height="height" />
      </clipPath>
    </defs>
    <g :clip-path="`url(#clip_${uniqueId})`">
      <path :d="fillPath" :fill="`url(#${uniqueId})`" />
      <path :d="strokePath" :stroke="chartColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </g>
  </svg>
</template>
