'use client'

import { AlertCircle, type LucideIcon } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type FormFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'value' | 'onChange'
> & {
  name: string
  label: string
  value: string
  onValueChange: (value: string) => void
  error?: string
  hint?: string
  icon?: LucideIcon
  trailing?: ReactNode
}

export function FormField({
  name,
  label,
  value,
  onValueChange,
  error,
  hint,
  icon: Icon,
  trailing,
  className,
  ...inputProps
}: FormFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
        <input
          id={id}
          name={name}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full rounded-lg border border-input bg-input/30 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
            Icon ? 'ps-10' : 'ps-3',
            trailing ? 'pe-11' : 'pe-3',
            className,
          )}
          {...inputProps}
        />
        {trailing}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}
