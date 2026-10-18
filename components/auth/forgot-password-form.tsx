'use client'

import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import Link from 'next/link'
import { AuthCard, authLinkClass } from '@/components/auth/auth-card'
import { FormField } from '@/components/auth/form-field'
import { PreviewStatus } from '@/components/auth/preview-status'
import { SubmitButton } from '@/components/auth/submit-button'
import { useAuthForm } from '@/lib/auth/use-auth-form'
import { validateForgotPassword, type ForgotPasswordValues } from '@/lib/auth/validation'
import { useLanguage } from '@/lib/i18n/provider'

const initialValues: ForgotPasswordValues = { email: '' }

export function ForgotPasswordForm() {
  const { t } = useLanguage()
  const { auth } = t
  const form = useAuthForm(initialValues, validateForgotPassword)

  return (
    <AuthCard
      icon={KeyRound}
      title={auth.forgot.title}
      description={auth.forgot.description}
      footer={
        <Link href="/login" className={`${authLinkClass} inline-flex items-center gap-1.5`}>
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          {auth.forgot.back}
        </Link>
      }
    >
      <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
        <FormField
          name="email"
          type="email"
          inputMode="email"
          label={auth.fields.email.label}
          placeholder={auth.fields.email.placeholder}
          icon={Mail}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={form.values.email}
          onValueChange={(value) => form.setValue('email', value)}
          onBlur={() => form.validateField('email')}
          error={form.messages.email}
        />
        <SubmitButton>{auth.forgot.submit}</SubmitButton>
        <PreviewStatus show={form.validated} text={auth.forgot.previewText} />
      </form>
    </AuthCard>
  )
}
