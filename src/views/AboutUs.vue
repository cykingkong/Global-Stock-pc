<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { about } from '@/api/index'
import Nav from '@/components/Nav.vue'

const data = ref({
  description: '',
})

async function getData() {
  const res = await about({})
  data.value = res.data
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Nav />

    <div class="max-w-[1200px] mx-auto px-8 py-10">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">About Us</h1>
        <p class="text-gray-500">Learn more about our platform</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div class="about-content prose max-w-none" v-html="data.description" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-content :deep(h1),
.about-content :deep(h2),
.about-content :deep(h3) {
  font-weight: 700;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.about-content :deep(h1) {
  font-size: 2rem;
}

.about-content :deep(h2) {
  font-size: 1.5rem;
}

.about-content :deep(h3) {
  font-size: 1.25rem;
}

.about-content :deep(p) {
  color: #4b5563;
  line-height: 1.75;
  margin-bottom: 1rem;
}

.about-content :deep(ul),
.about-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.about-content :deep(li) {
  color: #4b5563;
  line-height: 1.75;
  margin-bottom: 0.5rem;
}

.about-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.about-content :deep(a:hover) {
  color: #2563eb;
}

.about-content :deep(img) {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
</style>
