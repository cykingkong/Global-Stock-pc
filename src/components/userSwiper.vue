<template>
    <div class="swiper-main w-full bg-#ba1c24 py-80px">
        <div class="swiper-content max-w-1300px mx-auto flex text-align-center flex-col color-#fff">
            <div class="swiper-title font-size-26px">{{ title }}</div>
            <Swiper :modules="[Autoplay, Navigation]" :slides-per-view="1" :loop="true" :autoplay="autoplay"
                :pagination="{
                    clickable: true,
                    bulletClass: 'custom-bullet',
                    bulletActiveClass: 'custom-bullet-active',
                    horizontalClass: 'custom-pagination',
                }" class="hero-swiper w-full relative" ref="swiperRef" @swiper="onSwiper">
                <SwiperSlide v-for="(slide, index) in testimonials" :key="index" class="w-full py-20px">
                    <div class="slide-item w-full">
                        <div class="avatar w-80px h-80px mb-20px rounded-full overflow-hidden bg-white mx-auto p-4px">
                            <img class="w-full h-full object-cover rounded-full" :alt="slide.name"
                                :src="slide.avatar" />
                        </div>

                    </div>
                    <div class="name font-size-24px font-weight-600 mb-6px">{{ slide.name }}</div>

                </SwiperSlide>

                <div
                    class="w-full px-80px flex justify-between items-center absolute bottom-50% left-50% transform -translate-x-50% translate-y-50% z-10">
                    <div class="swiper-next-btn px-12 py-24 rounded-8px bg-#141433 cursor-pointer"
                        @click="handleClickSwiperBtn(-1)">
                        <icon-left />
                    </div>
                    <div class="swiper-prev-btn px-12 py-24 rounded-8px bg-#141433 cursor-pointer"
                        @click="handleClickSwiperBtn(1)">
                        <icon-right />
                    </div>
                </div>
            </Swiper>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'

// Props
const props = defineProps({
    title: {
        type: String,
        default: 'Electioneer People'
    },
    testimonials: {
        type: Array,
        default: () => [

        ]
    },
    autoplay: {
        type: [Boolean, Object],
        default: false
    }
})

// Emits
const emit = defineEmits(['swiper-ready', 'slide-change'])

const swiperRef = ref(null)
const swiperInstance = ref(null)

const onSwiper = (swiper) => {
    swiperInstance.value = swiper
    emit('swiper-ready', swiper)
}

const handleClickSwiperBtn = (num) => {
    if (!swiperInstance.value) {
        console.warn('Swiper 实例尚未初始化')
        return
    }

    try {
        if (num > 0) {
            swiperInstance.value.slideNext()
        } else {
            swiperInstance.value.slidePrev()
        }
        emit('slide-change', swiperInstance.value.activeIndex)
    } catch (error) {
        console.error('Swiper 操作失败:', error)
    }
}
</script>
