<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { isLogin } from '@/utils/auth'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

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
  { name: '期货', href: '/futures' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 切换下拉菜单
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  await userStore.logout()
  isDropdownOpen.value = false
  router.push('/login')
}

// 个人中心
const handleProfile = () => {
  isDropdownOpen.value = false
  router.push('/profile')
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
  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 移除点击外部事件监听
  document.removeEventListener('click', handleClickOutside)
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
        <div class="w-8 h-8  rounded-lg flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.2972 0.687536C14.9825 -0.229179 17.0176 -0.229179 18.7029 0.687536L28.4731 6.00205C30.2935 6.99226 31.4267 8.89867 31.4267 10.971V21.029C31.4267 23.1013 30.2935 25.0077 28.4731 25.998L18.7029 31.3125C17.0176 32.2292 14.9825 32.2292 13.2972 31.3125L3.52693 25.998C1.70651 25.0077 0.573303 23.1013 0.573303 21.029L0.573303 10.971C0.573303 8.89867 1.70651 6.99226 3.52692 6.00205L13.2972 0.687536Z"
              fill="#3772FF" />
            <g filter="url(#filter0_d_3570_5431)">
              <path
                d="M18.8608 8.3335C22.5427 8.3335 25.5278 11.3186 25.5278 15.0005C25.5277 18.6822 22.5426 21.6665 18.8608 21.6665C18.6673 21.6665 18.4759 21.6563 18.2866 21.6401C18.189 21.6558 18.0901 21.6665 17.9897 21.6665H11.1548L10.9136 21.6606C8.43969 21.5353 6.47237 19.4898 6.47217 16.9849C6.47217 14.3989 8.56886 12.3022 11.1548 12.3022C11.6814 12.3023 12.1872 12.3909 12.6597 12.5513C13.6358 10.0813 16.0438 8.33363 18.8608 8.3335ZM14.5815 20.1724L14.6294 20.1509C14.6242 20.1466 14.6189 20.1425 14.6138 20.1382C14.6032 20.1498 14.5922 20.1609 14.5815 20.1724Z"
                fill="url(#paint0_linear_3570_5431)" />
            </g>
            <path
              d="M13.5362 1.12695C15.0725 0.291271 16.9276 0.291271 18.4639 1.12695L28.2344 6.44141C29.8937 7.34409 30.9267 9.08178 30.9268 10.9707V21.0293C30.9267 22.9182 29.8937 24.6559 28.2344 25.5586L18.4639 30.873C16.9276 31.7087 15.0725 31.7087 13.5362 30.873L3.76569 25.5586C2.10636 24.6559 1.0734 22.9182 1.0733 21.0293V10.9707C1.0734 9.08175 2.10636 7.34407 3.76569 6.44141L13.5362 1.12695Z"
              stroke="url(#paint1_linear_3570_5431)" />
            <defs>
              <filter id="filter0_d_3570_5431" x="2.47217" y="6.3335" width="27.0557" height="21.333"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha" />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3570_5431" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3570_5431" result="shape" />
              </filter>
              <linearGradient id="paint0_linear_3570_5431" x1="21.6875" y1="9.12498" x2="13.6253" y2="21.6667"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" />
                <stop offset="1" stop-color="#FCFCFD" stop-opacity="0.75" />
              </linearGradient>
              <linearGradient id="paint1_linear_3570_5431" x1="16" y1="0" x2="16" y2="32"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#7EA4FF" stop-opacity="0.27" />
                <stop offset="1" stop-color="#1448C4" stop-opacity="0.42" />
              </linearGradient>
            </defs>
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
        <!-- User Avatar and Name with Dropdown -->
        <div class="relative" ref="dropdownRef">
          <div @click="toggleDropdown"
            class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img v-if="userAvatar" :src="userAvatar" alt="User Avatar" class="w-full h-full object-cover" />
            </div>
            <!-- Username -->
            <span class="text-sm text-gray-700 font-medium">{{ userName }}</span>
            <!-- 下拉箭头 -->
            <svg class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': isDropdownOpen }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>

          <!-- 下拉菜单 -->
          <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <!-- 个人中心 -->
              <button @click="handleProfile"
                class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                个人中心
              </button>

              <!-- 分隔线 -->
              <div class="border-t border-gray-100 my-1"></div>

              <!-- 退出登录 -->
              <button @click="handleLogout"
                class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </transition>
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
      <div class="flex items-center gap-3 mb-4">
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

      <!-- Mobile Menu Options -->
      <div class="space-y-2">
        <button @click="handleProfile"
          class="w-full py-2.5 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          个人中心
        </button>

        <button @click="handleLogout"
          class="w-full py-2.5 px-4 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          退出登录
        </button>
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
