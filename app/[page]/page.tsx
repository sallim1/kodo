import { notFound, redirect } from 'next/navigation'
import { SiteShell } from '@/components/layout/site-shell'
import { PlaceholderPage, type PlaceholderKey } from '@/components/placeholder-page'

const ROUTES: Record<string, PlaceholderKey> = {
  privacy: 'privacy',
  terms: 'terms',
}

const LEGACY_REDIRECTS: Record<string, string> = {
  'sign-in': '/login',
  'sign-up': '/register',
}

export default async function InfoPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params

  const redirectTo = LEGACY_REDIRECTS[page]
  if (redirectTo) redirect(redirectTo)

  const pageKey = ROUTES[page]
  if (!pageKey) notFound()

  return (
    <SiteShell>
      <PlaceholderPage pageKey={pageKey} />
    </SiteShell>
  )
}
