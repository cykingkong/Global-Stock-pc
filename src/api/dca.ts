import request from '@/utils/request'

// 期货产品列表
export function getDcaProducts(params?, showLoading = true): Promise<any> {
  return request.get<any>('/api/dca/products', { params, showLoading } as any)
}

// 单个期货产品详情
export function getDcaProductDetail(id: number | string, cycle: string, showLoading = true): Promise<any> {
  return request.get<any>(`/api/dca/products/${id}/${cycle}`, { showLoading } as any)
}

// 购买
export function buyDcaPlan(data, showLoading = true): Promise<any> {
  return request.post<any>('/api/dca/plans', data, { showLoading } as any)
}

// 我的订单
export function getMyDcaPlans(params?, showLoading = true): Promise<any> {
  return request.get<any>('/api/dca/my-plans', { params, showLoading } as any)
}

// 提前缴纳
export function payDcaDeduct(id: number | string, showLoading = true): Promise<any> {
  return request.post<any>(`/api/dca/plans/${id}/pay-deduct`, {}, { showLoading } as any)
}
