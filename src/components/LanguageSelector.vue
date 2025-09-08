<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center gap-1 h-9 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      <Globe class="h-4 w-4" />
      {{ languages.find(lang => lang.code === selectedLanguage)?.name || "中文" }}
      <ChevronDown class="h-4 w-4" />
    </button>
    
    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-popover text-popover-foreground z-50"
      v-click-outside="closeDropdown"
    >
      <div class="py-1">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="selectLanguage(language.code)"
          class="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          {{ language.name }}
          <Check v-if="selectedLanguage === language.code" class="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Globe, ChevronDown, Check } from 'lucide-vue-next'

const languages = [
  { code: "zh-CN", name: "中文" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
]

const selectedLanguage = ref("zh-CN")
const isOpen = ref(false)

function selectLanguage(code) {
  selectedLanguage.value = code
  isOpen.value = false
}

function closeDropdown() {
  isOpen.value = false
}

// 点击外部关闭下拉菜单的指令
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>