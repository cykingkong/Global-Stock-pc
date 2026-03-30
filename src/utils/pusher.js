import Pusher from 'pusher-js'

const wsUrl = import.meta.env.VITE_WS_API_BASE_URL || '192.168.31.153'
const isProduction = import.meta.env.VITE_NODE_ENV === 'production'

const pusher = new Pusher('uvjkwblrhcjeawsu3jz1', {
  cluster: 'mt1',
  wsHost: wsUrl,
  wsPort: 8080,
  wssPort: 443,
  forceTLS: isProduction,
  enabledTransports: ['ws', 'wss'],
  activityTimeout: 30000,
  pongTimeout: 5000,
  enableStats: false,
})

// 连接状态监听
pusher.connection.bind('connected', () => {
  console.log('Pusher 已连接')
})

pusher.connection.bind('disconnected', () => {
  console.warn('Pusher 断开，等待自动重连...')
})

pusher.connection.bind('error', (err) => {
  console.error('Pusher 连接错误', err)
})

pusher.connection.bind('state_change', ({ previous, current }) => {
  console.log(`Pusher 状态: ${previous} → ${current}`)
})

// 页面切到后台再回来时主动检测连接
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (pusher.connection.state !== 'connected') {
      pusher.connect()
    }
  }
})

export default pusher
