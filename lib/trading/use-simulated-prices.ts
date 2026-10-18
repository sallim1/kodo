'use client'

import { useEffect, useState } from 'react'
import type { MarketPair } from '@/data/markets'
import { PRICE_TICK_MS } from '@/data/trading'
import { nextSimulatedPrice } from './simulation'

export interface SimulatedPrices {
  prices: Record<string, number>
  previous: Record<string, number>
  tick: number
}

function initialPrices(pairs: MarketPair[]): Record<string, number> {
  return Object.fromEntries(pairs.map((pair) => [pair.id, pair.price]))
}

/**
 * Moves every sample price with a small random walk once per tick. The initial
 * state matches the static sample data so server and client render identically.
 */
export function useSimulatedPrices(pairs: MarketPair[]): SimulatedPrices {
  const [state, setState] = useState<SimulatedPrices>(() => ({
    prices: initialPrices(pairs),
    previous: initialPrices(pairs),
    tick: 0,
  }))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((current) => {
        const prices: Record<string, number> = {}
        for (const pair of pairs) {
          prices[pair.id] = nextSimulatedPrice(current.prices[pair.id], pair.price)
        }
        return { prices, previous: current.prices, tick: current.tick + 1 }
      })
    }, PRICE_TICK_MS)

    return () => window.clearInterval(interval)
  }, [pairs])

  return state
}
