'use client'

import { Mail, User, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { AuthCard, authLinkClass } from '@/components/auth/auth-card'
import { CheckboxField } from '@/components/auth/checkbox-field'
import { FormField } from '@/components/auth/form-field'
import { PasswordField } from '@/components/auth/password-field'
import { PreviewStatus } from '@/components/auth/preview-status'
import { SubmitButton } from '@/components/auth/submit-button'
import { useAuthForm } from '@/lib/auth/use-auth-form'
import { validateRegister, type RegisterValues } from '@/lib/auth/validation'
import { useLanguage } from '@/lib/i18n/provider'

const initialValues: RegisterValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
}

export function RegisterForm() {
  const { t } = useLanguage()
  const { auth } = t
  const form = useAuthForm(initialValues, validateRegister)

  return (
    <AuthCard
      icon={UserPlus}
      title={auth.register.title}
      description={auth.register.description}
      footer={
        <>
          {auth.register.haveAccount}{' '}
          <Link href="/login" className={authLinkClass}>
            {auth.register.signIn}
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={form.handleSubmit} className="space-y-4">
        <FormField
          name="username"
          label={auth.fields.username.label}
          placeholder={auth.fields.username.placeholder}
          hint={auth.fields.username.hint}
          icon={User}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={form.values.username}
          onValueChange={(value) => form.setValue('username', value)}
          onBlur={() => form.validateField('username')}
          error={form.messages.username}
        />
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
        <PasswordField
          name="password"
          label={auth.fields.newPassword.label}
          placeholder={auth.fields.newPassword.placeholder}
          hint={auth.fields.newPassword.hint}
          autoComplete="new-password"
          required
          value={form.values.password}
          onValueChange={(value) => form.setValue('password', value)}
          onBlur={() => form.validateField('password')}
          error={form.messages.password}
        />
        <PasswordField
          name="confirmPassword"
          label={auth.fields.confirmPassword.label}
          placeholder={auth.fields.confirmPassword.placeholder}
          autoComplete="new-password"
          required
          value={form.values.confirmPassword}
          onValueChange={(value) => form.setValue('confirmPassword', value)}
          onBlur={() => form.validateField('confirmPassword')}
          error={form.messages.confirmPassword}
        />

        <CheckboxField
          name="terms"
          checked={form.values.terms}
          onCheckedChange={(checked) => form.setValue('terms', checked)}
          error={form.messages.terms}
        >
          {auth.register.termsPrefix}
          <Link href="/terms" target="_blank" rel="noopener" className={authLinkClass}>
            {auth.register.termsLink}
            <span className="sr-only"> {auth.register.opensNewTab}</span>
          </Link>
          {auth.register.termsSeparator}
          <Link href="/privacy" target="_blank" rel="noopener" className={authLinkClass}>
            {auth.register.privacyLink}
            <span className="sr-only"> {auth.register.opensNewTab}</span>
          </Link>
        </CheckboxField>

        <SubmitButton>{auth.register.submit}</SubmitButton>
        <PreviewStatus show={form.validated} text={auth.register.previewText} />
      </form>
    </AuthCard>
  )
}
