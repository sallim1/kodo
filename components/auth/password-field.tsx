'use client'

import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { FormField, type FormFieldProps } from '@/components/auth/form-field'
import { useLanguage } from '@/lib/i18n/provider'

export function PasswordField(props: Omit<FormFieldProps, 'type' | 'icon' | 'trailing'>) {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  return (
    <FormField
      {...props}
      type={visible ? 'text' : 'password'}
      icon={Lock}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? t.auth.hidePassword : t.auth.showPassword}
          className="absolute end-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      }
    />
  )
}
