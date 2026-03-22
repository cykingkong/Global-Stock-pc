<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isLogin } from '@/utils/auth'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)

// 判断是否已登录
const isLoggedIn = computed(() => isLogin() && userInfo.value && Object.keys(userInfo.value).length > 1)

// 获取用户头像
const userAvatar = computed(() => userInfo.value?.avatar || '')

// 获取用户名（优先显示 phone）
const userName = computed(() => userInfo.value?.phone || userInfo.value?.username || userInfo.value?.email || '')

const navLinks = [
  { name: '股票', href: '/' },
  { name: '基金', href: '/affund' },
  { name: 'IPO', href: '/ipo' },
  { name: '股权', href: '/equity' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  router.push('/login')
}

const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  router.push('/register')
}

onMounted(() => {
  if (isLogin()) {
    userStore.info()
  }
})
</script>

<template>
  <!-- 占位符，防止 fixed 遮挡内容 -->
  <div class="h-[60px]"></div>

  <!-- 导航栏本体 -->
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-[60px] flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
    <!-- Left: Logo -->
    <div class="flex items-center gap-8 z-50">
      <!-- Bitcloud Logo -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
              fill="white" />
            <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12Z"
              fill="white" />
            <path d="M12 6C13.66 6 15 4.66 15 3C15 1.34 13.66 0 12 0C10.34 0 9 1.34 9 3C9 4.66 10.34 6 12 6Z"
              fill="white" />
            <path
              d="M20 12C20 10.34 21.34 9 23 9C24.66 9 26 10.34 26 12C26 13.66 24.66 15 23 15C21.34 15 20 13.66 20 12Z"
              fill="white" />
            <path d="M4 12C4 10.34 5.34 9 7 9C8.66 9 10 10.34 10 12C10 13.66 8.66 15 7 15C5.34 15 4 13.66 4 12Z"
              fill="white" />
          </svg>
        </div>
        <span class="text-xl font-bold text-gray-900">Bitcloud</span>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link v-for="link in navLinks" :key="link.name" :to="link.href"
          class="text-base text-gray-700 hover:text-blue-500 transition-colors relative group">
          {{ link.name }}
        </router-link>
      </nav>
    </div>

    <!-- Right: Desktop Controls -->
    <div class="hidden lg:flex items-center gap-4">
      <!-- Language Dropdown -->
      <div class="relative"></div>

      <!-- Notification -->
      <button class="p-2 text-gray-500 hover:text-blue-500 transition-colors relative">
        <svg class="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2436_442)">
            <path
              d="M21 18.0233C21 18.5113 20.6043 18.907 20.1163 18.907H3.88372C3.39565 18.907 3 18.5113 3 18.0233C3 17.5352 3.39566 17.1395 3.88372 17.1395H3.9V10.9809C3.9 6.57288 7.527 3 12 3C16.473 3 20.1 6.57288 20.1 10.9809V17.1395H20.1163C20.6043 17.1395 21 17.5352 21 18.0233ZM5.7 17.1395H18.3V10.9809C18.3 7.5494 15.4794 4.76744 12 4.76744C8.5206 4.76744 5.7 7.5494 5.7 10.9809V17.1395ZM9.97604 20.7558C9.73121 20.2608 10.1977 19.7907 10.75 19.7907H13.25C13.8023 19.7907 14.2688 20.2608 14.024 20.7558C13.9155 20.9751 13.7699 21.1773 13.591 21.3529C13.169 21.7672 12.5967 22 12 22C11.4033 22 10.831 21.7672 10.409 21.3529C10.2301 21.1773 10.0845 20.9751 9.97604 20.7558Z"
              fill="#777E91" />
          </g>
          <defs>
            <clipPath id="clip0_2436_442">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <span class="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
      </button>

      <!-- Assets Button -->
      <button class="px-4 py-2 text-base text-gray-700 hover:text-blue-500 transition-colors">
        资产
      </button>

      <!-- 已登录状态 -->
      <template v-if="isLoggedIn">
        <!-- User Avatar and Name -->
        <div class="flex items-center gap-2">
          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            <img v-if="userAvatar" :src="userAvatar" alt="User Avatar" class="w-full h-full object-cover" />
          </div>
          <!-- Username -->
          <span class="text-sm text-gray-700 font-medium">{{ userName }}</span>
        </div>
      </template>

      <!-- 未登录状态 -->
      <template v-else>
        <!-- Sign Up Button -->
        <button @click="handleRegister"
          class="px-6 py-2 bg-blue-500 text-white text-base font-medium rounded-full hover:bg-blue-600 transition-colors">
          Sign up
        </button>

        <!-- Login Button -->
        <button @click="handleLogin"
          class="px-6 py-2 border border-gray-300 text-gray-700 text-base font-medium rounded-full hover:bg-gray-50 transition-colors">
          Login
        </button>
      </template>
    </div>

    <!-- Mobile Menu Toggle -->
    <svg class="w-[24px] h-[24px]" :class="'lg:hidden'" @click="toggleMenu" viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7H21" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" />
      <path d="M3 12H21" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" />
      <path d="M3 17H21" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </header>

  <!-- Mobile Menu Overlay -->
  <div v-if="isMenuOpen" class="fixed inset-0 bg-white z-40 pt-16 lg:hidden overflow-y-auto">
    <!-- Mobile Navigation -->
    <nav class="px-6 pb-6">
      <router-link v-for="link in navLinks" :key="link.name" :to="link.href"
        class="block py-3 text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors" @click="toggleMenu">
        {{ link.name }}
      </router-link>
    </nav>

    <!-- Mobile User Info (if logged in) -->
    <div v-if="isLoggedIn" class="px-6 py-4 border-t border-gray-200">
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          <img v-if="userAvatar" :src="userAvatar" alt="User Avatar" class="w-full h-full object-cover" />
        </div>
        <!-- Username -->
        <div>
          <div class="text-base font-medium text-gray-900">{{ userName }}</div>
          <div class="text-sm text-gray-500">已登录</div>
        </div>
      </div>
    </div>

    <!-- Mobile Buttons (if not logged in) -->
    <div v-else class="px-6 pt-6 pb-8">
      <button @click="handleRegister"
        class="w-full py-3 mb-4 text-base font-medium text-white bg-blue-500 rounded-full transition-colors">
        Sign up
      </button>
      <button @click="handleLogin"
        class="w-full py-3 text-base font-medium text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
        Login
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 确保移动端菜单正确覆盖 */
:deep(.arco-select-overlay) {
  z-index: 50 !important;
}
</style>
