import request from '@/utils/request'

export interface LoginData {
  account: string
  password: string
}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  name?: string
  avatar?: string
  userId?: string
}

export function login(data: any): Promise<any> {
  return request.post<LoginRes>('api/auth/login', data)
}

export function logout() {
  return request.post('/user/logout')
}

export function getUserInfo() {
  return request<UserState>('api/user/profile')
}

export function getEmailCode(): Promise<any> {
  return request.get('/user/email-code')
}

export function totalAsset(): Promise<any> {
  return request.get('/api/user/totalAsset')
}
export function walletLogs(params?: any): Promise<any> {
  return request.get('/api/user/wallet/ledgers', { params })
}
export function forgetPassword(data: any): Promise<any> {
  return request.post('/api/auth/resetPassword', data)
}
export function updatePassword(data: any): Promise<any> {
  return request.post('/api/auth/resetPassword', data)
}
export function register(data: any): Promise<any> {
  return request.post('/api/auth/register', data)
}
export function updateProfile(data: any): Promise<any> {
  return request.post('/api/user/updateProfile', data)
}

export function getCaptchaSlide(): Promise<any> {
  return request.post('/app-api/user/getCaptchaSlide')
}
export function sendCode(data: any): Promise<any> {
  return request.post('api/auth/sendCode', data)
}
// 银行卡
export function UserCardGrid(params: any): Promise<any> {
  return request.get('/app-api/user/UserCardGrid', { params })
}
export function UserCardAdd(data: any): Promise<any> {
  return request.post('/app-api/user/UserCardAdd', data)
}
export function UserCardDel(data: any): Promise<any> {
  return request.post('/app-api/user/UserCardDel', data)
}
export function UserCardUpdate(data: any): Promise<any> {
  return request.post('/app-api/user/UserCardUpdate', data)
}
export function kyc(data: any): Promise<any> {
  return request.post('api/user/kyc/registrationInfo', data)
}
export function kycSubmit(data: any): Promise<any> {
  return request.post('api/user/kyc/submit', data)
}
export function getKfUrl(params: any): Promise<any> {
  return request.get('/app-api/user/getKfUrl', { params })
}
// 用户信息相关
// 获取可用余额（全部）
export function getBalance(): Promise<any> {
  return request.get('/api/user/wallet/balance', {})
}
// 获取可用余额（币对）
export function getBalancePair(params: any): Promise<any> {
  return request.get('/app-api/user/getBalancePair', { params })
}
// 账变记录
export function walletLogsGrid(params: any): Promise<any> {
  return request.get('/app-api/user/walletLogsGrid', { params })
}
export function dataAssets(): Promise<any> {
  return request.get('/app-api/user/dataAssets', {})
}
export function bindPhone(data: any): Promise<any> {
  return request.post('/api/user/bindPhone', data)
}
export function bankList(params: any): Promise<any> {
  return request.get('/api/bank_list', { params })
}
export function resetPassword(data: any): Promise<any> {
  return request.post('/api/auth/resetPassword', data)
}
// 获取客服链接
export function getKfUrlNew(): Promise<any> {
  return request.get('/api/auth/kf_url')
}
export function getArticleList(params: any): Promise<any> {
  return request.get('/api/article_list', { params })
}
export function notify_list(params: any): Promise<any> {
  return request.get('/api/user/notify_list', { params })
}
