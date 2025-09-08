<template>
  <!-- 导航栏 -->
  <header class="header  xs:w-full px-20px py-20px">
    <div class="container  w-full xs:w-full ">
      <div class="logo-container h-40px  xs:w-full">
        <!-- <router-link to="/" class="logo">
          <img src="@/assets/logo.png" class="logo-icon" />
        </router-link> -->
      </div>

      <!-- <nav class="main-nav">
          <ul>
            <li><a href="#">{{ t('nav.company') }}</a></li>
            <li><a href="#">{{ t('nav.trade') }}</a></li>
            <li><a href="#">{{ t('nav.tools') }}</a></li>
            <li><a href="#">{{ t('nav.more') }}</a></li>
          </ul>
        </nav> -->

      <div class="right-nav gap-30px">
        <div>
          <div class="flex gap-30px">
            <div class="flex-1 nav-item p-12 rounded-8px cursor-pointer hover:text-blue-500 hover:bg-blue-100"
              v-for="nav in navList" :class="{ 'text-blue-700 bg-blue-100': $route.path === nav.path }" :key="nav.name"
              @click="() => { $router.push(nav.path) }">{{ t(nav.name) }}</div>
          </div>
        </div>
        <div class="language-selector" @click="toggleLanguageMenu">
          <Globe class="icon" />
          <span>{{languages.find((lang) => lang.code === locale)?.name}}</span>
          <ChevronDown class="icon-small" />
          <div class="language-menu" v-if="showLanguageMenu">
            <div v-for="lang in languages" :key="lang.code" class="language-option" @click="changeLanguage(lang.code)">
              {{ lang.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="container-desc h-80px"></div>

</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, ChevronDown, Shield, Zap, BarChart, Apple, Smartphone } from 'lucide-vue-next'

import { useRouter } from 'vue-router'


const { t, locale } = useI18n()
// 语言切换
const languages = [
  // { code: 'zh-CN', name: '简体中文' },
  // { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español ' },
  // { code: 'pt', name: 'Português ' },
]
const navList = [
  { name: t('Home'), icon: Shield, path: '/' },
  { name: t('CompanyProfile.CompanyProfile'), icon: Zap, path: '/votingProgress' },
  { name: t('CampaignRules'), icon: BarChart, path: '/votingRules' },
  // { name: t('nav.more'), icon: Apple, path: '/more' },
  // { name: t('nav.app'), icon: Smartphone, path: '/app' },
]
const showLanguageMenu = ref(false)

function toggleLanguageMenu() {
  showLanguageMenu.value = !showLanguageMenu.value
}

function changeLanguage(langCode) {
  locale.value = langCode
  localStorage.setItem('language', langCode)
  setTimeout(() => {
    showLanguageMenu.value = false
  }, 80)
}
</script>
<style scoped>
/* 头部导航 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  right: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

}

.header .container {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-item {
  white-space: nowrap;
}

.container-desc {

  width: 100%;
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
  color: #000;

  /* gap: 1rem; */
}

.language-selector {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
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
</style>
