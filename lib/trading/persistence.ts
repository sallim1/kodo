import type { DemoAccount, DemoOrder, DemoTrade, OrderSide, OrderStatus, OrderType } from './types'

export const DEMO_STORAGE_KEY = 'bitget-demo-account'
const STORAGE_VERSION = 1

interface StoredAccount {
  version: number
  account: DemoAccount
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const isPositive = (value: unknown): value is number => isNumber(value) && value > 0
const isNonNegative = (value: unknown): value is number => isNumber(value) && value >= 0
const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0

const isSide = (value: unknown): value is OrderSide => value === 'buy' || value === 'sell'
const isType = (value: unknown): value is OrderType => value === 'market' || value === 'limit'
const isStatus = (value: unknown): value is OrderStatus =>
  value === 'open' || value === 'filled' || value === 'cancelled'

function parseOrder(value: unknown): DemoOrder | null {
  if (!isRecord(value)) return null
  const { id, pairId, base, side, type, price, amount, status, createdAt, updatedAt } = value
  if (!isText(id) || !isText(pairId) || !isText(base)) return null
  if (!isSide(side) || !isType(type) || !isStatus(status)) return null
  if (!isPositive(price) || !isPositive(amount)) return null
  if (!isNumber(createdAt) || !isNumber(updatedAt)) return null
  return { id, pairId, base, side, type, price, amount, status, createdAt, updatedAt }
}

function parseTrade(value: unknown): DemoTrade | null {
  if (!isRecord(value)) return null
  const { id, orderId, pairId, base, side, type, price, amount, fee, time } = value
  if (!isText(id) || !isText(orderId) || !isText(pairId) || !isText(base)) return null
  if (!isSide(side) || !isType(type)) return null
  if (!isPositive(price) || !isPositive(amount) || !isNonNegative(fee) || !isNumber(time)) return null
  return { id, orderId, pairId, base, side, type, price, amount, fee, time }
}

function parseList<T>(value: unknown, parseItem: (item: unknown) => T | null): T[] | null {
  if (!Array.isArray(value)) return null
  const items: T[] = []
  for (const entry of value) {
    const parsed = parseItem(entry)
    if (!parsed) return null
    items.push(parsed)
  }
  return items
}

function parseHoldings(value: unknown): Record<string, number> | null {
  if (!isRecord(value)) return null
  const holdings: Record<string, number> = {}
  for (const [symbol, units] of Object.entries(value)) {
    if (!isNonNegative(units)) return null
    holdings[symbol] = units
  }
  return holdings
}

/** Returns a fully validated account, or null if anything is missing or malformed. */
export function parseAccount(value: unknown): DemoAccount | null {
  if (!isRecord(value)) return null
  const { usdt, holdings, orders, trades, counter } = value
  if (!isNonNegative(usdt)) return null
  if (!isNonNegative(counter) || !Number.isInteger(counter)) return null

  const parsedHoldings = parseHoldings(holdings)
  const parsedOrders = parseList(orders, parseOrder)
  const parsedTrades = parseList(trades, parseTrade)
  if (!parsedHoldings || !parsedOrders || !parsedTrades) return null

  return { usdt, holdings: parsedHoldings, orders: parsedOrders, trades: parsedTrades, counter }
}

export function loadDemoAccount(): DemoAccount | null {
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY)
    if (!raw) return null
    const stored: unknown = JSON.parse(raw)
    if (!isRecord(stored) || stored.version !== STORAGE_VERSION) return null
    return parseAccount(stored.account)
  } catch {
    return null
  }
}

export function saveDemoAccount(account: DemoAccount): void {
  try {
    const payload: StoredAccount = { version: STORAGE_VERSION, account }
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Storage can be full or blocked (private mode); the demo keeps working in memory.
  }
}

export function clearDemoAccount(): void {
  try {
    window.localStorage.removeItem(DEMO_STORAGE_KEY)
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
