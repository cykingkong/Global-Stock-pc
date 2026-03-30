<template>
  <div class="min-h-[100vh] bg-gray-50 lg:bg-white">
    <!-- Navigation Bar -->
    <Nav />

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
      <!-- Left content area (hidden on mobile) -->
      <div
        class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="
              background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0);
              background-size: 40px 40px;
            "></div>
        </div>


      </div>

      <!-- Right login form -->
      <div
        class="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-0 bg-white min-h-[calc(100vh-72px)]">
        <div class="max-w-md mx-auto w-full">
          <!-- Login header -->
          <div class="text-gray-600 text-xs sm:text-sm mb-2">
            <span v-if="isLogin">{{ t('loginPage.loginForm.header') }}</span>
            <span v-else>{{ t('loginPage.registerForm.header') }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4">
            {{
              isLogin ? t('loginPage.loginForm.title') : t('loginPage.registerForm.title')
            }}
          </h1>
          <p class="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8" v-if="isLogin">
            {{ t('loginPage.loginForm.subtitle') }}
          </p>

          <!-- Login form -->
          <form v-if="isLogin" @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.loginForm.usernameLabel')
                }}</label>
              <div class="flex gap-2">
                <!-- Country Select -->
                <a-select v-model="loginForm.countryCode" :placeholder="t('loginPage.loginForm.countryPlaceholder')"
                  :filter-option="filterCountry" allow-search class="country-select" style="width: 140px">
                  <a-option v-for="country in countryList" :key="country.code" :value="country.dialCode"
                    :label="`+${country.dialCode}`">
                    <div class="flex items-center justify-between">
                      <span>{{ country.name }}</span>
                      <span class="text-gray-500 ml-2">+{{ country.dialCode }}</span>
                    </div>
                  </a-option>
                </a-select>

                <!-- Username Input -->
                <input v-model="loginForm.username" type="text"
                  :placeholder="t('loginPage.loginForm.usernamePlaceholder')"
                  class="flex-1 px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  required />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.loginForm.passwordLabel')
                }}</label>
              <input v-model="loginForm.password" type="password"
                :placeholder="t('loginPage.loginForm.passwordPlaceholder')"
                class="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required />
            </div>

            <div class="mb-6 flex items-center justify-between gap-4">
              <div class="flex items-center">
                <input type="checkbox" id="remember" class="mr-2 w-4 h-4" />
                <label for="remember" class="text-gray-700 text-xs sm:text-sm">{{
                  t('loginPage.loginForm.rememberMe')
                  }}</label>
              </div>
              <button type="button" class="text-gray-600 text-xs sm:text-sm hover:text-gray-800" @click="showForgotModal = true">
                {{ t('loginPage.loginForm.forgotPassword') }}
              </button>
            </div>

            <button type="submit"
              class="w-full bg-black text-white text-sm sm:text-base py-3 sm:py-4 lg:py-6 font-medium flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading">
              <span v-if="!loading">{{ t('loginPage.loginForm.loginButton') }}</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ t('loginPage.loginForm.loggingIn') }}
              </span>
              <svg v-if="!loading" class="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                </path>
              </svg>
            </button>

            <div class="mt-4 text-center text-xs sm:text-sm text-gray-600">
              {{ t('loginPage.loginForm.noAccount') }}
              <button type="button" class="ml-1 underline underline-offset-2 hover:text-gray-800"
                @click="switchForm('register')">
                {{ t('loginPage.loginForm.registerLink') }}
              </button>
            </div>
          </form>

          <!-- Register form -->
          <form v-else @submit.prevent="handleRegister">
            <div class="mb-3 sm:mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.registerForm.countryLabel')
                }}</label>
              <a-select v-model="registerForm.countryCode" :placeholder="t('loginPage.registerForm.countryPlaceholder')"
                :filter-option="filterCountry" allow-search class="country-select w-full">
                <a-option v-for="country in countryList" :key="country.code" :value="country.code"
                  :label="`${country.name} (+${country.dialCode})`">
                  <div class="flex items-center justify-between">
                    <span>{{ country.name }}</span>
                    <span class="text-gray-500 ml-2">+{{ country.dialCode }}</span>
                  </div>
                </a-option>
              </a-select>
            </div>

            <div class="mb-3 sm:mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.registerForm.fullNameLabel')
                }}</label>
              <input v-model="registerForm.fullName" type="text"
                :placeholder="t('loginPage.registerForm.fullNamePlaceholder')"
                class="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required />
            </div>

            <div class="mb-3 sm:mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.registerForm.emailLabel')
                }}</label>
              <input v-model="registerForm.email" type="email"
                :placeholder="t('loginPage.registerForm.emailPlaceholder')"
                class="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required />
            </div>

            <div class="mb-3 sm:mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.registerForm.codeLabel')
                }}</label>
              <div class="flex gap-2">
                <input v-model="registerForm.code" type="text"
                  :placeholder="t('loginPage.registerForm.codePlaceholder')"
                  class="flex-1 px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  required />
                <button type="button"
                  class="px-4 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap border border-gray-300 rounded text-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleSendCode" :disabled="sendCodeLoading || countdown > 0">
                  {{ countdown > 0 ? `${countdown}s` : t('loginPage.registerForm.sendCodeButton') }}
                </button>
              </div>
            </div>

            <div class="mb-3 sm:mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.registerForm.phoneLabel')
                }}</label>
              <div class="flex gap-2">
                <div
                  class="px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded bg-gray-50 text-gray-600 min-w-[100px] text-center">
                  +{{ selectedRegisterCountry?.dialCode || '--' }}
                </div>
                <input v-model="registerForm.phone" type="tel"
                  :placeholder="t('loginPage.registerForm.phonePlaceholder')"
                  class="flex-1 px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  required />
              </div>
            </div>

            <div class="mb-3 sm:mb-4">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.registerForm.passwordLabel')
                }}</label>
              <input v-model="registerForm.password" type="password"
                :placeholder="t('loginPage.registerForm.passwordPlaceholder')"
                class="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required minlength="8" />
            </div>

            <div class="mb-4 sm:mb-6">
              <label class="block text-gray-700 text-xs sm:text-sm mb-2">{{
                t('loginPage.registerForm.inviteCodeLabel')
                }}</label>
              <input v-model="registerForm.inviteCode" type="text"
                :placeholder="t('loginPage.registerForm.inviteCodePlaceholder')"
                class="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required />
            </div>

            <button type="submit"
              class="w-full bg-black text-white text-sm sm:text-base py-3 sm:py-4 lg:py-6 font-medium flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading">
              <span v-if="!loading">{{ t('loginPage.registerForm.registerButton') }}</span>
              <span v-else>{{ t('loginPage.registerForm.registering') }}</span>
              <svg v-if="!loading" class="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                </path>
              </svg>
            </button>

            <div class="mt-4 text-center text-xs sm:text-sm text-gray-600">
              {{ t('loginPage.registerForm.hasAccount') }}
              <button type="button" class="ml-1 underline underline-offset-2 hover:text-gray-800"
                @click="switchForm('login')">
                {{ t('loginPage.registerForm.loginLink') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <PasswordModal v-model:visible="showForgotModal" mode="forgot" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { register, sendCode } from '@/api/user'
import { useUserStore } from '@/stores/user'
import countryData from '@/assets/json/area.json'
import { setToken } from '@/utils/auth'

import Nav from '@/components/Nav.vue'
import PasswordModal from '@/components/PasswordModal.vue'

// 实例化
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

// 国家列表数据
const countryList = ref(countryData)
const showForgotModal = ref(false)

// 国家搜索过滤函数
const filterCountry = (inputValue: string, option: any) => {
  const country = countryList.value.find(
    (c) => c.dialCode === option.value || c.code === option.value,
  )
  if (!country) return false

  const searchText = inputValue.toLowerCase()
  return (
    country.name.toLowerCase().includes(searchText) ||
    country.code.toLowerCase().includes(searchText) ||
    country.dialCode.includes(searchText)
  )
}

// Get route parameter
const type = computed(() => (route.params.type as 'login' | 'register') || 'login')
const isLogin = ref(type.value === 'login')

// 加载状态
const loading = ref(false)
const sendCodeLoading = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// let loginVideoUrl = `https://image.oam007.icu/antifraudalliance/video/collection.mp4`

// 监听路由参数变化，自动切换表单
watch(
  () => route.params.type,
  (newType) => {
    isLogin.value = (newType as string) === 'login' || !newType
  },
)

// Login form data
const loginForm = ref({
  countryCode: '1', // 默认美国
  username: '',
  password: '',
})

// Register form data
const registerForm = ref({
  countryCode: 'US',
  fullName: '',
  email: '',
  code: '',
  phone: '',
  password: '',
  inviteCode: '',
})

const switchForm = (type: 'login' | 'register') => {
  isLogin.value = type === 'login'
}

const selectedRegisterCountry = computed(() =>
  countryList.value.find((country) => country.code === registerForm.value.countryCode),
)

// 计算属性：当前直播列表
const liveList = computed(() => userStore.userInfo?.liveList || [])

// 登录逻辑（参考 loginModal）
const handleLogin = async () => {
  // 基础校验
  if (!loginForm.value.username) {
    alert(t('loginPage.validation.usernameRequired'))
    return
  }
  if (!loginForm.value.password) {
    alert(t('loginPage.validation.passwordRequired'))
    return
  }

  try {
    loading.value = true

    // 构造参数
    const params = {
      account: loginForm.value.countryCode + loginForm.value.username,
      password: loginForm.value.password,
      type: 'phone',
    }

    // 调用 store 登录
    await userStore.login(params)

    // 设置语言
    localStorage.setItem('language', 'en')

    // 获取房间列表
    // await userStore.getRoomList()

    // 登录成功后跳转
    if (liveList.value && liveList.value.length > 0) {
      router.push({ name: 'home' })
    } else {
      router.push({ name: 'home' })
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert(t('loginPage.validation.loginFailed'))
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.value.countryCode) {
    alert(t('loginPage.validation.countryRequired'))
    return
  }

  if (!registerForm.value.fullName) {
    alert(t('loginPage.validation.fullNameRequired'))
    return
  }

  if (!registerForm.value.email) {
    alert(t('loginPage.validation.emailRequired'))
    return
  }

  if (!registerForm.value.code) {
    alert(t('loginPage.validation.codeRequired'))
    return
  }

  if (!registerForm.value.phone) {
    alert(t('loginPage.validation.phoneRequired'))
    return
  }

  if (!registerForm.value.password) {
    alert(t('loginPage.validation.passwordRequired'))
    return
  }

  if (registerForm.value.password.length < 8) {
    alert(t('loginPage.validation.passwordMinLength'))
    return
  }

  if (!registerForm.value.inviteCode) {
    alert(t('loginPage.validation.inviteCodeRequired'))
    return
  }

  if (!selectedRegisterCountry.value) {
    alert(t('loginPage.validation.countryRequired'))
    return
  }

  try {
    loading.value = true
    const { data } = await register({
      country: selectedRegisterCountry.value.code,
      full_name: registerForm.value.fullName,
      email: registerForm.value.email,
      code: registerForm.value.code,
      phone: `${selectedRegisterCountry.value.dialCode}${registerForm.value.phone}`,
      password: registerForm.value.password,
      invite_code: registerForm.value.inviteCode,
    })

    if (data?.token?.access_token) {
      setToken(data.token.access_token)
      await userStore.info()
    }

    router.push({ name: 'home' })
  } catch (error) {
    console.error('注册失败:', error)
    alert(t('loginPage.validation.registerFailed'))
  } finally {
    loading.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60

  if (countdownTimer) {
    clearInterval(countdownTimer)
  }

  countdownTimer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!registerForm.value.email) {
    alert(t('loginPage.validation.emailRequired'))
    return
  }

  try {
    sendCodeLoading.value = true
    await sendCode({
      account: registerForm.value.email,
      type: 'email',
    })
    startCountdown()
    alert(t('loginPage.validation.codeSent'))
  } catch (error) {
    console.error('发送验证码失败:', error)
    alert(t('loginPage.validation.codeSendFailed'))
  } finally {
    sendCodeLoading.value = false
  }
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
/* Country select custom styles */
:deep(.country-select .arco-select-view) {
  height: 42px;
  border-color: #d1d5db;
}

:deep(.country-select .arco-select-view:hover) {
  border-color: #9ca3af;
}

:deep(.country-select .arco-select-view-value) {
  font-size: 14px;
}

/* Match input height on mobile */
@media (max-width: 640px) {
  :deep(.country-select .arco-select-view) {
    height: 38px;
  }
}
</style>
