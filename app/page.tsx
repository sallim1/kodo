import { DemoAccount } from '@/components/home/demo-account'
import { Faq } from '@/components/home/faq'
import { Features } from '@/components/home/features'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { MarketOverview } from '@/components/home/market-overview'
import { SiteShell } from '@/components/layout/site-shell'

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <MarketOverview />
      <DemoAccount />
      <Features />
      <HowItWorks />
      <Faq />
    </SiteShell>
  )
}
