import request from '@/utils/request'

// 获取市场分类列表
export function getMarketList(params?: { page?: number; size?: number; region?: string }) {
  return request.get('/api/instruments', { params, showLoading: false } as any)
}

// 获取单个股票详情
export function getStockDetail(symbol: any) {
  return request.get(`/api/instruments/${symbol}`, { showLoading: false } as any)
}

// 买入股票
export function buyStock(data: {
  type: 'market' | 'limit' // market: 市价, limit: 限价
  symbol: string
  price?: number // 限价时需要
  quantity: number
}) {
  return request.post('/api/stocks/orders/buy', data)
}

// 卖出股票
export function sellStock(data: {
  type: 'market' | 'limit' // market: 市价, limit: 限价
  symbol: string
  price?: number // 限价时需要
  quantity: number
}) {
  return request.post('/api/stocks/orders/sell', data)
}
