<template>
  <div class="bg-wise-page font-family-[Inter,system-ui,sans-serif] text-wise-text [font-feature-settings:'calt']">
    <!-- ==================== Section 2: Trade anywhere ==================== -->
    <section class="w-full rounded-[40px] border border-wise-border bg-wise-surface shadow-[0_0_0_1px_var(--wise-border)]">
      <div
        class="max-w-[1200px] mx-auto flex items-center justify-between min-h-[700px] px-8 py-20"
      >
        <!-- Left Content -->
        <div class="flex-1 max-w-[480px] pr-12">
          <h2
            class="mb-5 text-[44px] font-black leading-[0.92] tracking-[-0.04em] text-wise-text"
          >
            Trade anywhere
          </h2>
          <p class="mb-12 text-[18px] leading-[1.6] text-wise-muted">
            Anytime, anywhere. Trade crypto on your terms.
          </p>

          <!-- Appstore -->
          <div class="flex items-center gap-5 py-6 border-b border-wise-border">
            <div
              class="w-[52px] h-[52px] rounded-full bg-wise-text flex items-center justify-center flex-shrink-0"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.82 11.75 5.74 12.55 5.74C13.35 5.74 14.8 4.62 16.36 4.8C17.03 4.83 18.83 5.07 19.97 6.74C19.87 6.8 17.72 8.02 17.74 10.62C17.77 13.73 20.47 14.74 20.5 14.75C20.47 14.82 20.07 16.25 19.04 17.72L18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <p class="text-wise-muted text-[13px] font-normal mb-0.5">Download from</p>
              <p class="text-wise-text text-[20px] font-semibold leading-tight">Appstore</p>
            </div>
          </div>

          <!-- Google Play -->
          <div class="flex items-center gap-5 py-6 border-b border-wise-border">
            <div
              class="w-[52px] h-[52px] rounded-full bg-wise-accent text-wise-accentForeground flex items-center justify-center flex-shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div>
              <p class="text-wise-muted text-[13px] font-normal mb-0.5">Download from</p>
              <p class="text-wise-text text-[20px] font-semibold leading-tight">Google Play</p>
            </div>
          </div>
        </div>

        <!-- Right Illustration -->
        <img src="@/assets/download.png" alt="" class="w-[500px] object-contain block" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface CardItem {
  title: string
  description: string
  button: string
  emoji: string
  placeholderBg: string
}

const cards: CardItem[] = [
  {
    title: 'Buy & Sell Crypto',
    description:
      'We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.',
    button: 'Buy crypto',
    emoji: '💎',
    placeholderBg: 'linear-gradient(135deg, #d4d6db 0%, #c2c4ca 100%)',
  },
  {
    title: 'Trade Assets',
    description:
      'We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.',
    button: 'Trade now',
    emoji: '📊',
    placeholderBg: 'linear-gradient(135deg, #cde8ef 0%, #b8d9e6 100%)',
  },
  {
    title: 'Learn crypto',
    description:
      'We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.',
    button: 'Learn now',
    emoji: '🎓',
    placeholderBg: 'linear-gradient(135deg, #c8e8d8 0%, #b0dcc6 100%)',
  },
]
</script>

<style scoped>
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: inherit;
}
</style>
