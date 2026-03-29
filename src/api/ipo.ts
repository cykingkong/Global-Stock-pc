import request from '@/utils/request'

// 产品列表
export function ipoProductList(params?: any): Promise<any> {
  return request.get<any>('/api/ipo/projects', { params })
}

// 单个产品详情
export function ipoProductInfo(id: number | string): Promise<any> {
  return request.get<any>(`/api/ipo/projects/${id}`)
}

// 申购
export function ipoSubscribe(id: number | string, data: { quantity: number }): Promise<any> {
  return request.post<any>(`/api/ipo/${id}/subscribe`, data)
}

// 我的订单列表
export function ipoOrderList(params?: any): Promise<any> {
  return request.get<any>('/api/ipo/my-subscribes', { params })
}
// 申请配资 0 审核中 1 已审核 2 已领取 3 已还完
export function creditApply(data): Promise<any> {
  return request.post<any>('/api/loan/create', data)
}
export function receive(data): Promise<any> {
  return request.post<any>('/api/loan/receive', data)
}
export function repay(data): Promise<any> {
  return request.post<any>('/api/loan/repay', data)
}
export function aplicar(params): Promise<any> {
  return request.get<any>('/api/loan/aplicar', { params })
}
export function loanIndex(params): Promise<any> {
  return request.get<any>('/api/loan/index', { params })
}
export function creditApplyInfo(params): Promise<any> {
  return request.get<any>('/app-api/gameplay/ipo/creditApplyInfo', { params })
}
