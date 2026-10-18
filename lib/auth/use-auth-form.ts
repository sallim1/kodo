'use client'

import { useState, type FormEvent } from 'react'
import { useLanguage } from '@/lib/i18n/provider'
import type { FieldErrors } from '@/lib/auth/validation'

type FormValues = Record<string, string | boolean>

/**
 * In-memory form state for the authentication screens. Values live only in React
 * state and are cleared after a valid submission; nothing is written to browser
 * storage and nothing is sent anywhere.
 */
export function useAuthForm<T extends FormValues>(
  initialValues: T,
  validate: (values: T) => FieldErrors<T>,
) {
  const { t } = useLanguage()
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FieldErrors<T>>({})
  const [attempted, setAttempted] = useState(false)
  const [validated, setValidated] = useState(false)

  function setValue<K extends keyof T>(name: K, value: T[K]) {
    const next = { ...values, [name]: value } as T
    setValues(next)
    setValidated(false)
    if (attempted) setErrors(validate(next))
  }

  function validateField(name: keyof T) {
    const fieldError = validate(values)[name]
    setErrors((previous) => ({ ...previous, [name]: fieldError }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validate(values)
    setAttempted(true)
    setErrors(result)

    if (Object.keys(result).length > 0) {
      setValidated(false)
      const firstInvalid = Array.from(event.currentTarget.elements).find(
        (element): element is HTMLInputElement =>
          element instanceof HTMLInputElement && element.name in result,
      )
      firstInvalid?.focus()
      return
    }

    setValues(initialValues)
    setErrors({})
    setAttempted(false)
    setValidated(true)
  }

  const messages: Partial<Record<keyof T, string>> = {}
  for (const key of Object.keys(errors) as (keyof T)[]) {
    const code = errors[key]
    if (code) messages[key] = t.auth.errors[code]
  }

  return { values, messages, validated, setValue, validateField, handleSubmit }
}
