<template>
  <div class="min-h-screen bg-[#F4F5F6] flex flex-col items-center px-4 py-16">
    <!-- Hero Section -->
    <div class="flex flex-col items-center text-center mb-16">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 mb-6">
        <svg class="w-[32px] h-[32px]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M13.2972 0.687536C14.9825 -0.229179 17.0176 -0.229179 18.7029 0.687536L28.4731 6.00205C30.2935 6.99226 31.4267 8.89867 31.4267 10.971V21.029C31.4267 23.1013 30.2935 25.0077 28.4731 25.998L18.7029 31.3125C17.0176 32.2292 14.9825 32.2292 13.2972 31.3125L3.52693 25.998C1.70651 25.0077 0.573303 23.1013 0.573303 21.029L0.573303 10.971C0.573303 8.89867 1.70651 6.99226 3.52692 6.00205L13.2972 0.687536Z"
            fill="#3772FF" />
          <g filter="url(#filter0_d_3153_89)">
            <path
              d="M18.8608 8.3335C22.5427 8.3335 25.5278 11.3186 25.5278 15.0005C25.5277 18.6822 22.5426 21.6665 18.8608 21.6665C18.6673 21.6665 18.4759 21.6563 18.2866 21.6401C18.189 21.6558 18.0901 21.6665 17.9897 21.6665H11.1548L10.9136 21.6606C8.43969 21.5353 6.47237 19.4898 6.47217 16.9849C6.47217 14.3989 8.56886 12.3022 11.1548 12.3022C11.6814 12.3023 12.1872 12.3909 12.6597 12.5513C13.6358 10.0813 16.0438 8.33363 18.8608 8.3335ZM14.5815 20.1724L14.6294 20.1509C14.6242 20.1466 14.6189 20.1425 14.6138 20.1382C14.6032 20.1498 14.5922 20.1609 14.5815 20.1724Z"
              fill="url(#paint0_linear_3153_89)" />
          </g>
          <path
            d="M13.5362 1.12695C15.0725 0.291271 16.9276 0.291271 18.4639 1.12695L28.2344 6.44141C29.8937 7.34409 30.9267 9.08178 30.9268 10.9707V21.0293C30.9267 22.9182 29.8937 24.6559 28.2344 25.5586L18.4639 30.873C16.9276 31.7087 15.0725 31.7087 13.5362 30.873L3.76569 25.5586C2.10636 24.6559 1.0734 22.9182 1.0733 21.0293V10.9707C1.0734 9.08175 2.10636 7.34407 3.76569 6.44141L13.5362 1.12695Z"
            stroke="url(#paint1_linear_3153_89)" />
          <defs>
            <filter id="filter0_d_3153_89" x="2.47217" y="6.3335" width="27.0557" height="21.333"
              filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3153_89" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3153_89" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_3153_89" x1="21.6875" y1="9.12498" x2="13.6253" y2="21.6667"
              gradientUnits="userSpaceOnUse">
              <stop stop-color="white" />
              <stop offset="1" stop-color="#FCFCFD" stop-opacity="0.75" />
            </linearGradient>
            <linearGradient id="paint1_linear_3153_89" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#7EA4FF" stop-opacity="0.27" />
              <stop offset="1" stop-color="#1448C4" stop-opacity="0.42" />
            </linearGradient>
          </defs>
        </svg>

        <span class="text-xl font-semibold text-[#23262F] tracking-tight">Bitcloud</span>
      </div>

      <!-- Heading -->
      <h1 class="text-5xl md:text-6xl font-bold text-[#23262F] leading-tight max-w-xl mb-5 tracking-tight">
        {{ t('index.slideShow.title') }}
      </h1>

      <!-- Subtitle -->
      <p class="text-base text-[#777E90] font-normal">{{ t('index.slideShow.subtitle') }}</p>
    </div>

    <!-- Card Section with Arrows -->
    <div class="flex items-center w-full max-w-4xl gap-6 justify-between">
      <!-- Left Arrow -->
      <button
        class="w-10 h-10 flex items-center justify-center text-[#777E90] hover:text-[#23262F] transition-colors shrink-0 cursor-pointer bg-transparent border-none"
        aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
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
              {{ t('index.slideShow.cryptoNews') }}
            </span>
            <h2 class="text-2xl md:text-3xl font-bold text-[#23262F] leading-snug mb-4">
              {{ t('index.slideShow.communityTitle') }}
            </h2>
            <p class="text-sm leading-relaxed text-[#777E90] mb-8 max-w-xs">
              {{ t('index.slideShow.communityDesc') }}
            </p>
            <div>
              <button
                class="px-5 py-2.5 border border-[#E6E8EC] border-solid rounded-full text-sm font-semibold text-[#23262F] bg-transparent cursor-pointer hover:bg-[#F4F5F6] transition-colors">
                {{ t('index.slideShow.joinNow') }}
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
        aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
/* Smooth font rendering */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
