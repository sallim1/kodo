import type { MarketPair } from '@/data/markets'
import { DEMO_START_BALANCE, FEE_RATE } from '@/data/trading'
import type { DemoAccount, DemoOrder, DemoTrade, OrderSide, OrderType } from './types'

const round = (value: number) => Math.round(value * 1e8) / 1e8

export type DemoAction =
  | { type: 'place'; pair: MarketPair; side: OrderSide; orderType: OrderType; price: number; amount: number; now: number }
  | { type: 'cancel'; orderId: string; now: number }
  | { type: 'tick'; prices: Record<string, number>; now: number }
  | { type: 'reset' }

export function createInitialAccount(): DemoAccount {
  return { usdt: DEMO_START_BALANCE, holdings: {}, orders: [], trades: [], counter: 0 }
}

/** Credits the proceeds of an order whose funds were already reserved. */
function settleOrder(account: DemoAccount, order: DemoOrder, now: number): DemoAccount {
  const cost = round(order.price * order.amount)
  const fee = round(cost * FEE_RATE)
  const counter = account.counter + 1

  const trade: DemoTrade = {
    id: `T-${counter}`,
    orderId: order.id,
    pairId: order.pairId,
    base: order.base,
    side: order.side,
    type: order.type,
    price: order.price,
    amount: order.amount,
    fee,
    time: now,
  }

  const filled: DemoOrder = { ...order, status: 'filled', updatedAt: now }
  const exists = account.orders.some((item) => item.id === order.id)
  const orders = exists
    ? account.orders.map((item) => (item.id === order.id ? filled : item))
    : [filled, ...account.orders]

  return {
    ...account,
    usdt: order.side === 'sell' ? round(account.usdt + cost - fee) : account.usdt,
    holdings:
      order.side === 'buy'
        ? { ...account.holdings, [order.base]: round((account.holdings[order.base] ?? 0) + order.amount) }
        : account.holdings,
    orders,
    trades: [trade, ...account.trades],
    counter,
  }
}

export function demoReducer(state: DemoAccount, action: DemoAction): DemoAccount {
  switch (action.type) {
    case 'place': {
      const { pair, side, orderType, price, amount, now } = action
      if (!(price > 0) || !(amount > 0)) return state

      const cost = round(price * amount)
      const fee = round(cost * FEE_RATE)
      const held = state.holdings[pair.base] ?? 0
      if (side === 'buy' && state.usdt < cost + fee) return state
      if (side === 'sell' && held < amount) return state

      const counter = state.counter + 1
      const order: DemoOrder = {
        id: `O-${counter}`,
        pairId: pair.id,
        base: pair.base,
        side,
        type: orderType,
        price,
        amount,
        status: 'open',
        createdAt: now,
        updatedAt: now,
      }

      const reserved: DemoAccount = {
        ...state,
        counter,
        usdt: side === 'buy' ? round(state.usdt - cost - fee) : state.usdt,
        holdings: side === 'sell' ? { ...state.holdings, [pair.base]: round(held - amount) } : state.holdings,
        orders: [order, ...state.orders],
      }

      return orderType === 'market' ? settleOrder(reserved, order, now) : reserved
    }

    case 'cancel': {
      const order = state.orders.find((item) => item.id === action.orderId && item.status === 'open')
      if (!order) return state

      const refundUsdt = order.side === 'buy' ? round(order.price * order.amount * (1 + FEE_RATE)) : 0
      return {
        ...state,
        usdt: round(state.usdt + refundUsdt),
        holdings:
          order.side === 'sell'
            ? { ...state.holdings, [order.base]: round((state.holdings[order.base] ?? 0) + order.amount) }
            : state.holdings,
        orders: state.orders.map((item) =>
          item.id === order.id ? { ...item, status: 'cancelled', updatedAt: action.now } : item,
        ),
      }
    }

    case 'tick': {
      let next = state
      for (const order of state.orders) {
        if (order.status !== 'open') continue
        const price = action.prices[order.pairId]
        if (price === undefined) continue
        const reached = order.side === 'buy' ? price <= order.price : price >= order.price
        if (reached) next = settleOrder(next, order, action.now)
      }
      return next
    }

    case 'reset':
      return createInitialAccount()

    default:
      return state
  }
}

export interface AccountSummary {
  available: number
  reservedUsdt: number
  equity: number
  pnl: number
  pnlPercent: number
}

export function summarizeAccount(
  account: DemoAccount,
  pairs: MarketPair[],
  prices: Record<string, number>,
): AccountSummary {
  let reservedUsdt = 0
  const reservedBase: Record<string, number> = {}

  for (const order of account.orders) {
    if (order.status !== 'open') continue
    if (order.side === 'buy') {
      reservedUsdt += order.price * order.amount * (1 + FEE_RATE)
    } else {
      reservedBase[order.base] = (reservedBase[order.base] ?? 0) + order.amount
    }
  }

  let equity = account.usdt + reservedUsdt
  for (const pair of pairs) {
    const units = (account.holdings[pair.base] ?? 0) + (reservedBase[pair.base] ?? 0)
    equity += units * (prices[pair.id] ?? pair.price)
  }

  const pnl = equity - DEMO_START_BALANCE
  return {
    available: account.usdt,
    reservedUsdt,
    equity,
    pnl,
    pnlPercent: (pnl / DEMO_START_BALANCE) * 100,
  }
}
