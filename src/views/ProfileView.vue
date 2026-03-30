<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { uploadFile } from '@/api/tool'
import { updateProfile, userStatistic } from '@/api/user'
import useUserStore from '@/stores/user'
import Nav from '@/components/Nav.vue'
import PasswordModal from '@/components/PasswordModal.vue'
import { useI18n } from 'vue-i18n'
import { addCommasToNumber } from '@/utils/tool'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const { t, locale } = useI18n()
const showLanguageModal = ref(false)
const selectedLanguage = ref(locale.value)
const savingLanguage = ref(false)
const showChangePasswordModal = ref(false)
const showLogoutModal = ref(false)
const showEditProfileModal = ref(false)
const savingProfile = ref(false)
const avatarUploading = ref(false)
const activeSection = ref('overview')
const walletList = ref<any[]>([])

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
]

const walletLabelMap: Record<string, string> = {
  stock: 'Stock',
  fund: 'Fund',
  future: 'Futures',
  equity: 'Equity',
  ipo: 'IPO',
}

const walletRouteMap: Record<string, { path: string, query?: Record<string, string> }> = {
  stock: { path: '/stockOrder' },
  fund: { path: '/AFFund', query: { type: 'orders' } },
  future: { path: '/FuturesInvestment', query: { type: 'orders' } },
  equity: { path: '/Equity', query: { type: 'orders' } },
  ipo: { path: '/IPO', query: { type: 'orders' } },
}

const createProfileForm = () => ({
  avatar: '',
  avatarPreview: '',
  fullName: '',
  phoneNumber: '',
  email: '',
  dateOfBirth: '',
  country: ''
})

const editProfileForm = ref(createProfileForm())
const profileDateFormat = 'MM/DD/YYYY'
const editProfileAvatarSrc = computed(() => editProfileForm.value.avatarPreview || editProfileForm.value.avatar)

// 获取用户头像
const userAvatar = computed(() => userInfo.value?.avatar || '')

// 获取用户名
const userName = computed(() =>
  userInfo.value?.full_name
  || userInfo.value?.account
  || userInfo.value?.phone
  || userInfo.value?.username
  || userInfo.value?.email
  || '用户',
)

// 侧边栏菜单项
const menuItems = [
  {
    id: 'overview',
    icon: 'home',
    label: 'Overview',
    isLocal: true
  },
  {
    id: 'personal-info',
    icon: 'user',
    label: 'Personal Info',
    route: '/profile/profileDetail'
  },
  {
    id: 'security',
    icon: 'shield',
    label: 'Security',
    isLocal: true
  },
  {
    id: 'notifications',
    icon: 'bell',
    label: 'Notifications',
    route: '/notify'
  },
  {
    id: 'preferences',
    icon: 'settings',
    label: 'Preferences',
    isLocal: true
  }
]

// 快捷操作卡片
const quickActions = [
  {
    id: 'kyc',
    title: 'KYC Verification',
    description: 'Complete your identity verification',
    icon: 'shield',
    color: 'blue',
    status: computed(() => userInfo.value?.kyc_status == 1 ? 'Under Review' : 'Not Verified'),
    action: () => router.push('/kyc')
  },
  {
    id: 'bank',
    title: 'Bank Account',
    description: 'Manage your payment methods',
    icon: 'card',
    color: 'green',
    action: () => router.push('/profile/bankAccount')
  },
  {
    id: 'password',
    title: 'Change Password',
    description: 'Update your security credentials',
    icon: 'lock',
    color: 'orange',
    action: () => showChangePasswordModal.value = true
  },
  {
    id: 'language',
    title: 'Language',
    description: `Current: ${locale.value}`,
    icon: 'globe',
    color: 'purple',
    action: () => openLanguageModal()
  }
]

// 钱包相关函数
async function getWalletStatistic() {
  const { data, code } = await userStatistic()
  if (code === 200 && data) {
    walletList.value = Object.entries(data)
      .filter(([_, v]) => v !== null)
      .map(([key, value]: [string, any]) => ({
        key,
        label: walletLabelMap[key] || key,
        ...value,
      }))
  }
}

function handleClickWalletItem(item: any) {
  const route = walletRouteMap[item.key]
  if (route) {
    router.push(route)
  }
}

function handleWalletAction(type: number) {
  if (type === 1) {
    router.push('/wallet/exchange/cashierCenter-withdraw')
  } else if (type === 2) {
    router.push('/wallet/exchange/cashierCenter')
  } else {
    router.push('/moneyDetail')
  }
}

function handleLanguageChange(value: string) {
  locale.value = value
  Message.success(`Language changed to ${languageOptions.find(opt => opt.value === value)?.label}`)
}

function openLanguageModal() {
  selectedLanguage.value = locale.value
  showLanguageModal.value = true
}

function confirmLanguageChange() {
  savingLanguage.value = true
  handleLanguageChange(selectedLanguage.value)
  showLanguageModal.value = false
  savingLanguage.value = false
}

// 计算总持仓数
const totalHoldings = computed(() => {
  return walletList.value.reduce((sum, item) => sum + (item.holding_count || 0), 0)
})

// 切换菜单项
function handleMenuClick(item: any) {
  if (item.id === 'personal-info') {
    openEditProfileModal()
    return
  }

  if (item.isLocal) {
    activeSection.value = item.id
  } else if (item.route) {
    router.push(item.route)
  }
}

function syncProfileForm() {
  editProfileForm.value = {
    avatar: userInfo.value?.avatar || '',
    avatarPreview: '',
    fullName: userInfo.value?.full_name || userInfo.value?.account || '',
    phoneNumber: userInfo.value?.phone || '',
    email: userInfo.value?.email || '',
    dateOfBirth: normalizeDateValue(userInfo.value?.registration_info?.birth || ''),
    country: userInfo.value?.country || ''
  }
}

function normalizeDateValue(value: string) {
  if (!value)
    return ''

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value))
    return value

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-')
    return `${month}/${day}/${year}`
  }

  if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
    const [year, month, day] = value.split('/')
    return `${month}/${day}/${year}`
  }

  return value
}

function openEditProfileModal() {
  syncProfileForm()
  showEditProfileModal.value = true
}

function closeEditProfileModal() {
  showEditProfileModal.value = false
}

async function customAvatarUpload(options: any) {
  const file = options.fileItem?.file || options.file

  if (!file)
    return

  const previousAvatar = editProfileForm.value.avatar
  const reader = new FileReader()

  reader.onload = async () => {
    try {
      avatarUploading.value = true
      editProfileForm.value.avatarPreview = typeof reader.result === 'string' ? reader.result : ''
      options.onProgress?.(0.3)

      const uploadFormData = new FormData()
      uploadFormData.append('image', file)
      const { data, code } = await uploadFile(uploadFormData)

      if (code === 200 && data?.url) {
        editProfileForm.value.avatar = data.url
        options.onProgress?.(1)
        options.onSuccess?.(data)
        Message.success('Avatar uploaded successfully')
        return
      }

      throw new Error('upload failed')
    } catch (error) {
      console.error('头像上传失败:', error)
      editProfileForm.value.avatar = previousAvatar
      editProfileForm.value.avatarPreview = ''
      options.onError?.(error)
      Message.error('Avatar upload failed')
    } finally {
      avatarUploading.value = false
    }
  }
  reader.onerror = () => {
    editProfileForm.value.avatar = previousAvatar
    editProfileForm.value.avatarPreview = ''
    options.onError?.(new Error('avatar preview failed'))
    Message.error('Avatar upload failed')
  }

  reader.readAsDataURL(file)
}

async function saveProfileChanges() {
  if (!editProfileForm.value.fullName.trim()) {
    window.alert('Please enter your full name')
    return
  }

  if (avatarUploading.value) {
    Message.warning('Avatar is still uploading')
    return
  }

  try {
    savingProfile.value = true
    await updateProfile({
      full_name: editProfileForm.value.fullName,
      avatar: editProfileForm.value.avatar,
      registration_info: {
        ...(userStore.userInfo?.registration_info || {}),
        birth: editProfileForm.value.dateOfBirth,
      },
    })

    await userStore.info()
    syncProfileForm()
    showEditProfileModal.value = false
    Message.success('Profile updated successfully')
  } catch (error) {
    console.error('更新用户信息失败:', error)
    Message.error('Failed to update profile')
  } finally {
    savingProfile.value = false
  }
}

// 处理退出登录
function handleLogout() {
  showLogoutModal.value = true
}

// 确认退出登录
async function confirmLogout() {
  await userStore.logout()
  showLogoutModal.value = false
  router.push('/login')
}

// 关闭退出登录弹窗
function closeLogoutModal() {
  showLogoutModal.value = false
}

onMounted(async () => {
  await userStore.info()
  syncProfileForm()
  getWalletStatistic()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- 导航栏 -->
    <Nav />

    <!-- 主内容区域 -->
    <div class="max-w-[1400px] mx-auto px-8 py-10">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p class="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <!-- 左右分栏布局 -->
      <div class="flex gap-8">
        <!-- 左侧边栏 -->
        <aside class="w-80 flex-shrink-0">
          <!-- 用户信息卡片 -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex flex-col items-center text-center">
              <!-- 头像 -->
              <div class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 ring-4 ring-blue-100">
                <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
                <svg v-else class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <!-- 用户名 -->
              <h2 class="text-xl font-bold text-gray-900 mb-1">{{ userName }}</h2>
              <p v-if="userInfo?.user_id" class="text-sm text-gray-500 mb-4">UID: {{ userInfo.user_id }}</p>

              <!-- 邮箱 -->
              <div v-if="userInfo?.email" class="w-full bg-gray-50 rounded-lg px-4 py-2 mb-4">
                <p class="text-xs text-gray-500 mb-1">Email</p>
                <p class="text-sm text-gray-900 truncate">{{ userInfo.email }}</p>
              </div>

              <!-- 编辑按钮 -->
              <button @click="openEditProfileModal"
                class="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          <!-- 导航菜单 -->
          <nav class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="handleMenuClick(item)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 last:mb-0',
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              ]">
              <!-- Home Icon -->
              <svg v-if="item.icon === 'home'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>

              <!-- User Icon -->
              <svg v-else-if="item.icon === 'user'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>

              <!-- Shield Icon -->
              <svg v-else-if="item.icon === 'shield'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>

              <!-- Bell Icon -->
              <svg v-else-if="item.icon === 'bell'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>

              <!-- Settings Icon -->
              <svg v-else-if="item.icon === 'settings'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

              <span class="font-medium">{{ t(item.label) || item.label }}</span>
            </button>
          </nav>

          <!-- 退出登录按钮 -->
          <button @click="handleLogout"
            class="w-full bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-2xl shadow-sm py-3 font-medium transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {{ t('Logout') || 'Logout' }}
          </button>
        </aside>

        <!-- 右侧主内容区 -->
        <main class="flex-1">
          <!-- Overview Section -->
          <div v-if="activeSection === 'overview'">
            <!-- 钱包余额卡片 -->
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <p class="text-blue-100 text-sm mb-2">{{ t("Balance Available") }}</p>
                  <p class="text-4xl font-bold">${{ addCommasToNumber(userInfo.balance) }}</p>
                </div>
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex gap-3">
                <button @click="handleWalletAction(1)"
                  class="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V7.5M18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.3639C14.8493 21.8787 9.1508 21.8787 5.6361 18.3639C2.12138 14.8492 2.12138 9.15074 5.6361 5.63604C9.15082 2.12132 14.8493 2.12132 18.364 5.63604" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 18V16.5M9 14.255V14.255C9 15.498 10.007 16.505 11.25 16.505H12.893C14.056 16.505 15 15.562 15 14.398V14.398C15 13.432 14.343 12.59 13.406 12.355L10.594 11.65C9.657 11.415 9 10.573 9 9.607V9.607C9 8.443 9.943 7.5 11.107 7.5H12.75C13.993 7.5 15 8.507 15 9.75V9.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ t("Withdraw") }}
                </button>
                <button @click="handleWalletAction(2)"
                  class="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.55799 9.76296L5.27099 8.69595C4.98199 7.62695 5.61699 6.52795 6.68699 6.24295L16.73 3.56695C17.79 3.28495 18.89 3.91996 19.176 4.97896L20.93 11.488C21.218 12.557 20.582 13.656 19.514 13.941L17.4 14.504" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 20.4999H15.4C16.505 20.4999 17.4 19.6049 17.4 18.4999V11.7629C17.4 10.6579 16.505 9.76294 15.4 9.76294H5C3.895 9.76294 3 10.6579 3 11.7629V18.4999C3 19.6049 3.896 20.4999 5 20.4999Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 13.8401H17.4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ t("Deposit") }}
                </button>
                <button @click="handleWalletAction(3)"
                  class="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.3445 5.29329C6.43748 5.38616 6.51124 5.49645 6.56156 5.61785C6.61188 5.73924 6.63779 5.86937 6.63779 6.00079C6.63779 6.1322 6.61188 6.26233 6.56156 6.38373C6.51124 6.50513 6.43748 6.61541 6.3445 6.70829C4.84394 8.2091 4.00095 10.2445 4.00095 12.3668C4.00095 14.4891 4.84394 16.5245 6.3445 18.0253C6.43734 18.1182 6.51098 18.2285 6.5612 18.3499C6.61142 18.4712 6.63725 18.6013 6.6372 18.7326C6.63716 18.864 6.61124 18.994 6.56093 19.1154C6.51062 19.2367 6.43691 19.3469 6.344 19.4398C6.25109 19.5326 6.1408 19.6063 6.01943 19.6565C5.89807 19.7067 5.76799 19.7325 5.63665 19.7325C5.5053 19.7324 5.37524 19.7065 5.25391 19.6562C5.13258 19.6059 5.02234 19.5322 4.9295 19.4393C1.0235 15.5333 1.0235 9.19929 4.9295 5.29329C5.02237 5.20031 5.13266 5.12655 5.25406 5.07623C5.37546 5.0259 5.50558 5 5.637 5C5.76842 5 5.89854 5.0259 6.01994 5.07623C6.14134 5.12655 6.25163 5.20031 6.3445 5.29329ZM19.0755 5.29329C22.9815 9.20029 22.9815 15.5333 19.0755 19.4393C18.8869 19.6214 18.6343 19.7222 18.3721 19.72C18.1099 19.7177 17.8591 19.6125 17.6737 19.4271C17.4883 19.2417 17.3831 18.9909 17.3808 18.7287C17.3785 18.4665 17.4793 18.2139 17.6615 18.0253C19.1621 16.5245 20.005 14.4891 20.005 12.3668C20.005 10.2445 19.1621 8.2091 17.6615 6.70829C17.4739 6.52078 17.3684 6.26641 17.3683 6.00114C17.3682 5.73587 17.4735 5.48143 17.661 5.29379C17.8485 5.10615 18.1029 5.00068 18.3681 5.00058C18.6334 5.00049 18.8879 5.10578 19.0755 5.29329ZM9.3115 8.16729C9.49897 8.35481 9.60429 8.60912 9.60429 8.87429C9.60429 9.13945 9.49897 9.39376 9.3115 9.58129C8.94745 9.9453 8.65867 10.3775 8.46165 10.8531C8.26462 11.3287 8.16322 11.8385 8.16322 12.3533C8.16322 12.8681 8.26462 13.3779 8.46165 13.8535C8.65867 14.3291 8.94745 14.7613 9.3115 15.1253C9.40701 15.2175 9.48319 15.3279 9.5356 15.4499C9.58801 15.5719 9.6156 15.7031 9.61675 15.8359C9.6179 15.9687 9.5926 16.1003 9.54232 16.2232C9.49204 16.3461 9.41779 16.4578 9.3239 16.5517C9.23 16.6456 9.11835 16.7198 8.99545 16.7701C8.87256 16.8204 8.74088 16.8457 8.6081 16.8445C8.47532 16.8434 8.3441 16.8158 8.2221 16.7634C8.10009 16.711 7.98975 16.6348 7.8975 16.5393C6.78733 15.4291 6.16364 13.9233 6.16364 12.3533C6.16364 10.7832 6.78733 9.2775 7.8975 8.16729C8.08503 7.97982 8.33934 7.8745 8.6045 7.8745C8.86966 7.8745 9.12397 7.97982 9.3115 8.16729ZM16.2705 8.16729C17.3807 9.2775 18.0044 10.7832 18.0044 12.3533C18.0044 13.9233 17.3807 15.4291 16.2705 16.5393C16.1777 16.6322 16.0674 16.7059 15.9461 16.7562C15.8248 16.8065 15.6947 16.8324 15.5634 16.8325C15.432 16.8325 15.3019 16.8067 15.1806 16.7565C15.0592 16.7063 14.9489 16.6326 14.856 16.5398C14.7631 16.4469 14.6894 16.3367 14.6391 16.2154C14.5888 16.094 14.5628 15.964 14.5628 15.8326C14.5628 15.7013 14.5886 15.5712 14.6388 15.4499C14.689 15.3285 14.7627 15.2182 14.8555 15.1253C15.2195 14.7613 15.5083 14.3291 15.7054 13.8535C15.9024 13.3779 16.0038 12.8681 16.0038 12.3533C16.0038 11.8385 15.9024 11.3287 15.7054 10.8531C15.5083 10.3775 15.2195 9.9453 14.8555 9.58129C14.668 9.39365 14.5627 9.1392 14.5628 8.87393C14.5629 8.60866 14.6684 8.35429 14.856 8.16679C15.0436 7.97928 15.2981 7.87399 15.5634 7.87408C15.8286 7.87418 16.083 7.97965 16.2705 8.16729ZM12.0835 10.9373C12.2805 10.9373 12.4755 10.9761 12.6575 11.0515C12.8395 11.1268 13.0049 11.2373 13.1442 11.3766C13.2834 11.5159 13.3939 11.6813 13.4693 11.8633C13.5447 12.0452 13.5835 12.2403 13.5835 12.4373C13.5835 12.6343 13.5447 12.8293 13.4693 13.0113C13.3939 13.1933 13.2834 13.3587 13.1442 13.4979C13.0049 13.6372 12.8395 13.7477 12.6575 13.8231C12.4755 13.8985 12.2805 13.9373 12.0835 13.9373C11.6857 13.9373 11.3041 13.7793 11.0228 13.4979C10.7415 13.2166 10.5835 12.8351 10.5835 12.4373C10.5835 12.0395 10.7415 11.6579 11.0228 11.3766C11.3041 11.0953 11.6857 10.9373 12.0835 10.9373Z" fill="white" />
                  </svg>
                  {{ t("Detail") }}
                </button>
              </div>
            </div>

            <!-- 统计卡片 -->
            <div class="grid grid-cols-2 gap-6 mb-8">
              <!-- 持仓 -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mb-1">Total Holdings</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalHoldings }}</p>
              </div>

              <!-- 投资类型 -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mb-1">Investment Types</p>
                <p class="text-2xl font-bold text-gray-900">{{ walletList.length }}</p>
              </div>
            </div>

            <!-- 快捷操作 -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div class="grid grid-cols-2 gap-4">
                <button
                  v-for="action in quickActions"
                  :key="action.id"
                  @click="action.action"
                  class="group p-5 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                  <div class="flex items-start gap-4">
                    <div :class="[
                      'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                      action.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' : '',
                      action.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' : '',
                      action.color === 'orange' ? 'bg-orange-100 group-hover:bg-orange-200' : '',
                      action.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' : ''
                    ]">
                      <svg class="w-6 h-6" :class="[
                        action.color === 'blue' ? 'text-blue-600' : '',
                        action.color === 'green' ? 'text-green-600' : '',
                        action.color === 'orange' ? 'text-orange-600' : '',
                        action.color === 'purple' ? 'text-purple-600' : ''
                      ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <!-- Shield Icon (KYC) -->
                        <path v-if="action.icon === 'shield'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        <!-- Card Icon -->
                        <path v-else-if="action.icon === 'card'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        <!-- Lock Icon -->
                        <path v-else-if="action.icon === 'lock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        <!-- Globe Icon -->
                        <path v-else-if="action.icon === 'globe'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900 mb-1">{{ action.title }}</h3>
                      <p class="text-sm text-gray-500">{{ action.description }}</p>
                      <span v-if="action.status" class="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        {{ typeof action.status === 'function' ? action.status() : action.status }}
                      </span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- 钱包投资列表 -->
            <div v-if="walletList.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6">My Investments</h2>
              <div class="space-y-4">
                <div
                  v-for="item in walletList"
                  :key="item.key"
                  @click="handleClickWalletItem(item)"
                  class="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ t(item.label) }}</h3>
                      <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        {{ item.holding_count }} {{ t('Holdings') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-4 text-sm">
                      <span class="text-gray-500">{{ t('Net value') }}:</span>
                      <span class="font-semibold text-gray-900">${{ addCommasToNumber(item.total_market_value) }}</span>
                      <span
                        :class="[
                          'px-2 py-1 rounded-md text-xs font-semibold',
                          item.total_profit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        ]">
                        {{ t('Income') }}: {{ item.total_profit >= 0 ? '+' : '' }}${{ addCommasToNumber(Math.abs(item.total_profit)) }}
                      </span>
                    </div>
                  </div>
                  <svg class="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 账户信息 -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
              <div class="grid grid-cols-2 gap-6">
                <div class="border-l-4 border-blue-500 pl-4">
                  <p class="text-sm text-gray-500 mb-1">User ID</p>
                  <p class="text-base font-medium text-gray-900">{{ userInfo?.user_id || '-' }}</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                  <p class="text-sm text-gray-500 mb-1">Email</p>
                  <p class="text-base font-medium text-gray-900">{{ userInfo?.email || '-' }}</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                  <p class="text-sm text-gray-500 mb-1">Phone</p>
                  <p class="text-base font-medium text-gray-900">{{ userInfo?.phone || '-' }}</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                  <p class="text-sm text-gray-500 mb-1">Account Status</p>
                  <p class="text-base font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div v-else-if="activeSection === 'security'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 class="font-semibold text-gray-900">Password</h3>
                  <p class="text-sm text-gray-500">Change your password regularly to keep your account secure</p>
                </div>
                <button @click="showChangePasswordModal = true" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Change
                </button>
              </div>
              <div class="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 class="font-semibold text-gray-900">KYC Verification</h3>
                  <p class="text-sm text-gray-500">Verify your identity to unlock all features</p>
                </div>
                <button @click="router.push('/kyc')" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Verify
                </button>
              </div>
            </div>
          </div>

          <!-- Preferences Section -->
          <div v-else-if="activeSection === 'preferences'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between py-4 border-b">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">Language</h3>
                  <p class="text-sm text-gray-500">Choose your preferred language</p>
                </div>
                <button @click="openLanguageModal" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  {{ languageOptions.find(opt => opt.value === locale)?.label || 'Change' }}
                </button>
              </div>
              <div class="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 class="font-semibold text-gray-900">About</h3>
                  <p class="text-sm text-gray-500">Learn more about our platform</p>
                </div>
                <button @click="router.push('/aboutUs')" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 退出登录确认弹窗 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showEditProfileModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeEditProfileModal">
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0"
          enter-to-class="transform translate-y-0 sm:scale-100 opacity-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform translate-y-0 sm:scale-100 opacity-100"
          leave-to-class="transform translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0">
          <div v-if="showEditProfileModal"
            class="flex h-full w-full flex-col bg-white sm:mx-4 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl sm:shadow-2xl">
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-8">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Personal Information</h2>
                <p class="mt-1 text-sm text-gray-500">Edit your profile details in one place</p>
              </div>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                @click="closeEditProfileModal">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              <div class="mb-8 flex flex-col items-center">
                <div class="relative">
                  <div
                    class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-semibold text-white ring-4 ring-blue-100">
                    <img v-if="editProfileAvatarSrc" :src="editProfileAvatarSrc" alt="Avatar"
                      class="h-full w-full object-cover" />
                    <span v-else>{{ editProfileForm.fullName?.charAt(0)?.toUpperCase() || 'A' }}</span>
                  </div>
                  <a-upload accept="image/*" :show-file-list="false" :custom-request="customAvatarUpload"
                    :disabled="avatarUploading"
                    class="absolute bottom-0 right-0">
                    <template #upload-button>
                      <div :class="[
                        'flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg ring-1 ring-gray-200 transition',
                        avatarUploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-blue-50'
                      ]">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </template>
                  </a-upload>
                </div>
                <p class="mt-3 text-sm text-gray-500">
                  {{ avatarUploading ? 'Uploading avatar...' : 'Tap the icon to change your avatar' }}
                </p>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                  <input v-model="editProfileForm.fullName" type="text"
                    class="w-full rounded-2xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500"
                    placeholder="Enter your full name" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                  <input v-model="editProfileForm.phoneNumber" type="text" readonly
                    class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-700 outline-none"
                    placeholder="Phone number" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700">Email</label>
                  <input v-model="editProfileForm.email" type="email" readonly
                    class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-700 outline-none"
                    placeholder="Email" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700">Date of Birth</label>
                  <a-date-picker v-model="editProfileForm.dateOfBirth" class="profile-date-picker w-full"
                    :format="profileDateFormat" :value-format="profileDateFormat" allow-clear
                    placeholder="Select your date of birth" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700">Country</label>
                  <input v-model="editProfileForm.country" type="text" readonly
                    class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-700 outline-none"
                    placeholder="Country" />
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 px-5 py-4 sm:px-8">
              <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  class="h-12 rounded-2xl border border-gray-300 px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  @click="closeEditProfileModal">
                  Cancel
                </button>
                <button
                  class="h-12 rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="saveProfileChanges" :disabled="savingProfile">
                  {{ savingProfile ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showLogoutModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
        @click.self="closeLogoutModal">
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <div v-if="showLogoutModal" class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <!-- 图标 -->
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <!-- 标题 -->
            <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">
              {{ t('Logout') || 'Logout' }}
            </h2>

            <!-- 提示文本 -->
            <p class="text-center text-gray-600 mb-8">
              {{ t('Are you sure you want to log out?') || 'Are you sure you want to log out?' }}
            </p>

            <!-- 按钮组 -->
            <div class="flex gap-4">
              <!-- 取消按钮 -->
              <button @click="closeLogoutModal"
                class="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                {{ t('Close') || 'Cancel' }}
              </button>

              <!-- 确认按钮 -->
              <button @click="confirmLogout"
                class="flex-1 h-12 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
                {{ t('Yes,Logout') || 'Yes, Logout' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Language Modal -->
    <a-modal v-model:visible="showLanguageModal" :footer="false" title="Language" width="420px" :mask-closable="false">
      <div class="py-2">
        <p class="text-sm text-gray-500 mb-4">Choose your preferred language</p>
        <a-select
          v-model="selectedLanguage"
          :options="languageOptions"
          class="w-full"
          size="large"
        />
        <div class="flex gap-3 mt-6">
          <button @click="showLanguageModal = false"
            class="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="confirmLanguageChange"
            class="flex-1 h-11 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">
            Confirm
          </button>
        </div>
      </div>
    </a-modal>

    <!-- Change Password Modal -->
    <PasswordModal v-model:visible="showChangePasswordModal" mode="change" />
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 语言选择器样式 */
:deep(.arco-select-view-single) {
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.arco-select-view-single:hover) {
  border-color: #3b82f6;
}

:deep(.arco-select-view-single.arco-select-view-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.language-select-dropdown) {
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

:deep(.arco-select-option) {
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  margin: 0.25rem 0.5rem;
  transition: all 0.2s;
}

:deep(.arco-select-option:hover) {
  background-color: #eff6ff;
}

:deep(.arco-select-option.arco-select-option-selected) {
  background-color: #dbeafe;
  color: #2563eb;
  font-weight: 500;
}
</style>
