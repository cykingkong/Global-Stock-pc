<template>
  <section class="w-full bg-[#f8f9fb] py-20 px-4">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-[48px] font-extrabold text-[#23262f] leading-tight mb-6 tracking-tight">
        How it work
      </h2>
      <p class="text-[16px] leading-7 text-[#777e91] max-w-[480px] mx-auto">
        Stacks is a production-ready library of stackable content blocks built in React Native.
      </p>
    </div>

    <!-- Steps -->
    <div class="max-w-[1200px] mx-auto flex items-start justify-between relative">
      <!-- Step items -->
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex flex-col items-center text-center relative z-1 w-[250px]"
      >
        <!-- Icon area -->
        <div class="w-[120px] h-[120px] mb-12 flex items-center justify-center relative">
          <img :src="step.icon" :alt="step.title" class="w-full h-full object-contain" />
        </div>

        <!-- Step label -->
        <span class="text-[14px] font-medium text-[#777e91] mb-3"> Step {{ step.id }} </span>

        <!-- Step title -->
        <h3 class="text-[22px] font-bold text-[#23262f] mb-4 leading-tight">
          {{ step.title }}
        </h3>

        <!-- Step description -->
        <p class="text-[14px] leading-6 text-[#777e91] px-2">
          {{ step.description }}
        </p>
      </div>

      <!-- Dashed connectors -->
      <svg
        class="absolute top-[60px] left-0 w-full h-[20px] z-0 pointer-events-none"
        preserveAspectRatio="none"
      >
        <!-- Connector 1: between step 1 and step 2 -->
        <line
          :x1="connectorPositions[0].x1"
          y1="10"
          :x2="connectorPositions[0].x2"
          y2="10"
          stroke="#d1d5db"
          stroke-width="2"
          stroke-dasharray="8 6"
        />
        <circle
          :cx="connectorPositions[0].x1"
          cy="10"
          r="5"
          fill="#fff"
          stroke="#d1d5db"
          stroke-width="2"
        />
        <circle
          :cx="connectorPositions[0].x2"
          cy="10"
          r="5"
          fill="#fff"
          stroke="#d1d5db"
          stroke-width="2"
        />
        <!-- Connector 2: between step 2 and step 3 -->
        <line
          :x1="connectorPositions[1].x1"
          y1="10"
          :x2="connectorPositions[1].x2"
          y2="10"
          stroke="#d1d5db"
          stroke-width="2"
          stroke-dasharray="8 6"
        />
        <circle
          :cx="connectorPositions[1].x1"
          cy="10"
          r="5"
          fill="#fff"
          stroke="#d1d5db"
          stroke-width="2"
        />
        <circle
          :cx="connectorPositions[1].x2"
          cy="10"
          r="5"
          fill="#fff"
          stroke="#d1d5db"
          stroke-width="2"
        />
        <!-- Connector 3: between step 3 and step 4 -->
        <line
          :x1="connectorPositions[2].x1"
          y1="10"
          :x2="connectorPositions[2].x2"
          y2="10"
          stroke="#d1d5db"
          stroke-width="2"
          stroke-dasharray="8 6"
        />
        <circle
          :cx="connectorPositions[2].x1"
          cy="10"
          r="5"
          fill="#fff"
          stroke="#d1d5db"
          stroke-width="2"
        />
        <circle
          :cx="connectorPositions[2].x2"
          cy="10"
          r="5"
          fill="#fff"
          stroke="#d1d5db"
          stroke-width="2"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import work1 from '@/assets/work1.png'
import work2 from '@/assets/work2.png'
import work3 from '@/assets/work3.png'
import work4 from '@/assets/work4.png'
interface Step {
  id: number
  title: string
  description: string
  icon: string
}

const steps = ref<any[]>([
  {
    id: 1,
    title: 'Download',
    description:
      'Stacks is a production-ready library of stackable content blocks built in React Native.',
    icon: work1,
  },
  {
    id: 2,
    title: 'Connect wallet',
    description:
      'Stacks is a production-ready library of stackable content blocks built in React Native.',
    icon: work2,
  },
  {
    id: 3,
    title: 'Start trading',
    description:
      'Stacks is a production-ready library of stackable content blocks built in React Native.',
    icon: work3,
  },
  {
    id: 4,
    title: 'Get rewarded',
    description:
      'Stacks is a production-ready library of stackable content blocks built in React Native.',
    icon: work4,
  },
])

const containerWidth = ref(1200)
const stepWidth = 250

const connectorPositions = computed(() => {
  const totalWidth = containerWidth.value
  const stepCount = 4
  const stepCenterGap = totalWidth / stepCount
  const centers: number[] = []

  for (let i = 0; i < stepCount; i++) {
    centers.push(stepCenterGap * i + stepCenterGap / 2)
  }

  const offset = 80
  return [
    { x1: centers[0] + offset, x2: centers[1] - offset },
    { x1: centers[1] + offset, x2: centers[2] - offset },
    { x1: centers[2] + offset, x2: centers[3] - offset },
  ]
})

const updateWidth = () => {
  const el = document.querySelector('.max-w-1200px') as HTMLElement | null
  if (el) {
    containerWidth.value = el.offsetWidth
  }
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
/* Fallback for font weight matching the bold "How it work" heading */
h2 {
  font-family:
    'DM Sans',
    'Inter',
    ui-sans-serif,
    system-ui,
    -apple-system,
    sans-serif;
}

h3 {
  font-family:
    'DM Sans',
    'Inter',
    ui-sans-serif,
    system-ui,
    -apple-system,
    sans-serif;
}
</style>
