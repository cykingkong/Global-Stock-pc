import request from '@/utils/request'
// 获取产品详情

export function depositMethod(params): Promise<any> {
  return request.get<any>('/api/billing/depositMethod', { params })
}

export function withdraw_info(): Promise<any> {
  return request.get<any>('/api/billing/withdraw_info', {})
}
// 充值

export function deposit(data): Promise<any> {
  return request.post<any>('/api/recharge/pay', data)
}
export function putCertificate(data): Promise<any> {
  return request.post<any>('/api/recharge/putCertificate', data)
}
export function withdraw(data): Promise<any> {
  return request.post<any>('/api/withdraw/apply', data)
}

export function exchangeRate(params): Promise<any> {
  return request.get<any>('/api/auth/exchangeRate', { params })
}
