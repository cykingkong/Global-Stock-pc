<template>
  <div class="min-h-screen bg-[#EDEEF1] flex flex-col items-center px-6 py-16">
    <!-- Header Section -->
    <section class="text-center mb-14 mt-8">
      <h1 class="text-[#2D2D3A] font-bold text-5xl leading-tight tracking-tight mb-5">
        Become a crypto<br />trader in seconds
      </h1>
      <p class="text-[#9196A8] text-base font-normal">
        We've got everything you need to start trading.
      </p>
    </section>

    <!-- Cards Section -->
    <section class="flex flex-wrap justify-center gap-7 max-w-[1150px] w-full mb-14">
      <div
        v-for="card in cards"
        :key="card.title"
        class="bg-[#E8E9ED] rounded-2xl flex flex-col items-center px-8 pt-10 pb-10 w-[340px] min-h-[420px] transition-shadow duration-200"
      >
        <!-- Placeholder Image -->
        <div
          class="w-[160px] h-[160px] rounded-xl mb-8 flex items-center justify-center overflow-hidden select-none"
        >
          <img :src="card.image" :alt="card.title" class="w-full h-full object-contain" />
        </div>

        <!-- Title -->
        <h3 class="text-[#2D2D3A] font-bold text-lg mb-3 text-center">
          {{ card.title }}
        </h3>

        <!-- Description -->
        <p class="text-[#9196A8] text-sm leading-relaxed text-center mb-6 max-w-[260px]">
          {{ card.description }}
        </p>

        <!-- Button -->
        <button
          class="mt-auto border border-[#C5C7CE] border-solid bg-transparent rounded-full px-6 py-2.5 text-[#2D2D3A] text-sm font-medium cursor-pointer hover:bg-[#d9dae0] transition-colors duration-200"
        >
          {{ card.button }}
        </button>
      </div>
    </section>

    <!-- Contact Us Button -->
    <section class="mb-12">
      <button
        class="bg-[#4D6BF8] hover:bg-[#3B5BE6] text-white font-semibold text-base rounded-full px-10 py-3.5 border-none cursor-pointer shadow-md shadow-[#4D6BF8/30] transition-all duration-200"
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
