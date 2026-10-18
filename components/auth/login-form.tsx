'use client'

import { LogIn, User } from 'lucide-react'
import Link from 'next/link'
import { AuthCard, authLinkClass } from '@/components/auth/auth-card'
import { CheckboxField } from '@/components/auth/checkbox-field'
import { FormField } from '@/components/auth/form-field'
import { PasswordField } from '@/components/auth/password-field'
import { PreviewStatus } from '@/components/auth/preview-status'
import { SubmitButton } from '@/components/auth/submit-button'
import { useAuthForm } from '@/lib/auth/use-auth-form'
import { validateLogin, type LoginValues } from '@/lib/auth/validation'
import { useLanguage } from '@/lib/i18n/provider'

const initialValues: LoginValues = { identifier: '', password: '', remember: false }

export function LoginForm() {
  const { t } = useLanguage()
  const { auth } = t
  const form = useAuthForm(initialValues, validateLogin)

  return (
    <AuthCard
      icon={LogIn}
      title={auth.login.title}
      description={auth.login.description}
      footer={
        <>
          {auth.login.noAccount}{' '}
          <Link href="/register" className={authLinkClass}>
            {auth.login.createAccount}
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
        <FormField
          name="identifier"
          label={auth.fields.identifier.label}
          placeholder={auth.fields.identifier.placeholder}
          icon={User}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={form.values.identifier}
          onValueChange={(value) => form.setValue('identifier', value)}
          onBlur={() => form.validateField('identifier')}
          error={form.messages.identifier}
        />
        <PasswordField
          name="password"
          label={auth.fields.password.label}
          placeholder={auth.fields.password.placeholder}
          autoComplete="current-password"
          required
          value={form.values.password}
          onValueChange={(value) => form.setValue('password', value)}
          onBlur={() => form.validateField('password')}
          error={form.messages.password}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <CheckboxField
            name="remember"
            checked={form.values.remember}
            onCheckedChange={(checked) => form.setValue('remember', checked)}
          >
            {auth.login.remember}
          </CheckboxField>
          <Link href="/forgot-password" className={`${authLinkClass} text-sm`}>
            {auth.login.forgot}
          </Link>
        </div>

        <SubmitButton>{auth.login.submit}</SubmitButton>
        <PreviewStatus show={form.validated} text={auth.login.previewText} />
      </form>
    </AuthCard>
  )
}
