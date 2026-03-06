<template>
  <div class="min-h-screen bg-[#F4F5F6] flex flex-col items-center px-4 py-16">
    <!-- Hero Section -->
    <div class="flex flex-col items-center text-center mb-16">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 mb-6">
        <div
          class="w-9 h-9 rounded-lg bg-[#3772FF] flex items-center justify-center shadow-md shadow-[#3772FF/30]"
        >
          <div class="w-4.5 h-4.5 rounded-sm bg-white/90 rotate-45" />
        </div>
        <span class="text-xl font-semibold text-[#23262F] tracking-tight">Bitcloud</span>
      </div>

      <!-- Heading -->
      <h1
        class="text-5xl md:text-6xl font-bold text-[#23262F] leading-tight max-w-xl mb-5 tracking-tight"
      >
        Stay in the know on crypto with BitCloud
      </h1>

      <!-- Subtitle -->
      <p class="text-base text-[#777E90] font-normal">A creative agency that lead and inspire</p>
    </div>

    <!-- Card Section with Arrows -->
    <div class="flex items-center w-full max-w-4xl gap-6 justify-between">
      <!-- Left Arrow -->
      <button
        class="w-10 h-10 flex items-center justify-center text-[#777E90] hover:text-[#23262F] transition-colors shrink-0 cursor-pointer bg-transparent border-none"
        aria-label="Previous"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <!-- Card -->
      <div class="flex-1 bg-white rounded-3xl shadow-lg shadow-black/5 overflow-hidden">
        <div class="flex flex-col md:flex-row items-stretch">
          <!-- Left Content -->
          <div class="flex flex-col justify-center p-10 md:p-12 md:w-1/2">
            <span class="text-xs font-bold uppercase tracking-widest text-[#4C3F91] mb-4">
              Crypto News
            </span>
            <h2 class="text-2xl md:text-3xl font-bold text-[#23262F] leading-snug mb-4">
              Be Part of our Global Community
            </h2>
            <p class="text-sm leading-relaxed text-[#777E90] mb-8 max-w-xs">
              Let's stay in touch. Join our communities to keep up with the BitCloud team and our
              traders from across the world.
            </p>
            <div>
              <button
                class="px-5 py-2.5 border border-[#E6E8EC] border-solid rounded-full text-sm font-semibold text-[#23262F] bg-transparent cursor-pointer hover:bg-[#F4F5F6] transition-colors"
              >
                Join now
              </button>
            </div>
          </div>

          <!-- Right Illustration -->
          <img src="@/assets/img.png" alt="" class="w-[352px] block object-cover" />
        </div>
      </div>

      <!-- Right Arrow -->
      <button
        class="w-10 h-10 flex items-center justify-center text-[#777E90] hover:text-[#23262F] transition-colors shrink-0 cursor-pointer bg-transparent border-none"
        aria-label="Next"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// No reactive state needed for this static layout
// Future: Add carousel logic for arrow navigation
</script>

<style scoped>
/* Smooth font rendering */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
