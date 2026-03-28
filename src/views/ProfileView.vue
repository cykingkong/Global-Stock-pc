<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { uploadFile } from '@/api/tool'
import { updateProfile } from '@/api/user'
import useUserStore from '@/stores/user'
import Nav from '@/components/Nav.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const { t, locale } = useI18n()
const showLogoutModal = ref(false)
const showEditProfileModal = ref(false)
const savingProfile = ref(false)
const avatarUploading = ref(false)
const activeSection = ref('overview')

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
    action: () => router.push('/profile/changePassword')
  },
  {
    id: 'language',
    title: 'Language',
    description: `Current: ${locale.value}`,
    icon: 'globe',
    color: 'purple',
    action: () => router.push('/profile/language')
  }
]

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
            <!-- 统计卡片 -->
            <div class="grid grid-cols-3 gap-6 mb-8">
              <!-- 总资产 -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mb-1">Total Assets</p>
                <p class="text-2xl font-bold text-gray-900">$0.00</p>
              </div>

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
                <p class="text-sm text-gray-500 mb-1">Holdings</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>

              <!-- 交易 -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mb-1">Transactions</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
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
                <button @click="router.push('/profile/changePassword')" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
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
                <div>
                  <h3 class="font-semibold text-gray-900">Language</h3>
                  <p class="text-sm text-gray-500">Current language: {{ locale }}</p>
                </div>
                <button @click="router.push('/profile/language')" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Change
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
</style>
