<template>
  <div class="IndexView min-h-screen bg-wise-page text-wise-text">
    <Nav></Nav>
    <main class="space-y-10 pb-10 md:space-y-14 md:pb-14">
      <IndexHeader></IndexHeader>
      <IndexMarket></IndexMarket>
      <IndexContactUs></IndexContactUs>
      <IndexAppDownload />
      <IndexSlideShow />
      <IndexHowItWork />
    </main>
    <IndexFooter />
  </div>
</template>
<script setup>
import { ref } from 'vue'

import Nav from '@/components/Nav.vue'
import IndexHeader from '@/components/Index/header.vue'
import IndexMarket from '@/components/Index/market.vue'
import IndexContactUs from '@/components/Index/contactUs.vue'
import IndexAppDownload from '@/components/Index/appDownload.vue'
import IndexSlideShow from '@/components/Index/slideShow.vue'
import IndexHowItWork from '@/components/Index/howitwork.vue'
import IndexFooter from '@/components/Index/footer.vue'
</script>
