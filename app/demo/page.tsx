import type { Metadata } from 'next'
import { SiteShell } from '@/components/layout/site-shell'
import { TradeWorkspace } from '@/components/trade/trade-workspace'

export const metadata: Metadata = {
  title: 'Demo Trading | Bitget',
  description:
    'Practice crypto trading with virtual funds. All prices, balances and trades are simulated for education.',
}

export default function DemoPage() {
  return (
    <SiteShell>
      <TradeWorkspace />
    </SiteShell>
  )
}
