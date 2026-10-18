export interface MarketPair {
  id: string
  base: string
  quote: 'USDT'
  name: string
  /** Simulated sample price in USDT. Not a live market price. */
  price: number
  /** Simulated 24h change in percent. */
  change24h: number
  /** Simulated 24h volume in USDT. */
  volume24h: number
  /** Normalised sample series used for the trend line. */
  trend: number[]
}

export const marketPairs: MarketPair[] = [
  {
    id: 'btc-usdt',
    base: 'BTC',
    quote: 'USDT',
    name: 'Bitcoin',
    price: 67842.5,
    change24h: 2.14,
    volume24h: 1_840_000_000,
    trend: [48, 50, 47, 49, 52, 51, 54, 53, 56, 55, 58, 57, 56, 59, 61, 60, 63, 62, 65, 67],
  },
  {
    id: 'eth-usdt',
    base: 'ETH',
    quote: 'USDT',
    name: 'Ethereum',
    price: 3412.18,
    change24h: 1.37,
    volume24h: 920_500_000,
    trend: [40, 42, 41, 43, 42, 45, 44, 46, 45, 47, 49, 48, 47, 50, 51, 50, 52, 53, 52, 55],
  },
  {
    id: 'sol-usdt',
    base: 'SOL',
    quote: 'USDT',
    name: 'Solana',
    price: 168.74,
    change24h: -2.86,
    volume24h: 412_300_000,
    trend: [70, 68, 69, 66, 67, 64, 65, 62, 63, 60, 61, 58, 59, 57, 58, 55, 56, 54, 55, 52],
  },
  {
    id: 'xrp-usdt',
    base: 'XRP',
    quote: 'USDT',
    name: 'XRP',
    price: 0.5231,
    change24h: -0.64,
    volume24h: 188_700_000,
    trend: [50, 51, 49, 50, 48, 49, 47, 49, 48, 50, 47, 48, 46, 48, 47, 46, 48, 46, 47, 45],
  },
  {
    id: 'bnb-usdt',
    base: 'BNB',
    quote: 'USDT',
    name: 'BNB',
    price: 592.4,
    change24h: 0.92,
    volume24h: 146_200_000,
    trend: [44, 43, 45, 44, 46, 45, 47, 46, 45, 47, 48, 47, 49, 48, 47, 49, 50, 49, 51, 50],
  },
]
