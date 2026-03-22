import request from '@/utils/request'

// 股权产品列表
export function getEquityProjects(params?: any, showLoading = true): Promise<any> {
  return request.get<any>('/api/equity/projects', { params, showLoading } as any)
}

// 单个股权产品详情
export function getEquityProjectDetail(id: number | string, showLoading = true): Promise<any> {
  return request.get<any>(`/api/equity/projects/${id}`, { showLoading } as any)
}

// 购买股权产品
export function buyEquityInvestment(data: { project_id: number | string; amount: number | string; period_days: number | string }, showLoading = true): Promise<any> {
  return request.post<any>('/api/equity/investments', data, { showLoading } as any)
}

// 我的股权投资订单
export function getMyEquityInvestments(params?: any, showLoading = true): Promise<any> {
  return request.get<any>('/api/equity/my-investments', { params, showLoading } as any)
}
