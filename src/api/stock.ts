import request from '@/utils/request'

// 获取股票列表
export function assetsList(params): Promise<any> {
  return request.get<any>('/api/instruments', { params })
}

export function assetsDetail(params, config?): Promise<any> {
  return request.get<any>(`/api/instruments/${params.symbol}`, config)
}

export function orderList(params, config?): Promise<any> {
  return request.get<any>('/api/stocks/positions', { params, ...config })
}

export function currentOrders(params, config?): Promise<any> {
  return request.get<any>('/api/stocks/orders', { params, ...config })
}

export function orderLists(params): Promise<any> {
  return request.get<any>('/api/stock/orderLists', { params })
}
export function orderDetail(params): Promise<any> {
  return request.get<any>('/api/stock/orderDetail', { params })
}
export function buySell(data): Promise<any> {
  return request.post<any>('/api/stock/buySell', data)
}
export function buyStock(data): Promise<any> {
  return request.post<any>('/api/stocks/orders/buy', data)
}