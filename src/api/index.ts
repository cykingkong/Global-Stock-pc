import request from '@/utils/request'

export async function queryProse(): Promise<any> {
  return request('/prose')
}
export function banner(params: any, showLoading = true): Promise<any> {
  return request.get<any>('/api/auth/banner', { params, showLoading } as any)
}
export function news(params: any, showLoading = true): Promise<any> {
  return request.get<any>('/api/auth/news', { params, showLoading } as any)
}
export function bulletin(params: any, showLoading = true): Promise<any> {
  return request.get<any>('/api/auth/bulletin', { params, showLoading } as any)
} export function about(params: any, showLoading = true): Promise<any> {
  return request.get<any>('/api/auth/about', { params, showLoading } as any)
}