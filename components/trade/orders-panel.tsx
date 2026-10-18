'use client'

import { Inbox } from 'lucide-react'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { AMOUNT_DECIMALS, DEFAULT_AMOUNT_DECIMALS } from '@/data/trading'
import { formatAmount, formatPrice, formatTime, formatUsd } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import type { DemoOrder, DemoTrade, OrderSide } from '@/lib/trading/types'
import { cn } from '@/lib/utils'

interface OrdersPanelProps {
  orders: DemoOrder[]
  trades: DemoTrade[]
  onCancel: (orderId: string) => void
  className?: string
}

const headClass = 'px-3 py-2 text-start text-xs font-medium whitespace-nowrap text-muted-foreground'
const cellClass = 'px-3 py-2.5 text-sm whitespace-nowrap tabular-nums'

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <Inbox className="size-8 text-muted-foreground/60" aria-hidden="true" />
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function SideLabel({ side }: { side: OrderSide }) {
  const { t } = useLanguage()
  return (
    <span className={cn('font-semibold', side === 'buy' ? 'text-gain' : 'text-loss')}>{t.trade.order[side]}</span>
  )
}

function decimalsFor(base: string) {
  return AMOUNT_DECIMALS[base] ?? DEFAULT_AMOUNT_DECIMALS
}

function TableShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse" aria-label={label}>
        {children}
      </table>
    </div>
  )
}

export function OrdersPanel({ orders, trades, onCancel, className }: OrdersPanelProps) {
  const { t } = useLanguage()
  const h = t.trade.history
  const openOrders = orders.filter((order) => order.status === 'open')
  const closedOrders = orders.filter((order) => order.status !== 'open')

  return (
    <section
      aria-label={h.label}
      className={cn('min-w-0 rounded-2xl border border-border bg-card px-2 pb-2 sm:px-3', className)}
    >
      <Tabs defaultValue="open">
        <TabsList aria-label={h.label}>
          <TabsTab value="open">
            {h.open}
            {openOrders.length > 0 ? (
              <span className="rounded-full bg-brand-violet/25 px-1.5 text-xs font-semibold text-violet-200">
                {openOrders.length}
              </span>
            ) : null}
          </TabsTab>
          <TabsTab value="orders">{h.orders}</TabsTab>
          <TabsTab value="trades">{h.trades}</TabsTab>
        </TabsList>

        <TabsPanel value="open">
          {openOrders.length === 0 ? (
            <EmptyState message={h.empty.open} />
          ) : (
            <TableShell label={h.open}>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className={headClass}>{h.columns.time}</th>
                  <th scope="col" className={headClass}>{h.columns.pair}</th>
                  <th scope="col" className={headClass}>{h.columns.side}</th>
                  <th scope="col" className={headClass}>{h.columns.type}</th>
                  <th scope="col" className={headClass}>{h.columns.price}</th>
                  <th scope="col" className={headClass}>{h.columns.amount}</th>
                  <th scope="col" className={headClass}>{h.columns.total}</th>
                  <th scope="col" className={headClass}>{h.columns.action}</th>
                </tr>
              </thead>
              <tbody>
                {openOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 last:border-0">
                    <td className={cellClass}>{formatTime(order.createdAt)}</td>
                    <td className={cellClass} dir="ltr">{order.base}/USDT</td>
                    <td className={cellClass}><SideLabel side={order.side} /></td>
                    <td className={cellClass}>{t.trade.order[order.type]}</td>
                    <td className={cellClass}>{formatPrice(order.price)}</td>
                    <td className={cellClass}>{formatAmount(order.amount, decimalsFor(order.base))}</td>
                    <td className={cellClass}>{formatUsd(order.price * order.amount)}</td>
                    <td className={cellClass}>
                      <button
                        type="button"
                        onClick={() => onCancel(order.id)}
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-medium outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {h.cancel}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </TabsPanel>

        <TabsPanel value="orders">
          {closedOrders.length === 0 ? (
            <EmptyState message={h.empty.orders} />
          ) : (
            <TableShell label={h.orders}>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className={headClass}>{h.columns.time}</th>
                  <th scope="col" className={headClass}>{h.columns.pair}</th>
                  <th scope="col" className={headClass}>{h.columns.side}</th>
                  <th scope="col" className={headClass}>{h.columns.type}</th>
                  <th scope="col" className={headClass}>{h.columns.price}</th>
                  <th scope="col" className={headClass}>{h.columns.amount}</th>
                  <th scope="col" className={headClass}>{h.columns.status}</th>
                </tr>
              </thead>
              <tbody>
                {closedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 last:border-0">
                    <td className={cellClass}>{formatTime(order.updatedAt)}</td>
                    <td className={cellClass} dir="ltr">{order.base}/USDT</td>
                    <td className={cellClass}><SideLabel side={order.side} /></td>
                    <td className={cellClass}>{t.trade.order[order.type]}</td>
                    <td className={cellClass}>{formatPrice(order.price)}</td>
                    <td className={cellClass}>{formatAmount(order.amount, decimalsFor(order.base))}</td>
                    <td className={cellClass}>
                      <span
                        className={cn(
                          'rounded-md px-2 py-0.5 text-xs font-semibold',
                          order.status === 'filled' ? 'bg-gain/12 text-gain' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {h.status[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </TabsPanel>

        <TabsPanel value="trades">
          {trades.length === 0 ? (
            <EmptyState message={h.empty.trades} />
          ) : (
            <TableShell label={h.trades}>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className={headClass}>{h.columns.time}</th>
                  <th scope="col" className={headClass}>{h.columns.pair}</th>
                  <th scope="col" className={headClass}>{h.columns.side}</th>
                  <th scope="col" className={headClass}>{h.columns.price}</th>
                  <th scope="col" className={headClass}>{h.columns.amount}</th>
                  <th scope="col" className={headClass}>{h.columns.fee}</th>
                  <th scope="col" className={headClass}>{h.columns.total}</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-border/60 last:border-0">
                    <td className={cellClass}>{formatTime(trade.time)}</td>
                    <td className={cellClass} dir="ltr">{trade.base}/USDT</td>
                    <td className={cellClass}><SideLabel side={trade.side} /></td>
                    <td className={cellClass}>{formatPrice(trade.price)}</td>
                    <td className={cellClass}>{formatAmount(trade.amount, decimalsFor(trade.base))}</td>
                    <td className={cellClass}>{formatUsd(trade.fee)}</td>
                    <td className={cellClass}>{formatUsd(trade.price * trade.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </TabsPanel>
      </Tabs>
    </section>
  )
}
