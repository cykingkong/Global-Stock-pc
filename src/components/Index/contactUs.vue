<template>
  <div class="min-h-screen bg-wise-page flex flex-col items-center px-6 py-16 text-wise-text [font-feature-settings:'calt']">
    <!-- Header Section -->
    <section class="text-center mb-14 mt-8">
      <h1 class="mb-5 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-wise-text">
        Become a crypto<br />trader in seconds
      </h1>
      <p class="text-[18px] leading-[1.6] text-wise-muted font-normal">
        We've got everything you need to start trading.
      </p>
    </section>

    <!-- Cards Section -->
    <section class="flex flex-wrap justify-center gap-7 max-w-[1150px] w-full mb-14">
      <div
        v-for="card in cards"
        :key="card.title"
        class="bg-wise-surface rounded-[30px] border border-wise-border shadow-[0_0_0_1px_var(--wise-border)] flex flex-col items-center px-8 pt-10 pb-10 w-[340px] min-h-[420px] transition-all duration-200"
      >
        <!-- Placeholder Image -->
        <div
          class="w-[160px] h-[160px] rounded-[30px] bg-wise-soft mb-8 flex items-center justify-center overflow-hidden select-none"
        >
          <img :src="card.image" :alt="card.title" class="w-full h-full object-contain" />
        </div>

        <!-- Title -->
        <h3 class="mb-3 text-center text-lg font-semibold text-wise-text">
          {{ card.title }}
        </h3>

        <!-- Description -->
        <p class="mb-6 max-w-[260px] text-center text-sm leading-relaxed text-wise-muted">
          {{ card.description }}
        </p>

        <!-- Button -->
        <button
          class="mt-auto rounded-[9999px] border border-wise-border bg-wise-surface px-6 py-2.5 text-sm font-semibold text-wise-text cursor-pointer transition-all duration-200 ease-out hover:bg-wise-hover hover:text-wise-accentForeground hover:scale-[1.05]"
        >
          {{ card.button }}
        </button>
      </div>
    </section>

    <!-- Contact Us Button -->
    <section class="mb-12">
      <button
        class="rounded-[9999px] bg-wise-accent px-10 py-3.5 text-base font-semibold text-wise-accentForeground border-none cursor-pointer shadow-[0_0_0_1px_var(--wise-border)] transition-all duration-200 ease-out hover:scale-[1.05] active:scale-[0.95]"
      >
        Contact Us
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import index1 from '@/assets/index-1.png'
import index2 from '@/assets/index-2.png'
import index3 from '@/assets/index-3.png'

interface CardItem {
  title: string
  description: string
  button: string
  image: string
}

const cards: CardItem[] = [
  {
    title: 'Buy & Sell Crypto',
    description:
      'We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.',
    button: 'Buy crypto',
    image: index1,
  },
  {
    title: 'Trade Assets',
    description:
      'We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.',
    button: 'Trade now',
    image: index2,
  },
  {
    title: 'Learn crypto',
    description:
      'We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.',
    button: 'Learn now',
    image: index3,
  },
]
</script>

<style scoped>
/* Ensure smooth font rendering */
h1,
h3,
p,
button {
  font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
