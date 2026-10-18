import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'
import { SiteShell } from '@/components/layout/site-shell'

export const metadata: Metadata = {
  title: 'Create Account | Bitget',
  description: 'Create an account for the Bitget educational demo trading platform. Virtual funds only.',
}

export default function RegisterPage() {
  return (
    <SiteShell>
      <RegisterForm />
    </SiteShell>
  )
}
