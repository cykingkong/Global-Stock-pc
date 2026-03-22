import request from '@/utils/request'

// 基金信息
export function getFundIndex(params?: any, showLoading = true): Promise<any> {
  return request.get<any>('/api/funds/fundIndex', { params, showLoading } as any)
}

// 投资
export function fundInvest(data: { id: number; amount: number }): Promise<any> {
  return request.post<any>('/api/funds/invest', data)
}

// 订单列表
export function getFundOrders(params?: any): Promise<any> {
  return request.get<any>('/api/funds/my-orders', { params })
}

// 赎回
export function fundRedeem(data: { id: number }): Promise<any> {
  return request.post<any>('/api/funds/redeem', data)
}

// 追加投资
export function fundAddInvest(data: { id: number; amount: number }): Promise<any> {
  return request.post<any>('/api/funds/add-invest', data)
}
