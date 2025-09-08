<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div 
      v-for="account in accountTypes" 
      :key="account.id"
      class="relative overflow-hidden transition-all duration-300 rounded-lg border bg-card text-card-foreground shadow-sm"
      :class="{ 'shadow-lg scale-105': hoveredCard === account.id }"
      @mouseenter="hoveredCard = account.id"
      @mouseleave="hoveredCard = null"
    >
      <div :class="`absolute top-0 h-1 w-full ${account.color}`"></div>
      
      <div v-if="account.popular" class="absolute top-4 right-4 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground">
        热门选择
      </div>
      
      <div class="flex flex-col space-y-1.5 p-6">
        <div :class="`w-12 h-12 rounded-full ${account.color} flex items-center justify-center mb-4`">
          <component :is="account.icon" class="h-6 w-6 text-white" />
        </div>
        <h3 class="text-lg font-semibold leading-none tracking-tight">{{ account.title }}</h3>
        <p class="text-sm text-muted-foreground">{{ account.description }}</p>
      </div>
      
      <div class="p-6 pt-0">
        <ul class="space-y-2">
          <li v-for="(feature, index) in account.features" :key="index" class="flex items-center gap-2">
            <div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
            {{ feature }}
          </li>
        </ul>
      </div>
      
      <div class="flex items-center p-6 pt-0">
        <button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full group">
          开始使用
          <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CreditCard, TrendingUp, Zap, BarChart2, ArrowRight } from 'lucide-vue-next'

const hoveredCard = ref(null)

const accountTypes = [
  {
    id: "basic",
    title: "基础账户",
    description: "适合初学者的入门级交易账户",
    features: ["低保证金要求", "基本分析工具", "入门级支持"],
    icon: CreditCard,
    popular: false,
    color: "bg-blue-500"
  },
  {
    id: "standard",
    title: "标准账户",
    description: "适合有经验的交易者的全功能账户",
    features: ["中等保证金要求", "高级图表工具", "优先支持"],
    icon: TrendingUp,
    popular: true,
    color: "bg-purple-500"
  },
  {
    id: "pro",
    title: "专业账户",
    description: "为活跃的日内交易者提供高级功能",
    features: ["高杠杆选项", "专业分析套件", "专属账户经理"],
    icon: Zap,
    popular: false,
    color: "bg-orange-500"
  },
  {
    id: "vip",
    title: "VIP账户",
    description: "为高净值个人提供的专属服务",
    features: ["定制保证金条件", "机构级工具和研究", "24/7全天候支持"],
    icon: BarChart2,
    popular: false,
    color: "bg-green-500"
  },
]
</script>