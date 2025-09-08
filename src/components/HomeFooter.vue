<template>
    <div class="w-[100vw] h-[full] py-[60px] md:py-[100px] overflow-hidden">
        <div
            class="w-[90%] md:w-[90%] xl2:w-[1200px] xl:w-[83%] m-[auto] min-h-[700px] lg:min-h-[600px] md:rounded-[20px] divbgBox h2-animate">
            <div class="relative z-0 w-[90%] md:w-[75%] m-[auto] pt-[40px] md:pt-[80px] lg:pt-[148px]">
                <div class="bgBox">
                    <h2 class="text-white text-[36px] lg:text-[46px] leading-[1.3] font-Sans font-[600]">
                        {{ t('home.neex_was') }}</h2>
                    <p class="tipBox opacity-1 mt-[20px] text-[20px] font-Inter leading-[1.2] text-white">
                        {{ t('home.foundedNeexDes') }} </p>
                </div>
            </div>
            <div class="imgMark h-[112%] w-[100vw]">
                <img src="@/assets/foundBg-Dhd-4gHe.png" class="w-full h-full object-cover">
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.divbgBox {
    background: url('@/assets/theearthFooter-D7CkQt7h.jpg') no-repeat center;
    background-size: cover;
    position: relative;
}

.imgMark {
    position: absolute;
    top: -30px;
    left: -8.5vw;
    z-index: 2;
}
</style>