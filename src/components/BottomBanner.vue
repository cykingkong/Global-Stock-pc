<template>
  <div data-v-09e46ff6="" data-v-044f8dd1=""
    class="banner relative h-[360px] rounded-[20px] overflow-hidden xl:mx-[-72px] border border-[rgba(255,255,255,0.1)]">
    <img data-v-09e46ff6=""
      class="banner-bg absolute left-0 top-0 bottom-0 right-0 m-auto w-full aspect-[1920/1080] min-h-[360px] object-cover transition-all duration-1000"
      src="@/assets/banner-bg-light-CAA13-rR.png" alt="">
    <div data-v-09e46ff6=""
      class="absolute left-0 top-0 w-full h-full px-[28px] lg:px-[34px] xl:px-[72px] flex flex-col lg:flex-row justify-center lg:justify-between items-start lg:items-center gap-[10px_60px] bg-[rgba(0,0,0,0.3)]">
      <h4 data-v-09e46ff6=""
        class="text-white font-Sans text-[24px]/[120%] lg:text-[36px]/[120%] font-medium tracking-[-0.48px] max-w-[810px]">
        <span data-v-09e46ff6="" class="block w-full">{{ t('achievements.miniBannerTitle') }}</span>
      </h4><a data-v-09e46ff6=""
        class="flex-shrink-0 px-[30px] py-[17px] bg-white rounded-[12px] font-Inter text-[#111114] text-[16px]/[20px] font-medium hover:text-[#7532FF] duration-500 transition-shadows shadow-[0_0_0_3px_rgba(255,255,255,0.25)] hover:shadow-[0_0_0_3px_rgba(117,50,255,0.75)]"
        href="https://cp.neex.com/register/index?sourceName=website&amp;language=zh-CN" target="_blank">{{
          t('achievements.miniBannerButton') }}</a>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.sonUl {
  margin-right: 10px;
}
</style>