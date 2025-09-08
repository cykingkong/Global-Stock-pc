<template>
  <div class="user-detailmain w-full">
    <CHeader />
    <Breadcrumb />

    <div class="userDetail-content max-w-1300px mx-auto py-80px xs:w-full line-height-28px">
      <div v-html="articleInfo[locale == 'pt' ? 'es' : 'en']" v-if="articleInfo"></div>
    </div>
    <userSwiper :testimonials="swiperData" />
  </div>
</template>
<script setup>
import CHeader from '@/components/header.vue'
import userSwiper from '@/components/userSwiper.vue'
import { onMounted, ref } from 'vue'
import { Steps, Step } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'

// 国际化
const { t, locale } = useI18n()
// 如果需要样式
import '@arco-design/web-vue/es/steps/style/css.js'
import jsonData from './data.json'
import api from '@/api/api'

import Breadcrumb from '@/components/Breadcrumb.vue'

import { useCounterStore } from '@/stores/counter'

const useStore = useCounterStore()
const swiperData = ref(useStore.swiperList)
const current = ref(0)
const articleInfo = ref()
const getArticleInfo = async () => {
  api.get('/api/vote/voteArticleInfo', { params: { articleId: 31 } }).then((res) => {
    console.log(res)
    articleInfo.value = res.data.data
  })
}
onMounted(() => {
  getArticleInfo()
  // 随机从 jsonData.userList 中获取 4 条数据
})
</script>
<style scoped></style>