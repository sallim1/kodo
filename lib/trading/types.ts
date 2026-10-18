export type OrderSide = 'buy' | 'sell'
export type OrderType = 'market' | 'limit'
export type OrderStatus = 'open' | 'filled' | 'cancelled'

export interface Candle {
  /** Unix timestamp in seconds. */
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface BookLevel {
  price: number
  amount: number
  /** Cumulative amount from the best price outwards. */
  total: number
}

export interface OrderBookSnapshot {
  /** Sell levels, highest price first. */
  asks: BookLevel[]
  /** Buy levels, highest price first. */
  bids: BookLevel[]
  spread: number
}

export interface DemoOrder {
  id: string
  pairId: string
  base: string
  side: OrderSide
  type: OrderType
  price: number
  amount: number
  status: OrderStatus
  createdAt: number
  updatedAt: number
}

export interface DemoTrade {
  id: string
  orderId: string
  pairId: string
  base: string
  side: OrderSide
  type: OrderType
  price: number
  amount: number
  /** Simulated fee in USDT. */
  fee: number
  time: number
}

export interface DemoAccount {
  /** Available virtual USDT (excludes funds reserved by open orders). */
  usdt: number
  /** Available virtual holdings keyed by base asset symbol. */
  holdings: Record<string, number>
  orders: DemoOrder[]
  trades: DemoTrade[]
  counter: number
}

export interface PlaceOrderInput {
  side: OrderSide
  orderType: OrderType
  price: number
  amount: number
}

export interface PresetPrice {
  price: number
  key: number
}
