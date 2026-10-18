import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import { SiteShell } from '@/components/layout/site-shell'

export const metadata: Metadata = {
  title: 'Sign In | Bitget',
  description: 'Sign in to the Bitget educational demo trading platform. Virtual funds only.',
}

export default function LoginPage() {
  return (
    <SiteShell>
      <LoginForm />
    </SiteShell>
  )
}
