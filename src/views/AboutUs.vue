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
  <div class="min-h-screen bg-wise-page text-wise-text [font-feature-settings:'calt']">
    <Nav />

    <div class="max-w-[1200px] mx-auto px-8 py-10">
      <div class="mb-8">
        <h1 class="text-[56px] leading-[0.9] font-black tracking-[-0.05em] text-wise-text mb-3">About Us</h1>
        <p class="text-wise-muted text-[18px] font-medium">Learn more about our platform</p>
      </div>

      <div class="bg-wise-surface rounded-[40px] border border-wise-border p-8 shadow-[0_0_0_1px_var(--wise-border)]">
        <div class="about-content max-w-none" v-html="data.description" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-content :deep(h1),
.about-content :deep(h2),
.about-content :deep(h3) {
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--wise-text);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.about-content :deep(h1) {
  font-size: 3.5rem;
}

.about-content :deep(h2) {
  font-size: 2.5rem;
}

.about-content :deep(h3) {
  font-size: 1.75rem;
}

.about-content :deep(p) {
  color: var(--wise-muted);
  line-height: 1.75;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.about-content :deep(ul),
.about-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.about-content :deep(li) {
  color: var(--wise-muted);
  line-height: 1.75;
  margin-bottom: 0.5rem;
}

.about-content :deep(a) {
  color: var(--wise-accent-foreground);
  text-decoration: underline;
}

.about-content :deep(a:hover) {
  color: var(--wise-text);
}

.about-content :deep(img) {
  max-width: 100%;
  border-radius: 30px;
  margin: 1.5rem 0;
  box-shadow: 0 0 0 1px var(--wise-border);
}

.about-content :deep(blockquote) {
  margin: 1.5rem 0;
  padding: 1.25rem 1.5rem;
  border-left: 4px solid var(--wise-accent);
  background: var(--wise-page);
  border-radius: 20px;
  color: var(--wise-text);
}

.about-content :deep(table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.5rem 0;
  border: 1px solid var(--wise-border);
  border-radius: 20px;
  overflow: hidden;
}

.about-content :deep(th),
.about-content :deep(td) {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--wise-border-soft);
  color: var(--wise-text);
}

.about-content :deep(th) {
  background: var(--wise-soft);
  color: var(--wise-accent-foreground);
  font-weight: 700;
}

.about-content :deep(tr:last-child td) {
  border-bottom: none;
}
</style>
