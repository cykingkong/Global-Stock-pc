import pusher from './pusher'

const subscribedChannels: Record<string, any> = {}

export function subscribeQuotes(stocks: any[], updateCallback: (symbol: string, data: any) => void) {
  stocks.forEach((item) => {
    const symbol = item.symbol
    if (!symbol || subscribedChannels[symbol]) return

    const channel = pusher.subscribe(`quote.${symbol}`)
    channel.bind('quote.updated', (raw: any) => {
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      updateCallback(symbol, data)
    })
    subscribedChannels[symbol] = channel
  })
}

export function unsubscribeAllQuotes() {
  Object.keys(subscribedChannels).forEach((symbol) => {
    pusher.unsubscribe(`quote.${symbol}`)
    delete subscribedChannels[symbol]
  })
}
