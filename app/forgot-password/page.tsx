import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { SiteShell } from '@/components/layout/site-shell'

export const metadata: Metadata = {
  title: 'Reset Password | Bitget',
  description: 'Request a password reset for the Bitget educational demo trading platform.',
}

export default function ForgotPasswordPage() {
  return (
    <SiteShell>
      <ForgotPasswordForm />
    </SiteShell>
  )
}
