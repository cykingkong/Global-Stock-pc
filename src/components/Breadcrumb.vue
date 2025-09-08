<template>
    <div class="Breadcrumb w-full relative">
        <div
            class="Breadcrumb-content max-w-1300px mx-auto py-80px absolute top-50% left-50% transform -translate-x-50% -translate-y-50% z-10 text-center">
            <div class="text-white font-size-30px font-bold">
                {{ 'Electioneer' }}
            </div>
            <!-- <div class="text-white font-size-20px mt-2">
                {{ $t('breadcrumb.subtitle') }} {{ title }}
            </div> -->
        </div>
        <div class="absolute top-0 left-0 w-full h-full bg-#141433 opacity-80"></div>

    </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    title: {
        type: String,
        default: 'Breadcrumb Title'
    }
})
</script>
<style scoped>
.Breadcrumb {
    padding: 20px;
    background-image: url('@/assets/lunbo1.jpeg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    min-height: 225px;
    position: relative;
}
</style>