<template>
  <div class="DGFortis-homepage w-full">
    <!-- 导航栏 -->
    <CHeader />

    <!-- 主要内容区域 -->
    <main>
      <div class="w-full">
        <div class="bg-im">
          <!-- swiper区域 -->
          <section class="hero-section relative h-full hidden md:block">
            <Swiper :modules="[Autoplay]" :slides-per-view="1" :loop="true" :autoplay="false" :pagination="{
              clickable: true,
              bulletClass: 'custom-bullet',
              bulletActiveClass: 'custom-bullet-active',
              horizontalClass: 'custom-pagination',
            }" class="hero-swiper h-full">
              <SwiperSlide v-for="(slide, index) in []" :key="index">
                <div class="hero-slide h-full text-align-center">
                  <div class="mid-box h-400px flex flex-col justify-center items-center">
                    <div class="slide-mid-text font-size-24px" :class="[slide.mb]" v-if="slide && slide.midtext"></div>
                    <div class="t2 font-size-60px color-#fff font-weight-600">
                      {{ slide.midtext }}
                    </div>
                    <!-- <p class="color-#fff">Gray eel-catfish longnose whiptail catfish smalleye squaretail queen danio
                      unicorn
                      fish
                      shortnose greeneye fusilier fish silver carp nibbler sharksucker tench lookdown catfishf</p> -->
                    <!-- <div
                    class="btn color-#fff font-size-16px font-weight-600 flex items-center gap-10px px-12px py-12px rounded-12px mt-30px bg-#ba1c24 w-120px mx-auto ">
                    Explore
                    <svg t="1748676000337" class="icon w-8px h-8px" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="3426" width="200" height="200">
                      <path
                        d="M343.893333 156.416a85.333333 85.333333 0 0 0-133.12 70.741333v569.685334a85.333333 85.333333 0 0 0 131.669334 71.68L773.973333 590.165333a85.333333 85.333333 0 0 0 1.536-142.506666l-431.786666-291.242667z"
                        p-id="3427" fill="#ffffff"></path>
                    </svg>

                  </div> -->
                  </div>
                  <!-- <img :src="slide.image" :alt="slide.title" class="w-full h-full" /> -->
                </div>
              </SwiperSlide>
              <SwiperSlide key="video" class="relative">
                <div class="hero-slide h-full text-align-center">
                  <video src="../assets/bannerVideo.mp4" class="w-full h-full" autoplay="true" muted loop></video>
                </div>
                <!-- 倒计时 -->
                <div class="time-out-content w-full pb-20px px-12 absolute bottom-20% left-0">
                  <div class="time-out-main w-1300px mx-auto flex justify-between items-center color-#fff">
                    <div class="time-out-left flex flex-col col-8">
                      <div class="font-size-24px font-weight-600 t2">{{ t('time1') }}</div>
                      <div class="font-size-32px font-weight-600 t2">{{ t('time2') }}</div>

                      <div class="time-box flex items-center justify-end just gap-10px mt-20px">
                        <div
                          class="time-item flex flex-col w-100px h-100px items-center justify-center rounded-10px bg-#fff p-20px color-#000 lg:w-80% md:w-80% sm:w-100% w-120px gap-6px"
                          v-for="(item, index) in countdownArr" :key="index">
                          <div class="font-size-24px font-weight-600">{{ item.num }}</div>
                          <div class="font-size-14px font-weight-600">{{ t(item.title) }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- <div class="blob play-btn ">
              <div class="popup-video rounded-full w-75px h-75px  flex items-center justify-center bg-#ba1c24"> <svg
                  t="1748676000337" class="icon w-20px h-20px" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3426" width="200" height="200">
                  <path
                    d="M343.893333 156.416a85.333333 85.333333 0 0 0-133.12 70.741333v569.685334a85.333333 85.333333 0 0 0 131.669334 71.68L773.973333 590.165333a85.333333 85.333333 0 0 0 1.536-142.506666l-431.786666-291.242667z"
                    p-id="3427" fill="#ffffff"></path>
                </svg></div>
            </div> -->
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </section>
        </div>
        <!-- 倒计时 -->
        <div class="time-out-content w-full pb-20px px-12" v-if="false">
          <div class="time-out-main w-1300px mx-auto flex justify-between items-center color-#fff">
            <div class="time-out-left flex flex-col col-8">
              <div class="font-size-24px font-weight-600 t2">{{ t('time1') }}</div>
              <div class="font-size-32px font-weight-600 t2">{{ t('time2') }}</div>

              <div class="time-box flex items-center justify-end just gap-10px mt-20px">
                <div
                  class="time-item flex flex-col w-100px h-100px items-center justify-center rounded-10px bg-#fff p-20px color-#000 lg:w-80% md:w-80% sm:w-100% w-120px gap-6px"
                  v-for="(item, index) in countdownArr" :key="index">
                  <div class="font-size-24px font-weight-600">{{ item.num }}</div>
                  <div class="font-size-14px font-weight-600">{{ t(item.title) }}</div>
                </div>
              </div>
            </div>
            <!-- <div class="blob play-btn ">
              <div class="popup-video rounded-full w-75px h-75px  flex items-center justify-center bg-#ba1c24"> <svg
                  t="1748676000337" class="icon w-20px h-20px" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3426" width="200" height="200">
                  <path
                    d="M343.893333 156.416a85.333333 85.333333 0 0 0-133.12 70.741333v569.685334a85.333333 85.333333 0 0 0 131.669334 71.68L773.973333 590.165333a85.333333 85.333333 0 0 0 1.536-142.506666l-431.786666-291.242667z"
                    p-id="3427" fill="#ffffff"></path>
                </svg></div>
            </div> -->
          </div>
        </div>
        <!-- 列表 -->
        <div class="list-content bg-#fff px-12px">
          <div class="list-main max-w-1300px py-80px mx-auto flex justify-between items-center color-#000">

            <div class="list-left flex flex-col col-8 w-full">
              <div class="font-size-24px font-weight-600 w-full">{{ t('t1') }}</div>
              <div class="tab-box flex gap-20px py-20px">
                <a-button :type="active == index ? 'primary' : 'outline '" v-for="(item, index) in tabs" :key="index"
                  @click="handleClickSort(index)">{{ t(item.name) }}</a-button>
              </div>
              <a-spin :loading="loading" tip="loading..." class="w-full">

                <a-row :gutter="[16, 16]" class="w-full">
                  <a-empty class="w-full" v-if="!voteData.length" :description="'noData'"></a-empty>
                  <a-col :span="8" :xs="12" :sm="12" :md="8" :lg="4" :xl="4" v-for="(user, index) in voteData"
                    :key="index">
                    <a-card hoverable>
                      <template #cover>
                        <div :style="{
                          overflow: 'hidden',
                        }" class="w-full relative userImg px-12 pt-12 h-220px">
                          <img class="w-full h-full object-cover" alt="dessert" :src="user.avatar" v-if="user.avatar" />
                          <div @click="handleClickDetail(user)"
                            class="absolute bottom-btn bottom-[-100px] left-0 w-full bg-red py-12px text-align-center transition-all duration-300 ease-in-out hover:bg-#ba1c24 cursor-pointer">
                            <div class="w-full text-#fff">{{ t('detail') }}</div>
                          </div>
                        </div>
                      </template>
                      <a-card-meta title="" description="This is the description">
                        <template #description>
                          <div class="flex-col flex justify-center items-center gap-12px">
                            <div class="flex justify-between items-center w-full">
                              <div class="l white-space-nowrap">
                                {{ t('cardT1') }}：{{ user.votes || 0 }}
                              </div>
                              <div class="r white-space-nowrap">
                                {{ t('cardT2') }}：{{ index + 1 }}
                              </div>
                            </div>
                            <div class="name font-size-24px font-weight-600 h-80px">
                              {{ user.id }}.{{ user.name }}
                            </div>
                            <div class="name font-size-18px font-weight-600">
                              {{ t('cardT3') }}：{{ user.yieldRate || 0 }}%
                            </div>
                            <a-button class="" :type="user.isVote ? 'primary' : 'dashed'"
                              @click="handleClickBtn(user)">{{
                                t('cardT4') }}</a-button>
                          </div>
                        </template>
                      </a-card-meta>
                    </a-card>
                  </a-col>
                </a-row>
              </a-spin>

            </div>
            <div class="list-right flex items-center col-4"></div>
          </div>
        </div>
        <!-- swiper -->
        <userSwiper :testimonials="swiperData" />
      </div>

      <!-- 特色功能区域 -->
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, ChevronDown, Shield, Zap, BarChart, Apple, Smartphone } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import api from '@/api/api'
import CHeader from '@/components/header.vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Icon, Message, Spin } from '@arco-design/web-vue'
import { showSuccessToast, showFailToast } from 'vant'
import { useCounterStore } from '@/stores/counter'

import userSwiper from '@/components/userSwiper.vue'

import dayjs from 'dayjs'
// import jsonData from './data.json'
// 如果需要样式
import '@arco-design/web-vue/es/steps/style/css.js'
import duration from 'dayjs/plugin/duration'

// 启用 duration 插件
dayjs.extend(duration)
const uuid = ref('')
const router = useRouter()
import banner1 from '@/assets/lunbo2.jpg'
// import banner2 from '@/assets/banner2.jpg'
const swiperRef = ref(null)
const swiperInstance = ref(null)
const { t, locale } = useI18n()
const loading = ref(false)
const swiperData = ref([])
const isWeb = 'https://m.dgfortis.com'
const isIos = 'https://apps.apple.com/us/app/dg-fortis/id6743782901'
const isAndroidUrl = 'https://play.google.com/store/apps/details?id=com.oxn.fortis.dg'
const Urlopen = () => {
  window.location.href = isWeb
}
const tabs = ref([
  { name: 'tab1', key: '' },
  { name: 'tab2', key: 'votes' },
  { name: 'tab3', key: 'yieldRate' },
])
const voteData = ref([])
const active = ref(0)
const countdownArr = ref([
  {
    title: 'Days',
    i18n: 'days',
    num: 0,
  },
  {
    title: 'Hours',
    i18n: 'hours',
    num: 0,
  },
  {
    title: 'Minutes',
    i18n: 'minutes',
    num: 0,
  },
  {
    title: 'Seconds',
    i18n: 'seconds',
    num: 0,
  },
])

const timer = ref(null)
const isExpired = ref(false)
const useStore = useCounterStore()
// 更新倒计时
const updateCountdown = () => {
  const now = dayjs()
  const endDate = dayjs(configData.value.endDate)

  // 检查是否已过期
  if (now.isAfter(endDate)) {
    isExpired.value = true
    clearTimer()
    // 重置所有数值为0
    countdownArr.value.forEach((item) => {
      item.num = 0
    })
    return
  }

  // 计算剩余时间
  const diff = endDate.diff(now)
  const durationObj = dayjs.duration(diff)

  // 更新数组
  countdownArr.value[0].num = Math.floor(durationObj.asDays()) // Days
  countdownArr.value[1].num = durationObj.hours() // Hours
  countdownArr.value[2].num = durationObj.minutes() // Minutes
  countdownArr.value[3].num = durationObj.seconds() // Seconds
}
const getAcitveConfig = () => {
  api.get('/api/vote/voteActivityInfo', { params: { activityId: 1 } }).then((res) => {
    if (res.data.code == 200) {
      console.log(res.data)
      configData.value = res.data.data
      startCountdown()
    }
  })
}
const getVoteUserList = (sort = {}) => {
  loading.value = true
  let params = {
    uuid: uuid.value,
    pageIndex: 1,
    pageSize: 100,
    ...sort,
  }
  api.get('/api/vote/voteUserGrid', { params: params }).then((res) => {
    if (res.data.code == 200) {
      voteData.value = res.data.data.rows || []
      if (swiperData.value.length == 0) {
        let userListDeepClone = JSON.parse(JSON.stringify(res.data.data.rows))
        swiperData.value = userListDeepClone.sort(() => Math.random() - 0.5).slice(0, 4)
        useStore.setSwiperList(swiperData.value)
      }
    }
    loading.value = false
  })
  loading.value = false
}
const init = async () => {
  await getAcitveConfig()
  await getUuid()
}
const getUuid = () => {
  api.get('/api/common/uuid').then(async (res) => {
    uuid.value = res.data.data.uuid
    useStore.setUuid(res.data.data.uuid)
    await getVoteUserList({
      orderKey: 'votes',
      orderSort: 'desc',
    })
  })
}
// 开始倒计时
const startCountdown = () => {
  updateCountdown()
  timer.value = setInterval(() => {
    updateCountdown()
  }, 1000)
}

// 清除定时器
const clearTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const cacheVoteData = ref([])
const cacheVoteData2 = ref([])
const handleClickSort = (index) => {
  active.value = index
  loading.value = true
  if (index == 0) {
    getVoteUserList({
      orderKey: 'votes',
      orderSort: 'desc',
    })
  } else {
    // p:"orderKey" json:"orderKey" dc:"排序字段"
    let sort = {
      orderKey: tabs.value[index].key,
      orderSort: 'desc',
    }
    getVoteUserList(sort)
  }
  setTimeout(() => {
    loading.value = false
  }, 800)
}
// 获取 Swiper 实例
const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}
const handleClickDetail = (user) => {
  localStorage.setItem('userDetail', JSON.stringify(user))
  router.push('/userDetail')
}
const handleClickSwiperBtn = (num) => {
  console.log('num', num, swiperRef.value)
  try {
    if (num > 0) {
      swiperInstance.value.slideNext()
    } else {
      swiperInstance.value.slidePrev()
    }
  } catch (error) {
    console.error('Swiper 操作失败:', error)
  }
}
//需要判断当前用户是安卓还是苹果,如果是安卓的话,则打开安卓的下载链接,如果是苹果的话,则打开苹果的下载链接
const isDownload = () => {
  if (navigator.userAgent.indexOf('Android') > -1) {
    window.location.href = isAndroidUrl
  } else {
    window.location.href = isIos
  }
}
const configData = ref()
// 语言切换
const languages = [
  // { code: 'zh-CN', name: '简体中文' },
  // { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português ' },
  { code: 'es', name: 'Español ' },

]

const handleClickBtn = (item) => {
  if (!item.isVote) {
    return
  }
  let params = {
    uuid: uuid.value,
    id: item.id,
  }
  api.post('/api/vote/voteUser', params).then((res) => {
    if (res.data.code == 10012) {
      showFailToast(t('toast1'))
      return
    }
    if (res.data.code == 200) {
      console.log(res.data)
      showSuccessToast(t('toast2'))
      getVoteUserList()
      return
    }
  })
  // 判断是否已经投过票了,如果已经投过票了,则弹出提示框,提示用户已经投过票了

  item.votes = (item.votes || 0) + 1 // 增加投票数
  loading.value = true
  item.isVoted = true // 标记为已投票
  let votesNumArr = voteData.value.map((user) => {
    return { votes: user.votes, isVoted: user.isVoted }
  })
  // 将投票后的json 存入localstorage
  localStorage.setItem('voteData', JSON.stringify(votesNumArr))
  // 模拟异步请求
  // Message.success(t('toast2'))

  setTimeout(() => {
    loading.value = false
  }, 800)
}
// 轮播数据
// const slides = [
//   // {
//   //   title: t('hero.slide1.title'),
//   //   subtitle: t('hero.slide1.subtitle'),
//   //   image: video1,
//   //   midtext: '',
//   // },
//   // {
//   //   title: t('hero.slide2.title'),
//   //   subtitle: t('hero.slide2.subtitle'),
//   //   image: banner2,
//   //   size: '72px',
//   //   mb: 'mb-[20px]',
//   //   btnText: t('home.banner2Title'),
//   //   midtext: t('home.banner2Btn'),
//   // },
//   {
//     title: t('Around the world.'),
//     t2: 'Help Us Make A Diffrence In This World',
//     subtitle: t('Around the world.'),
//     image: banner1,
//     size: '46px',
//     size1: '42px',
//     size2: '32px',
//     size3: '26px',
//     size4: '24px',
//     btnText: t('normal.learnMore'),
//     mb: 'mb-[20px]',

//     // midtext: t('Electioneer'),
//   },
//   // {
//   //   title: t('hero.slide4.title'),
//   //   subtitle: t('hero.slide4.subtitle'),
//   //   size: '46px',
//   //   size1: '42px',
//   //   size2: '32px',
//   //   size3: '26px',
//   //   size4: '24px',
//   //   mb: 'mb-[40px]',

//   //   btnText: t('home.banner4Btn'),
//   //   image: banner4,
//   //   midtext: t('home.banner4Title'),
//   // },
// ]
onMounted(() => {
  // voteData.value = jsonData.userList
  // cacheVoteData.value = jsonData.userList
  // cacheVoteData2.value = jsonData.userList
  // let userListDeepClone = JSON.parse(JSON.stringify(jsonData.userList))
  // 随机从 jsonData.userList 中获取 4 条数据
  // 如果localstorage里面有投票数据,则从localstorage里面获取投票数据

  init()
})
onUnmounted(() => {
  clearTimer()
})
</script>

<style>
/* 将样式移到非 scoped 块中，使其全局生效 */
.custom-pagination {
  position: absolute;
  bottom: 40px !important;
  left: 50% !important;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  z-index: 10;
  width: auto !important;
}

.custom-bullet {
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.6;
  margin: 0 !important;
  background: transparent;
}

.custom-bullet-active {
  opacity: 1;
  background: #fff !important;
}
</style>

<style scoped>
/* 基础样式 */
.DGFortis-homepage {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  color: #333;
  background-color: #fff;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  /* background-image: url('@/assets/lunbo2.jpg'); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.container {
  width: 100%;
  /* max-width: 1200px; */
  margin: 0 auto;
  padding: 0 2rem;
}

/* 按钮样式 */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-register {
  background-color: #f8f9fa;
  border: none;
  /* color: #fff; */
}

.btn-login {
  background-color: transparent;
  border: 1px solid #1a73e8;
  color: #1a73e8;
}

.btn-primary {
  background-color: #1a73e8;
  border: none;
  color: #fff;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid #1a73e8;
  color: #1a73e8;
}

/* 头部导航 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo-icon {
  width: 150px;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
}

.main-nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.main-nav a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.right-nav {
  display: flex;
  align-items: center;
  /* gap: 1rem; */
}

.language-selector {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.language-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 120px;
  color: #000;
}

.language-option {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.language-option:hover {
  background-color: #f5f5f5;
}

/* 英雄区域 */
.hero-section {
  /* background: #fff; */
}

.hero-slide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  /* background-image: url('@/assets/earth.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; */
  /* padding: 4rem 2rem; */
  /* min-height: calc(100vh - 80px); */
}

.hero-slide img {
  object-fit: cover;
  object-position: center;
}

.mid-box {
  position: absolute;
  top: 50%;
  z-index: 1;
  left: 50%;
  transform: translate(-50%, -50%);
}

.slide-mid-text {
  /* font-size: 46px; */
  color: #fff;
  text-align: center;
  /* 文字阴影 */
}

.t2 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 1;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
  line-height: 1.2;
}

.hero-content p {
  font-size: 18px;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

/* Swiper 自定义样式 */
:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: #ddd;
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: #1a73e8;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #1a73e8;
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 20px;
}

/* 特色功能区域 */
.features-section {
  padding: 6rem 0;
  background: #f8f9fa;
}

.features-section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 4rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: #e8f0fe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.feature-icon .icon {
  color: #1a73e8;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* 数据统计区域 */
.stats-section {
  padding: 4rem 0;
  background: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 16px;
}

/* 下载区域 */
.download-section {
  padding: 6rem 0;
  background: #f8f9fa;
}

.download-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.download-content h2 {
  font-size: 36px;
  margin-bottom: 1rem;
  color: #333;
}

.download-content p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 18px;
}

.download-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.download-buttons .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
}

/* Cookie 横幅 */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 1rem 0;
  z-index: 1000;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.cookie-banner .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.cookie-content {
  flex: 1;
}

.cookie-content h3 {
  font-size: 16px;
  margin-bottom: 0.5rem;
  color: #333;
}

.cookie-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.cookie-content a {
  color: #1a73e8;
  text-decoration: none;
}

.small-text {
  font-size: 12px;
  color: #999;
}

.cookie-actions {
  display: flex;
  gap: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-nav {
    display: none;
  }

  .right-nav .btn-register,
  .right-nav .btn-login {
    display: none;
  }

  .hero-slide {
    flex-direction: column;
    /* padding: 2rem 1rem; */
    text-align: center;
  }

  .hero-content {
    max-width: 100%;
    margin-bottom: 2rem;
  }

  .hero-content h1 {
    font-size: 32px;
  }

  .hero-content p {
    font-size: 16px;
  }

  .hero-image {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .cookie-banner .container {
    flex-direction: column;
  }

  .cookie-actions {
    width: 100%;
    justify-content: space-between;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .download-buttons {
    flex-direction: column;
  }
}

.bg-primary {
  background-color: #7532ff;
}

.text-primary {
  color: #7532ff !important;
}

.slide-btn {
  margin: 0 auto;
  display: block;
}

.customGradient {
  background: linear-gradient(187deg, #111114 2.3%, #11111400 80.63%);
}

.divbgBox {
  /* background: url('@/assets/theearthFooter-D7CkQt7h.jpg') no-repeat center; */
  background-size: cover;
  position: relative;
}

.imgMark {
  position: absolute;
  top: -30px;
  left: -8.5vw;
  z-index: 2;
}

.customImg1[data-v-4613466f] {
  width: 332px;
  transform: scale(2.2);
}

.bg-barp-colors {
  background-color: #f8f9fa;
}

.bg-black-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.waterfall-container {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.waterfall-item {
  position: absolute;
  width: 384px;
  box-sizing: border-box;
  box-shadow: inset 0 -1px 1px #54c5f133, inset 0 1px 2px #ffffffb3;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

@media only screen and (max-width: 768px) {
  .waterfall-item {
    width: 100%;
    padding: 17px 21px;
    position: static;
    margin-bottom: 25px;
    height: auto !important;
  }
}

@media only screen and (max-width: 768px) {
  .boxHeight {
    height: var(--a65da516);
  }
}

@media only screen and (max-width: 1130px) {
  .isPlat .isPlatform {
    flex-direction: column;
    gap: 60px;
  }
}

@media only screen and (max-width: 1548px) {
  :deep(.swiperSlide) {
    height: 870px !important;
  }
}

@media only screen and (max-width: 1130px) {
  .isPlat .isPlatform .isPlatform-item {
    height: 87px;
    text-align: center;
    font-size: 24px;
  }
}

@media only screen and (max-width: 1130px) {
  .isFrame {
    flex-wrap: wrap;
    align-content: stretch;
  }
}

.isBox_show {
  box-shadow: 7px 13px 16px 0px rgba(0, 0, 0, 0.05);
}

.btn-flex {
  gap: 40px;
}

@media only screen and (max-width: 1130px) {
  .btn-flex {
    flex-direction: column;
    gap: 24px;
  }
}

@media only screen and (max-width: 1130px) {
  .isFrame .isFrame-item {
    width: 100%;
    min-height: 120px;
    padding: 20px;
    background-color: transparent;
    border: none;
    border-radius: 0;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

.time-out-content {
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: cover;
  /* position: relative; */
  /* background-image: url('@/assets/lunbo1.jpeg'); */
}

.swiper-main {
  background-image: url('@/assets/footer-bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  position: relative;
  z-index: 1;
  opacity: 0.9;
}

.bg-im {
  /* background-image: url('@/assets/photo_2025-06-03 05.20.32.jpeg'); */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
}

.userImg:hover .bottom-btn {
  bottom: 0;
}

.userImg:hover img {
  transform: scale(1.1);
  transition: all 0.3s ease-in-out;
}
</style>
