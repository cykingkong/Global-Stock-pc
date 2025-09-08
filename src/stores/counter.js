import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const swiperList = ref(0)
    const uuid = ref('')

    const setSwiperList = (list) => {
      swiperList.value = list
    }

    const setUuid = (id) => {
      uuid.value = id
    }

    return { swiperList, uuid, setSwiperList, setUuid }
  },
  {
    persist: {
      // 存储到localStorage
      storage: localStorage,
      // 指定要持久化的字段
      paths: ['swiperList', 'uuid'],
      // 可以自定义key
      key: 'counter-store',
    },
  },
)
