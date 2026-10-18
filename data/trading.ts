export const DEMO_START_BALANCE = 10_000

/** Simulated trading fee applied to every filled order (0.1%). */
export const FEE_RATE = 0.001

/** Number of decimals shown for order amounts, by base asset. */
export const AMOUNT_DECIMALS: Record<string, number> = {
  BTC: 5,
  ETH: 4,
  SOL: 2,
  XRP: 1,
  BNB: 3,
}

export const DEFAULT_AMOUNT_DECIMALS = 4

export const TIMEFRAMES = [
  { id: '1m', seconds: 60 },
  { id: '15m', seconds: 900 },
  { id: '1h', seconds: 3600 },
] as const

export type TimeframeId = (typeof TIMEFRAMES)[number]['id']

export const DEFAULT_TIMEFRAME: TimeframeId = '15m'

export const CANDLE_COUNT = 120
export const ORDER_BOOK_LEVELS = 8
export const PRICE_TICK_MS = 1000
