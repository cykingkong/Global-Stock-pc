import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getMarketList } from '@/api/market'

export const useMarketStore = defineStore('market', () => {
  // 股票列表
  const stockList = ref([])
  // 加载状态
  const loading = ref(false)
  // 错误信息
  const error = ref(null)

  /**
   * 获取股票市场列表
   * @param {Object} params - 请求参数
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页数量
   * @param {string} params.region - 地区
   */
  const fetchMarketList = async (params = { page: 1, size: 10, region: 'US' }) => {
    loading.value = true
    error.value = null

    try {
      const { data, code } = await getMarketList(params)

      if (code === 200) {
        const list = []

        // 解析嵌套的股票数据结构
        if (data.groups && Array.isArray(data.groups)) {
          data.groups.forEach((group) => {
            group.categories?.forEach((category) => {
              category.stocks?.forEach((stock) => list.push(stock))
            })
          })
        }

        // 格式化股票数据
        stockList.value = list.map((item, index) => ({
          key: String(item.id),
          rank: index + 1,
          name: item.name,
          fullName: item.full_name,
          symbol: item.symbol,
          logoUrl: item.logo_url || '',
          close: item.close,
          increase: item.increase,
          changeValue: item.changeValue,
          closePoints: item.close_points || [],
          tradingview_name: item.tradingview_name || `NASDAQ:${item.symbol}`,
        }))

        return stockList.value
      } else {
        throw new Error('获取股票列表失败')
      }
    } catch (e) {
      error.value = e.message || '获取股票列表失败'
      console.error('获取股票列表失败', e)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 清空股票列表
   */
  const clearStockList = () => {
    stockList.value = []
  }

  return {
    stockList,
    loading,
    error,
    fetchMarketList,
    clearStockList,
  }
})
