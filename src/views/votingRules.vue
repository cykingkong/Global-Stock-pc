<template>
    <div class="user-detailmain w-full ">
        <CHeader />
        <Breadcrumb />

        <div class="userDetail-content max-w-1300px mx-auto py-80px xs:w-full">

            <div v-html="articleInfo[locale == 'pt' ? 'es' : 'en']" v-if="articleInfo"></div>
        </div>
        <userSwiper :testimonials="swiperData" />
    </div>
</template>
<script setup>
import CHeader from '@/components/header.vue'
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { Steps, Step } from '@arco-design/web-vue'
// 如果需要样式
import userSwiper from '@/components/userSwiper.vue'
import '@arco-design/web-vue/es/steps/style/css.js'
import jsonData from './data.json'
import api from '@/api/api'


import Breadcrumb from "@/components/Breadcrumb.vue";

import { useCounterStore } from '@/stores/counter'

const useStore = useCounterStore()
const swiperData = ref(useStore.swiperList);
const current = ref(0)
const { t, locale } = useI18n()

const articleInfo = ref()
const getArticleInfo = async () => {
    api.get('/api/vote/voteArticleInfo', { params: { articleId: 32 } }).then((res) => {
        console.log(res)
        articleInfo.value = res.data.data
    })
}
onMounted(() => {

    getArticleInfo()
})
</script>
<style scoped></style>