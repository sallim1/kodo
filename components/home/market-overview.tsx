'use client'

import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, Info, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChangeBadge } from '@/components/change-badge'
import { SectionHeading } from '@/components/section-heading'
import { Sparkline } from '@/components/sparkline'
import { buttonVariants } from '@/components/ui/button'
import { marketPairs, type MarketPair } from '@/data/markets'
import { formatCompactUsd, formatPrice } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

type FilterKey = 'all' | 'gainers' | 'losers'
type SortKey = 'pair' | 'price' | 'change24h' | 'volume24h'
type SortDirection = 'asc' | 'desc'

const FILTER_KEYS: FilterKey[] = ['all', 'gainers', 'losers']

function getSortValue(pair: MarketPair, key: SortKey): string | number {
  return key === 'pair' ? pair.base : pair[key]
}

interface SortableHeaderProps {
  label: string
  sortKey: SortKey
  activeKey: SortKey
  direction: SortDirection
  onSort: (key: SortKey) => void
  align?: 'start' | 'end'
}

function SortableHeader({ label, sortKey, activeKey, direction, onSort, align = 'start' }: SortableHeaderProps) {
  const active = activeKey === sortKey
  const Icon = !active ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-semibold uppercase tracking-wide outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
        align === 'end' && 'flex-row-reverse text-end',
        active ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      {label}
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  )
}

export function MarketOverview() {
  const { t } = useLanguage()
  const { markets } = t
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sortKey, setSortKey] = useState<SortKey>('volume24h')
  const [direction, setDirection] = useState<SortDirection>('desc')

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return marketPairs
      .filter((pair) => {
        if (filter === 'gainers' && pair.change24h < 0) return false
        if (filter === 'losers' && pair.change24h >= 0) return false
        if (!normalized) return true
        return `${pair.base} ${pair.name}`.toLowerCase().includes(normalized)
      })
      .sort((a, b) => {
        const left = getSortValue(a, sortKey)
        const right = getSortValue(b, sortKey)
        const result =
          typeof left === 'string' && typeof right === 'string'
            ? left.localeCompare(right)
            : Number(left) - Number(right)
        return direction === 'asc' ? result : -result
      })
  }, [query, filter, sortKey, direction])

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setDirection(key === 'pair' ? 'asc' : 'desc')
  }

  function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (key !== sortKey) return 'none'
    return direction === 'asc' ? 'ascending' : 'descending'
  }

  const headerProps = { activeKey: sortKey, direction, onSort: handleSort }

  return (
    <section id="markets" aria-labelledby="markets-title" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="markets-title"
          eyebrow={markets.eyebrow}
          title={markets.title}
          description={markets.description}
        />

        <p
          role="note"
          className="mt-6 inline-flex items-start gap-2 rounded-lg border border-brand-violet/30 bg-brand-violet/10 px-3 py-2 text-sm text-foreground"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-brand-violet" aria-hidden="true" />
          {markets.notice}
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label={markets.filtersLabel} className="inline-flex gap-1 rounded-lg bg-muted p-1">
              {FILTER_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    'rounded-md px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                    filter === key
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {markets.filters[key]}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <label htmlFor="market-search" className="sr-only">
                {markets.searchLabel}
              </label>
              <Search
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="market-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={markets.searchPlaceholder}
                autoComplete="off"
                className="h-10 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[22rem] text-sm">
              <caption className="sr-only">
                {markets.title}. {markets.notice}
              </caption>
              <thead>
                <tr className="border-b border-border text-start">
                  <th scope="col" aria-sort={ariaSort('pair')} className="px-4 py-3 text-start font-normal">
                    <SortableHeader label={markets.columns.pair} sortKey="pair" {...headerProps} />
                  </th>
                  <th scope="col" aria-sort={ariaSort('price')} className="px-4 py-3 text-end font-normal">
                    <SortableHeader label={markets.columns.price} sortKey="price" align="end" {...headerProps} />
                  </th>
                  <th scope="col" aria-sort={ariaSort('change24h')} className="px-4 py-3 text-end font-normal">
                    <SortableHeader label={markets.columns.change} sortKey="change24h" align="end" {...headerProps} />
                  </th>
                  <th
                    scope="col"
                    aria-sort={ariaSort('volume24h')}
                    className="hidden px-4 py-3 text-end font-normal md:table-cell"
                  >
                    <SortableHeader label={markets.columns.volume} sortKey="volume24h" align="end" {...headerProps} />
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell"
                  >
                    {markets.columns.trend}
                  </th>
                  <th scope="col" className="hidden px-4 py-3 md:table-cell">
                    <span className="sr-only">{markets.columns.action}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((pair) => (
                  <tr key={pair.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                    <th scope="row" className="px-4 py-4 text-start font-normal">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-blue/30 to-brand-violet/30 text-[0.65rem] font-bold"
                        >
                          {pair.base.slice(0, 3)}
                        </span>
                        <div dir="ltr" className="text-start">
                          <p className="font-semibold">
                            {pair.base}
                            <span className="text-muted-foreground">/{pair.quote}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{pair.name}</p>
                        </div>
                      </div>
                    </th>
                    <td dir="ltr" className="px-4 py-4 text-end font-semibold tabular-nums">
                      {formatPrice(pair.price)}
                    </td>
                    <td className="px-4 py-4 text-end">
                      <ChangeBadge value={pair.change24h} />
                    </td>
                    <td dir="ltr" className="hidden px-4 py-4 text-end tabular-nums text-muted-foreground md:table-cell">
                      {formatCompactUsd(pair.volume24h)}
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <Sparkline data={pair.trend} positive={pair.change24h >= 0} className="mx-auto" />
                    </td>
                    <td className="hidden px-4 py-4 text-end md:table-cell">
                      <Link
                        href="/demo"
                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-8 px-3')}
                      >
                        {markets.practice}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p role="status" className="px-4 py-10 text-center text-muted-foreground">
                {markets.empty}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/demo" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 gap-2 px-5')}>
            {markets.cta}
            <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
